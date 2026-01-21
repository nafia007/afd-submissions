import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Allowed file types for video uploads
const ALLOWED_FILE_TYPES = [
  'video/mp4',
  'video/quicktime',
  'video/x-msvideo',
  'video/webm',
  'video/mpeg',
  'video/x-m4v',
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
]

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Server-side authentication check
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      console.error('No authorization header provided')
      return new Response(
        JSON.stringify({ success: false, error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!
    
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    })

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    if (authError || !user) {
      console.error('Authentication failed:', authError?.message)
      return new Response(
        JSON.stringify({ success: false, error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Authenticated user:', user.id)

    const pinataJwt = Deno.env.get('PINATA_JWT')
    if (!pinataJwt) {
      console.error('PINATA_JWT not configured')
      throw new Error('PINATA_JWT not configured')
    }

    // Get the file from the request
    const formData = await req.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      throw new Error('No file provided')
    }

    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      console.error('Invalid file type:', file.type)
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Invalid file type: ${file.type}. Allowed types: ${ALLOWED_FILE_TYPES.join(', ')}` 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2)
    console.log(`Uploading file to IPFS: ${file.name}, size: ${fileSizeMB} MB, type: ${file.type}, user: ${user.id}`)

    // Validate file size (max 500MB for IPFS upload)
    const maxSize = 500 * 1024 * 1024
    if (file.size > maxSize) {
      throw new Error('File size exceeds 500MB limit for IPFS upload')
    }

    // Upload to Pinata
    const pinataFormData = new FormData()
    pinataFormData.append('file', file)
    
    // Add metadata with name and keyvalues
    const metadata = JSON.stringify({
      name: file.name,
      keyvalues: {
        uploadedAt: new Date().toISOString(),
        fileType: file.type,
        fileSize: file.size.toString(),
        userId: user.id,
      }
    })
    pinataFormData.append('pinataMetadata', metadata)

    // Add pinata options for better pinning
    const options = JSON.stringify({
      cidVersion: 1,
    })
    pinataFormData.append('pinataOptions', options)

    console.log('Sending file to Pinata...')
    
    const pinataResponse = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${pinataJwt}`,
      },
      body: pinataFormData,
    })

    if (!pinataResponse.ok) {
      const errorText = await pinataResponse.text()
      console.error('Pinata error response:', pinataResponse.status, errorText)
      throw new Error('Upload to IPFS failed')
    }

    const pinataData = await pinataResponse.json()
    console.log('Successfully uploaded to IPFS:', pinataData.IpfsHash, 'Size:', pinataData.PinSize)

    // Return the IPFS hash and gateway URL using the custom Pinata gateway
    const gatewayUrl = `https://apricot-initial-meadowlark-382.mypinata.cloud/ipfs/${pinataData.IpfsHash}`
    
    return new Response(
      JSON.stringify({
        success: true,
        ipfsHash: pinataData.IpfsHash,
        ipfsUrl: `ipfs://${pinataData.IpfsHash}`,
        gatewayUrl: gatewayUrl,
        pinSize: pinataData.PinSize,
        timestamp: pinataData.Timestamp,
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error in upload-to-ipfs function:', error)
    return new Response(
      JSON.stringify({ 
        success: false,
        error: 'An error occurred during file upload'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
