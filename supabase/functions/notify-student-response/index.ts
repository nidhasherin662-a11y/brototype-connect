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

interface NotifyStudentResponseRequest {
  complaintId: string;
  studentId: string;
  title: string;
  message: string;
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { complaintId, studentId, title, message }: NotifyStudentResponseRequest = await req.json();
    
    console.log("Sending response notification to student:", studentId);

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get student email
    const { data: profile } = await supabase
      .from("profiles")
      .select("email, name")
      .eq("id", studentId)
      .single();

    if (!profile) {
      console.error("Student profile not found");
      return new Response(JSON.stringify({ error: "Student not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Sending to student:", profile.email);

    // Send email to student
    const emailResponse = await resend.emails.send({
      from: "StudentVoice Support <onboarding@resend.dev>",
      to: [profile.email],
      subject: `💬 New Message About Your Concern: ${title}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Response Received</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f7fa;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f7fa; padding: 40px 0;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
                  <!-- Header -->
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
                      <div style="background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%); padding: 16px; border-radius: 8px; margin-bottom: 30px; text-align: center;">
                        <h2 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 600;">💬 You Have a New Message!</h2>
                      </div>
                      
                      <p style="color: #2d3436; font-size: 16px; line-height: 1.6; margin: 0 0 24px;">
                        Hi <strong>${profile.name}</strong>,<br><br>
                        Our support team has responded to your concern. We're here to help! 🤝
                      </p>
                      
                      <!-- Concern Info -->
                      <div style="background-color: #f8f9fa; border-left: 4px solid #667eea; padding: 20px; margin-bottom: 20px; border-radius: 6px;">
                        <p style="margin: 0 0 8px; color: #6c757d; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Regarding Your Concern</p>
                        <p style="margin: 0; color: #2d3436; font-size: 16px; font-weight: 500;">${title}</p>
                      </div>
                      
                      <!-- Response Message -->
                      <div style="background: linear-gradient(135deg, #dfe6e9 0%, #b2bec3 100%); padding: 24px; border-radius: 8px; margin-bottom: 30px; position: relative;">
                        <div style="position: absolute; top: -10px; left: 30px; background-color: #0984e3; color: #ffffff; padding: 6px 16px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                          Support Team Response
                        </div>
                        <div style="margin-top: 16px; background-color: #ffffff; padding: 20px; border-radius: 6px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                          <p style="margin: 0; color: #2d3436; font-size: 15px; line-height: 1.8;">${message}</p>
                        </div>
                      </div>
                      
                      <div style="background-color: #e8f5e9; border-left: 4px solid #4caf50; padding: 20px; margin-bottom: 30px; border-radius: 6px;">
                        <p style="margin: 0; color: #2e7d32; font-size: 14px; line-height: 1.6;">
                          ✅ <strong>Continue the Conversation</strong><br>
                          You can reply to this message and view the complete conversation thread in your student portal.
                        </p>
                      </div>
                      
                      <div style="text-align: center; margin: 30px 0;">
                        <a href="https://your-app-url.com" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);">
                          View & Reply →
                        </a>
                      </div>
                    </td>
                  </tr>
                  
                  <!-- Motivational Footer -->
                  <tr>
                    <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
                      <p style="margin: 0 0 12px; color: #667eea; font-size: 18px; font-weight: 600;">🚀 We're Here for You</p>
                      <p style="margin: 0 0 20px; color: #6c757d; font-size: 14px; line-height: 1.6;">
                        Your concerns drive positive change on campus. Keep the conversation going, and let's work together towards solutions!
                      </p>
                      <p style="margin: 0; color: #adb5bd; font-size: 12px;">
                        © 2024 StudentVoice Platform | Committed to Your Success
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
    console.error("Error in notify-student-response:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
