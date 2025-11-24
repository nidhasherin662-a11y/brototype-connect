import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotifyAdminRequest {
  complaintId: string;
  studentName: string;
  title: string;
  description: string;
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { complaintId, studentName, title, description }: NotifyAdminRequest = await req.json();
    
    console.log("Sending admin notification for complaint:", complaintId);

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get all admin emails
    const { data: adminRoles } = await supabase
      .from("admin_roles")
      .select("user_id");

    if (!adminRoles || adminRoles.length === 0) {
      console.log("No admins found");
      return new Response(JSON.stringify({ success: true, message: "No admins to notify" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get admin profiles
    const { data: profiles } = await supabase
      .from("profiles")
      .select("email")
      .in("id", adminRoles.map(r => r.user_id));

    if (!profiles || profiles.length === 0) {
      console.log("No admin profiles found");
      return new Response(JSON.stringify({ success: true, message: "No admin emails found" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const adminEmails = profiles.map(p => p.email);
    console.log("Sending to admins:", adminEmails);

    // Send email to all admins
    const emailResponse = await resend.emails.send({
      from: "StudentVoice Support <onboarding@resend.dev>",
      to: adminEmails,
      subject: `📋 New Student Concern Received: ${title}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Student Concern</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f7fa;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f7fa; padding: 40px 0;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
                  <!-- Header with gradient -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                      <div style="background-color: rgba(255, 255, 255, 0.95); width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);">
                        <span style="font-size: 48px; color: #667eea;">🎓</span>
                      </div>
                      <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600; letter-spacing: 0.5px;">StudentVoice</h1>
                      <p style="color: rgba(255, 255, 255, 0.9); margin: 8px 0 0; font-size: 14px; font-weight: 300;">Empowering Your Campus Experience</p>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px 30px;">
                      <div style="background: linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%); padding: 16px; border-radius: 8px; margin-bottom: 30px; text-align: center;">
                        <h2 style="color: #2d3436; margin: 0; font-size: 20px; font-weight: 600;">📋 New Student Concern Submitted</h2>
                      </div>
                      
                      <p style="color: #2d3436; font-size: 16px; line-height: 1.6; margin: 0 0 24px;">
                        Hello Admin Team,<br><br>
                        A student has submitted a new concern that requires your attention and support.
                      </p>
                      
                      <!-- Info Cards -->
                      <div style="background-color: #f8f9fa; border-left: 4px solid #667eea; padding: 20px; margin-bottom: 16px; border-radius: 6px;">
                        <p style="margin: 0 0 8px; color: #6c757d; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Student Name</p>
                        <p style="margin: 0; color: #2d3436; font-size: 16px; font-weight: 500;">${studentName}</p>
                      </div>
                      
                      <div style="background-color: #f8f9fa; border-left: 4px solid #764ba2; padding: 20px; margin-bottom: 16px; border-radius: 6px;">
                        <p style="margin: 0 0 8px; color: #6c757d; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Concern Title</p>
                        <p style="margin: 0; color: #2d3436; font-size: 16px; font-weight: 500;">${title}</p>
                      </div>
                      
                      <div style="background-color: #f8f9fa; border-left: 4px solid #00b894; padding: 20px; margin-bottom: 24px; border-radius: 6px;">
                        <p style="margin: 0 0 8px; color: #6c757d; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Description</p>
                        <p style="margin: 0; color: #2d3436; font-size: 14px; line-height: 1.6;">${description}</p>
                      </div>
                      
                      <div style="background-color: #e8eaf6; padding: 16px; border-radius: 6px; margin-bottom: 30px;">
                        <p style="margin: 0; color: #5f6368; font-size: 12px;">
                          <strong>Concern ID:</strong> <code style="background-color: #ffffff; padding: 4px 8px; border-radius: 4px; font-family: monospace;">${complaintId}</code>
                        </p>
                      </div>
                      
                      <div style="text-align: center; margin: 30px 0;">
                        <p style="color: #667eea; font-size: 16px; font-weight: 600; margin: 0 0 20px;">Your prompt response helps create a better campus environment</p>
                        <a href="https://your-app-url.com/admin" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);">
                          Review Concern →
                        </a>
                      </div>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
                      <p style="margin: 0 0 12px; color: #667eea; font-size: 18px; font-weight: 600;">💪 Together, We Make a Difference</p>
                      <p style="margin: 0 0 20px; color: #6c757d; font-size: 14px; line-height: 1.6;">
                        Every concern addressed is a step towards a more supportive and empowering campus community.
                      </p>
                      <p style="margin: 0; color: #adb5bd; font-size: 12px;">
                        © 2024 StudentVoice Platform | Building Better Campus Communities
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailResponse }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error in notify-admin-new-complaint:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
