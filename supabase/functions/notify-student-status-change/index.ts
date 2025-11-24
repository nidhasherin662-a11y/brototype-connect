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
      from: "Brototype Complaints <onboarding@resend.dev>",
      to: [profile.email],
      subject: `Complaint Status Updated: ${title}`,
      html: `
        <h2>Complaint Status Update</h2>
        <p>Hi ${profile.name},</p>
        <p>Your complaint has been updated:</p>
        <p><strong>Title:</strong> ${title}</p>
        <p><strong>New Status:</strong> ${newStatus}</p>
        <br>
        <p>Please log in to the student portal to view more details.</p>
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
