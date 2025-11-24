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
      from: "Brototype Complaints <onboarding@resend.dev>",
      to: adminEmails,
      subject: `New Complaint: ${title}`,
      html: `
        <h2>New Complaint Submitted</h2>
        <p><strong>Student:</strong> ${studentName}</p>
        <p><strong>Title:</strong> ${title}</p>
        <p><strong>Description:</strong> ${description}</p>
        <p><strong>Complaint ID:</strong> ${complaintId}</p>
        <br>
        <p>Please log in to the admin portal to review and respond to this complaint.</p>
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
