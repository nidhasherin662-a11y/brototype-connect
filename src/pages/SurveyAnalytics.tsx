import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, TrendingUp, Users, Star, ThumbsUp } from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const SurveyAnalytics = () => {
  const navigate = useNavigate();
  const [surveys, setSurveys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdmin();
    fetchSurveys();
  }, []);

  const checkAdmin = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/admin-auth");
      return;
    }

    const { data } = await supabase.rpc("is_admin", { _user_id: session.user.id });
    if (!data) {
      toast.error("Access denied");
      navigate("/admin-auth");
    }
  };

  const fetchSurveys = async () => {
    try {
      const { data, error } = await supabase
        .from("satisfaction_surveys")
        .select("*")
        .not("submitted_at", "is", null)
        .order("submitted_at", { ascending: true });

      if (error) throw error;
      setSurveys(data || []);
    } catch (error: any) {
      toast.error("Failed to load survey data");
    } finally {
      setLoading(false);
    }
  };

  // Calculate metrics
  const totalSurveys = surveys.length;
  const avgRating = surveys.length > 0
    ? (surveys.reduce((sum, s) => sum + (s.rating || 0), 0) / surveys.length).toFixed(1)
    : "0";
  const avgResponseTime = surveys.length > 0
    ? (surveys.reduce((sum, s) => sum + (s.response_time_rating || 0), 0) / surveys.length).toFixed(1)
    : "0";
  const avgSupportQuality = surveys.length > 0
    ? (surveys.reduce((sum, s) => sum + (s.support_quality_rating || 0), 0) / surveys.length).toFixed(1)
    : "0";
  const recommendRate = surveys.length > 0
    ? ((surveys.filter(s => s.would_recommend).length / surveys.length) * 100).toFixed(1)
    : "0";

  // Trends over time (group by month)
  const trendData = surveys.reduce((acc: any[], survey) => {
    if (!survey.submitted_at) return acc;
    const date = new Date(survey.submitted_at);
    const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
    
    const existing = acc.find(item => item.month === monthYear);
    if (existing) {
      existing.ratings.push(survey.rating || 0);
      existing.avgRating = existing.ratings.reduce((sum: number, r: number) => sum + r, 0) / existing.ratings.length;
    } else {
      acc.push({
        month: monthYear,
        ratings: [survey.rating || 0],
        avgRating: survey.rating || 0
      });
    }
    return acc;
  }, []);

  // Rating distribution
  const ratingDistribution = [1, 2, 3, 4, 5].map(rating => ({
    rating: `${rating} Star${rating > 1 ? 's' : ''}`,
    count: surveys.filter(s => s.rating === rating).length
  }));

  // Would recommend pie chart
  const recommendData = [
    { name: "Would Recommend", value: surveys.filter(s => s.would_recommend).length },
    { name: "Would Not Recommend", value: surveys.filter(s => !s.would_recommend).length }
  ];

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--destructive))'];

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-admin">
      <div className="bg-background shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/admin-dashboard")} size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-2xl font-bold text-foreground">Survey Analytics</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Responses</p>
                <p className="text-3xl font-bold text-foreground">{totalSurveys}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Star className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Rating</p>
                <p className="text-3xl font-bold text-foreground">{avgRating}/5</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Response Time</p>
                <p className="text-3xl font-bold text-foreground">{avgResponseTime}/5</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <ThumbsUp className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Would Recommend</p>
                <p className="text-3xl font-bold text-foreground">{recommendRate}%</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Satisfaction Trends */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-foreground">Satisfaction Trends</h3>
            {trendData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis domain={[0, 5]} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--background))", 
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px"
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="avgRating" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    name="Average Rating"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-muted-foreground py-8">No trend data available</p>
            )}
          </Card>

          {/* Rating Distribution */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-foreground">Rating Distribution</h3>
            {ratingDistribution.some(r => r.count > 0) ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={ratingDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="rating" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--background))", 
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px"
                    }}
                  />
                  <Bar dataKey="count" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-muted-foreground py-8">No rating data available</p>
            )}
          </Card>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Support Quality Metrics */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-foreground">Quality Metrics</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Response Time Rating</span>
                <span className="text-2xl font-bold text-foreground">{avgResponseTime}/5</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Support Quality Rating</span>
                <span className="text-2xl font-bold text-foreground">{avgSupportQuality}/5</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Overall Satisfaction</span>
                <span className="text-2xl font-bold text-foreground">{avgRating}/5</span>
              </div>
            </div>
          </Card>

          {/* Would Recommend Breakdown */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-foreground">Recommendation Rate</h3>
            {recommendData[0].value > 0 || recommendData[1].value > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={recommendData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {recommendData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--background))", 
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px"
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-muted-foreground py-8">No recommendation data available</p>
            )}
          </Card>
        </div>

        {/* Recent Feedback */}
        <Card className="p-6 mt-6">
          <h3 className="text-lg font-semibold mb-4 text-foreground">Recent Feedback</h3>
          <div className="space-y-4">
            {surveys
              .filter(s => s.feedback)
              .slice(-5)
              .reverse()
              .map((survey, idx) => (
                <div key={idx} className="p-4 bg-muted/50 rounded-lg border border-border">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-primary fill-primary" />
                      <span className="font-semibold text-foreground">{survey.rating}/5</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(survey.submitted_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-foreground">{survey.feedback}</p>
                </div>
              ))}
            {surveys.filter(s => s.feedback).length === 0 && (
              <p className="text-center text-muted-foreground py-4">No feedback available</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SurveyAnalytics;
