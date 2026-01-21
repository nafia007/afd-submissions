import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AFDNotificationRequest {
  userEmail: string;
  title: string;
  director: string;
  tier: string;
  description: string;
}

// HTML escape function to prevent XSS in email templates
const escapeHtml = (unsafe: string): string => {
  if (typeof unsafe !== 'string') return '';
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

// Validate email format
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate input lengths
const validateInput = (input: string, maxLength: number): string => {
  if (typeof input !== 'string') return '';
  return input.slice(0, maxLength);
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Server-side authentication check
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('No authorization header provided');
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      console.error('Authentication failed:', authError?.message);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log('Authenticated user:', user.id);

    const { userEmail, title, director, tier, description }: AFDNotificationRequest = await req.json();

    // Validate email format
    if (!isValidEmail(userEmail)) {
      console.error('Invalid email format:', userEmail);
      return new Response(
        JSON.stringify({ error: 'Invalid email format' }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Validate and sanitize inputs
    const safeTitle = escapeHtml(validateInput(title, 200));
    const safeDirector = escapeHtml(validateInput(director, 100));
    const safeTier = escapeHtml(validateInput(tier, 50));
    const safeDescription = escapeHtml(validateInput(description, 2000));
    const safeUserEmail = escapeHtml(userEmail);

    // Send confirmation email to user
    const userEmailResponse = await resend.emails.send({
      from: "AFD Submissions <onboarding@resend.dev>",
      to: [userEmail],
      subject: "AFD Submission Received - " + safeTitle,
      html: `
        <h1>Thank you for your AFD submission!</h1>
        <p>We have successfully received your project submission:</p>
        <ul>
          <li><strong>Title:</strong> ${safeTitle}</li>
          <li><strong>Director:</strong> ${safeDirector}</li>
          <li><strong>Tier:</strong> ${safeTier}</li>
        </ul>
        <p><strong>Description:</strong> ${safeDescription}</p>
        <p>We will review your submission and get back to you soon.</p>
        <p>Best regards,<br>The AFD Team</p>
      `,
    });

    // Send notification email to admin
    const adminEmailResponse = await resend.emails.send({
      from: "AFD Submissions <onboarding@resend.dev>",
      to: ["admin@yourdomain.com"], // Replace with actual admin email
      subject: "New AFD Submission - " + safeTitle,
      html: `
        <h1>New AFD Submission Received</h1>
        <p>A new project has been submitted to AFD:</p>
        <ul>
          <li><strong>Title:</strong> ${safeTitle}</li>
          <li><strong>Director:</strong> ${safeDirector}</li>
          <li><strong>Tier:</strong> ${safeTier}</li>
          <li><strong>User Email:</strong> ${safeUserEmail}</li>
        </ul>
        <p><strong>Description:</strong> ${safeDescription}</p>
        <p>Please review the submission in the admin panel.</p>
      `,
    });

    console.log("Emails sent successfully:", { userEmailResponse, adminEmailResponse });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-afd-notification function:", error);
    return new Response(
      JSON.stringify({ error: "An error occurred while sending notification" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
