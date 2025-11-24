import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, TrendingUp, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const AnalyticsDashboard = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdmin();
    fetchComplaints();
    subscribeToComplaints();
  }, []);

  const checkAdmin = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/admin-auth");
      return;
    }

    const { data } = await supabase
      .from("admin_roles")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!data) {
      toast.error("Access denied");
      navigate("/admin-auth");
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
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const subscribeToComplaints = () => {
    const channel = supabase
      .channel("analytics-complaints")
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

  // Calculate metrics
  const totalComplaints = complaints.length;
  const pendingCount = complaints.filter((c) => c.status === "Pending").length;
  const inProgressCount = complaints.filter((c) => c.status === "In Progress").length;
  const resolvedCount = complaints.filter((c) => c.status === "Resolved").length;

  // Status distribution for pie chart
  const statusData = [
    { name: "Pending", value: pendingCount, color: "hsl(var(--status-pending))" },
    { name: "In Progress", value: inProgressCount, color: "hsl(var(--status-progress))" },
    { name: "Resolved", value: resolvedCount, color: "hsl(var(--status-resolved))" },
  ];

  // Calculate resolution times
  const resolvedComplaints = complaints.filter((c) => c.status === "Resolved");
  const avgResolutionTime =
    resolvedComplaints.length > 0
      ? resolvedComplaints.reduce((sum, c) => {
          const created = new Date(c.created_at).getTime();
          const updated = new Date(c.updated_at).getTime();
          return sum + (updated - created) / (1000 * 60 * 60 * 24); // days
        }, 0) / resolvedComplaints.length
      : 0;

  // Complaints over time (last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split("T")[0];
  });

  const complaintsOverTime = last7Days.map((date) => {
    const count = complaints.filter((c) => c.created_at.split("T")[0] === date).length;
    return { date: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }), count };
  });

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-admin">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate("/admin")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold text-admin-accent">Analytics Dashboard</h1>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6 admin-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Complaints</p>
                <p className="text-3xl font-bold">{totalComplaints}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-admin-accent" />
            </div>
          </Card>
          <Card className="p-6 bg-yellow-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-3xl font-bold text-status-pending">{pendingCount}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-status-pending" />
            </div>
          </Card>
          <Card className="p-6 bg-orange-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-3xl font-bold text-status-progress">{inProgressCount}</p>
              </div>
              <Clock className="w-8 h-8 text-status-progress" />
            </div>
          </Card>
          <Card className="p-6 bg-green-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Resolved</p>
                <p className="text-3xl font-bold text-status-resolved">{resolvedCount}</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-status-resolved" />
            </div>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Status Distribution */}
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4">Status Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          {/* Complaints Trend */}
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4">Complaints Trend (Last 7 Days)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={complaintsOverTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="hsl(var(--admin-accent))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Performance Metrics */}
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4">Performance Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Average Resolution Time</p>
              <p className="text-2xl font-bold">{avgResolutionTime.toFixed(1)} days</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Resolution Rate</p>
              <p className="text-2xl font-bold">
                {totalComplaints > 0 ? ((resolvedCount / totalComplaints) * 100).toFixed(1) : 0}%
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Active Cases</p>
              <p className="text-2xl font-bold">{pendingCount + inProgressCount}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;