import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SurveyRequest {
  complaintId: string;
  studentId: string;
  complaintTitle: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { complaintId, studentId, complaintTitle }: SurveyRequest = await req.json();
    
    console.log("Sending satisfaction survey for complaint:", complaintId);

    // Fetch student details
    const { data: student, error: studentError } = await supabase
      .from("profiles")
      .select("email, name")
      .eq("id", studentId)
      .single();

    if (studentError || !student) {
      console.error("Student not found:", studentError);
      return new Response(
        JSON.stringify({ error: "Student not found" }),
        { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Create survey record
    const { data: survey, error: surveyError } = await supabase
      .from("satisfaction_surveys")
      .insert({
        complaint_id: complaintId,
        student_id: studentId,
      })
      .select()
      .single();

    if (surveyError) {
      console.error("Error creating survey:", surveyError);
      return new Response(
        JSON.stringify({ error: "Failed to create survey" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Generate survey link with token
    const surveyUrl = `${Deno.env.get("VITE_SUPABASE_URL")?.replace('supabase.co', 'lovable.app') || 'https://studentvoice.lovable.app'}/survey?token=${survey.survey_token}`;

    // Send email
    const emailResponse = await resend.emails.send({
      from: "StudentVoice <onboarding@resend.dev>",
      to: [student.email],
      subject: "We'd Love Your Feedback - StudentVoice",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; }
              .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: 600; }
              .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
              .stars { font-size: 24px; margin: 10px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0;">Thank You for Using StudentVoice!</h1>
              </div>
              <div class="content">
                <p>Hello ${student.name},</p>
                
                <p>Great news! Your concern "<strong>${complaintTitle}</strong>" has been resolved.</p>
                
                <p>We'd love to hear about your experience. Your feedback helps us improve our support and serve you better.</p>
                
                <div style="text-align: center; margin: 30px 0;">
                  <div class="stars">⭐ ⭐ ⭐ ⭐ ⭐</div>
                  <a href="${surveyUrl}" class="button">Share Your Feedback</a>
                </div>
                
                <p style="font-size: 14px; color: #666;">The survey takes less than 2 minutes to complete and your responses are completely confidential.</p>
              </div>
              <div class="footer">
                <p>StudentVoice - Empowering Your Campus Experience</p>
                <p>&copy; 2025 StudentVoice. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    console.log("Survey email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ success: true, surveyId: survey.id }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-satisfaction-survey function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
