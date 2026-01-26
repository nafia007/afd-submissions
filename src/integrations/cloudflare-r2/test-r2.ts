import { r2Client } from './client';

// Simple test function for R2 integration
export async function testR2Integration() {
  console.log('Testing Cloudflare R2 integration...');
  
  // Check if R2 is configured
  if (!r2Client.isConfigured()) {
    console.error('❌ Cloudflare R2 is not configured. Check environment variables.');
    return false;
  }
  
  console.log('✅ Cloudflare R2 is configured');
  
  // Test public URL generation
  const testPath = 'test/video.mp4';
  const publicUrl = r2Client.getPublicUrl(testPath);
  console.log(`✅ Public URL generation test: ${publicUrl}`);
  
  // Verify URL format
  const expectedBaseUrl = import.meta.env.VITE_CLOUDFLARE_R2_PUBLIC_URL;
  if (!publicUrl.startsWith(expectedBaseUrl)) {
    console.error('❌ Public URL format is incorrect');
    return false;
  }
  
  console.log('✅ All basic tests passed');
  return true;
}

// Test with mock file
export async function testFileUpload() {
  console.log('Testing file upload...');
  
  try {
    // Create a mock file
    const mockFile = new Blob(['test content'], { type: 'text/plain' });
    const file = new File([mockFile], 'test.txt', { type: 'text/plain' });
    
    // Try to upload (will fail without proper credentials)
    const url = await r2Client.uploadFile(file, 'test/test.txt');
    console.log(`✅ File upload successful: ${url}`);
    return true;
  } catch (error) {
    console.error('❌ File upload failed (expected without credentials):', error);
    return false;
  }
}
