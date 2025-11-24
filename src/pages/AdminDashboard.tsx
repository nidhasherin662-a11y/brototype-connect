import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import ComplaintCard from "@/components/ComplaintCard";
import ComplaintDetailDialog from "@/components/ComplaintDetailDialog";
import { LogOut, Search, BarChart3, Upload } from "lucide-react";
import { User } from "@supabase/supabase-js";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [complaints, setComplaints] = useState<any[]>([]);
  const [filteredComplaints, setFilteredComplaints] = useState<any[]>([]);
  const [students, setStudents] = useState<Map<string, string>>(new Map());
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null);

  useEffect(() => {
    checkAuth();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!session) {
          navigate("/admin-auth");
        } else {
          setUser(session.user);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (user) {
      checkAdminRole();
      fetchComplaints();
      fetchStudents();
      subscribeToComplaints();
    }
  }, [user]);

  useEffect(() => {
    filterComplaints();
  }, [complaints, searchQuery, statusFilter]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/admin-auth");
    } else {
      setUser(session.user);
    }
  };

  const checkAdminRole = async () => {
    if (!user) return;

    const { data } = await supabase
      .from("admin_roles")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!data) {
      toast.error("Access denied");
      await supabase.auth.signOut();
      navigate("/admin-auth");
    }
  };

  const fetchStudents = async () => {
    const { data } = await supabase.from("profiles").select("id, name");
    if (data) {
      const studentMap = new Map(data.map(s => [s.id, s.name]));
      setStudents(studentMap);
    }
  };

  const fetchComplaints = async () => {
    try {
      const { data, error } = await supabase
        .from("complaints")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setComplaints(data || []);
    } catch (error: any) {
      toast.error("Failed to load complaints");
    } finally {
      setLoading(false);
    }
  };

  const subscribeToComplaints = () => {
    const channel = supabase
      .channel("admin-complaints-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "complaints",
        },
        () => {
          fetchComplaints();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const filterComplaints = () => {
    let filtered = [...complaints];

    if (searchQuery) {
      filtered = filtered.filter(
        (c) =>
          c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((c) => c.status === statusFilter);
    }

    setFilteredComplaints(filtered);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-admin">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/")}>
              ← Home
            </Button>
            <h1 className="text-2xl font-bold text-admin-accent">Admin Dashboard</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/bulk-import")}>
              <Upload className="w-4 h-4 mr-2" />
              Bulk Import
            </Button>
            <Button variant="outline" onClick={() => navigate("/analytics")}>
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Quick Actions */}
        <div className="mb-6 flex flex-wrap gap-3">
          <Button 
            onClick={() => navigate("/bulk-import")}
            className="bg-admin-accent hover:bg-admin-hover"
          >
            <Upload className="w-4 h-4 mr-2" />
            Bulk Import
          </Button>
          <Button 
            onClick={() => navigate("/analytics")}
            variant="outline"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            View Analytics
          </Button>
          <Button 
            variant="outline"
            onClick={() => {
              const csvData = filteredComplaints.map(c => ({
                id: c.id,
                title: c.title,
                status: c.status,
                student: students.get(c.student_id) || 'Unknown',
                created: new Date(c.created_at).toLocaleDateString()
              }));
              const csv = [
                Object.keys(csvData[0]).join(','),
                ...csvData.map(row => Object.values(row).join(','))
              ].join('\n');
              const blob = new Blob([csv], { type: 'text/csv' });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'complaints-report.csv';
              a.click();
              toast.success("Report exported successfully!");
            }}
          >
            Export Report
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="p-6 bg-white rounded-lg shadow-soft">
            <p className="text-sm text-muted-foreground">Total Complaints</p>
            <p className="text-3xl font-bold text-foreground">{complaints.length}</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-soft">
            <p className="text-sm text-muted-foreground">Pending</p>
            <p className="text-3xl font-bold text-status-pending">
              {complaints.filter((c) => c.status === "Pending").length}
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-soft">
            <p className="text-sm text-muted-foreground">Resolved</p>
            <p className="text-3xl font-bold text-status-resolved">
              {complaints.filter((c) => c.status === "Resolved").length}
            </p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search complaints..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Complaints List */}
        <div>
          <h2 className="text-2xl font-bold mb-4">All Complaints</h2>
          {filteredComplaints.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No complaints found</p>
          ) : (
            <div className="grid gap-4">
              {filteredComplaints.map((complaint) => (
                <ComplaintCard
                  key={complaint.id}
                  complaint={complaint}
                  onClick={() => setSelectedComplaint(complaint)}
                  showStudentInfo
                  studentName={students.get(complaint.student_id) || "Unknown"}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedComplaint && (
        <ComplaintDetailDialog
          complaint={selectedComplaint}
          onClose={() => {
            setSelectedComplaint(null);
            fetchComplaints();
          }}
          isAdmin={true}
          studentName={students.get(selectedComplaint.student_id)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;