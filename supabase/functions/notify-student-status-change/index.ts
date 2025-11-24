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

interface NotifyStudentRequest {
  complaintId: string;
  studentId: string;
  title: string;
  newStatus: string;
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { complaintId, studentId, title, newStatus }: NotifyStudentRequest = await req.json();
    
    console.log("Sending status change notification to student:", studentId);

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
      subject: `✨ Update on Your Concern: ${title}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Concern Status Update</title>
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
                      <div style="background: linear-gradient(135deg, #a29bfe 0%, #6c5ce7 100%); padding: 16px; border-radius: 8px; margin-bottom: 30px; text-align: center;">
                        <h2 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 600;">✨ Your Concern Has Been Updated</h2>
                      </div>
                      
                      <p style="color: #2d3436; font-size: 16px; line-height: 1.6; margin: 0 0 24px;">
                        Hi <strong>${profile.name}</strong>,<br><br>
                        Great news! We've made progress on your concern. Your voice is making a difference! 🌟
                      </p>
                      
                      <!-- Status Card -->
                      <div style="background-color: #f8f9fa; border-left: 4px solid #667eea; padding: 20px; margin-bottom: 16px; border-radius: 6px;">
                        <p style="margin: 0 0 8px; color: #6c757d; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Concern Title</p>
                        <p style="margin: 0; color: #2d3436; font-size: 16px; font-weight: 500;">${title}</p>
                      </div>
                      
                      <div style="background: linear-gradient(135deg, #00b894 0%, #00cec9 100%); padding: 24px; border-radius: 8px; margin-bottom: 30px; text-align: center;">
                        <p style="margin: 0 0 8px; color: rgba(255, 255, 255, 0.9); font-size: 14px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">New Status</p>
                        <p style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700;">${newStatus}</p>
                      </div>
                      
                      <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 20px; margin-bottom: 30px; border-radius: 6px;">
                        <p style="margin: 0; color: #856404; font-size: 14px; line-height: 1.6;">
                          💡 <strong>What's Next?</strong><br>
                          Log in to the student portal to view complete details, track progress, and communicate with our support team.
                        </p>
                      </div>
                      
                      <div style="text-align: center; margin: 30px 0;">
                        <a href="https://your-app-url.com" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);">
                          View Details →
                        </a>
                      </div>
                    </td>
                  </tr>
                  
                  <!-- Motivational Footer -->
                  <tr>
                    <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
                      <p style="margin: 0 0 12px; color: #667eea; font-size: 18px; font-weight: 600;">🌈 Your Voice Matters</p>
                      <p style="margin: 0 0 20px; color: #6c757d; font-size: 14px; line-height: 1.6;">
                        Thank you for speaking up and helping us build a better campus community. Together, we're creating positive change!
                      </p>
                      <p style="margin: 0; color: #adb5bd; font-size: 12px;">
                        © 2024 StudentVoice Platform | Your Partner in Campus Excellence
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
    console.error("Error in notify-student-status-change:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
