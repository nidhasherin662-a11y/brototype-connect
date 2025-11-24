import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, Upload, Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const BulkImport = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [sampleData, setSampleData] = useState(`[
  {
    "title": "Broken AC in Classroom 101",
    "description": "The air conditioning unit in classroom 101 has not been working for the past week. It's very hot and uncomfortable during afternoon classes.",
    "status": "Pending"
  },
  {
    "title": "WiFi Connection Issues in Library",
    "description": "The WiFi signal in the library is very weak. Unable to access online resources for assignments. Please fix urgently.",
    "status": "Pending"
  },
  {
    "title": "Broken Chair in Lab 3",
    "description": "One of the chairs in computer lab 3 is broken. The back support is completely detached making it unsafe to sit.",
    "status": "In Progress"
  },
  {
    "title": "Projector Not Working in Hall A",
    "description": "The projector in main hall A is not turning on. Tried multiple times but no display. This is affecting our presentations.",
    "status": "Pending"
  },
  {
    "title": "Washroom Maintenance Required",
    "description": "The washroom on 2nd floor needs urgent maintenance. Multiple toilets are clogged and sinks are leaking.",
    "status": "Pending"
  }
]`);

  const handleBulkImport = async () => {
    setLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Check if user is admin
      const { data: adminCheck } = await supabase
        .from("admin_roles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!adminCheck) {
        toast.error("Only admins can import bulk complaints");
        return;
      }

      // Parse JSON data
      const complaints = JSON.parse(sampleData);
      
      if (!Array.isArray(complaints)) {
        throw new Error("Data must be an array of complaints");
      }

      // Get all student profiles to assign complaints
      const { data: students } = await supabase
        .from("profiles")
        .select("id")
        .limit(10);

      if (!students || students.length === 0) {
        toast.error("No student accounts found. Create some student accounts first.");
        return;
      }

      // Prepare complaints with random student assignments
      const complaintsToInsert = complaints.map((complaint: any) => {
        const randomStudent = students[Math.floor(Math.random() * students.length)];
        return {
          student_id: randomStudent.id,
          title: complaint.title,
          description: complaint.description,
          status: complaint.status || "Pending",
          image_url: complaint.image_url || null,
        };
      });

      // Insert all complaints
      const { error } = await supabase
        .from("complaints")
        .insert(complaintsToInsert);

      if (error) throw error;

      toast.success(`Successfully imported ${complaintsToInsert.length} complaints!`);
      navigate("/admin");
    } catch (error: any) {
      console.error("Bulk import error:", error);
      toast.error(error.message || "Failed to import complaints. Check JSON format.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-admin">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6 flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate("/admin")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Admin
          </Button>
          <h1 className="text-3xl font-bold text-admin-accent">Bulk Import Complaints</h1>
        </div>

        <Card className="p-8 shadow-elevated">
          <div className="space-y-6">
            <div>
              <Label htmlFor="json-data">Complaints JSON Data</Label>
              <p className="text-sm text-muted-foreground mb-2">
                Edit the JSON below or paste your own data. Each complaint will be randomly assigned to existing students.
              </p>
              <Textarea
                id="json-data"
                value={sampleData}
                onChange={(e) => setSampleData(e.target.value)}
                rows={20}
                className="font-mono text-sm"
              />
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-semibold mb-2">JSON Format:</h3>
              <pre className="text-xs text-muted-foreground">
{`[
  {
    "title": "Issue Title",
    "description": "Detailed description",
    "status": "Pending" // Optional: Pending, In Progress, Resolved
  }
]`}
              </pre>
            </div>

            <Button
              onClick={handleBulkImport}
              disabled={loading}
              className="w-full bg-admin-accent hover:bg-admin-hover"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Import Complaints
                </>
              )}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default BulkImport;