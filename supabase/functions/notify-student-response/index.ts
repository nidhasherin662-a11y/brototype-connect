import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { Resend } from "npm:resend@4.0.0";

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
      from: "Brototype Complaints <onboarding@resend.dev>",
      to: [profile.email],
      subject: `New Response to Your Complaint: ${title}`,
      html: `
        <h2>New Response to Your Complaint</h2>
        <p>Hi ${profile.name},</p>
        <p>You have received a new response to your complaint:</p>
        <p><strong>Complaint:</strong> ${title}</p>
        <p><strong>Response:</strong> ${message}</p>
        <br>
        <p>Please log in to the student portal to view the full conversation and respond if needed.</p>
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
