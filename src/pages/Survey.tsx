import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Star, CheckCircle2 } from "lucide-react";
import Footer from "@/components/Footer";

const Survey = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [surveyData, setSurveyData] = useState<any>(null);
  const [complaint, setComplaint] = useState<any>(null);
  
  const [rating, setRating] = useState(0);
  const [responseTimeRating, setResponseTimeRating] = useState(0);
  const [supportQualityRating, setSupportQualityRating] = useState(0);
  const [wouldRecommend, setWouldRecommend] = useState<boolean | null>(null);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    if (!token) {
      toast({
        title: "Invalid Survey Link",
        description: "Please use the link from your email.",
        variant: "destructive",
      });
      navigate("/");
      return;
    }
    fetchSurvey();
  }, [token]);

  const fetchSurvey = async () => {
    try {
      const { data: survey, error } = await supabase
        .from("satisfaction_surveys")
        .select("*, complaints(*)")
        .eq("survey_token", token)
        .single();

      if (error || !survey) {
        toast({
          title: "Survey Not Found",
          description: "This survey link is invalid or has expired.",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      if (survey.submitted_at) {
        setSubmitted(true);
      }

      setSurveyData(survey);
      setComplaint(survey.complaints);
    } catch (error) {
      console.error("Error fetching survey:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!rating || !responseTimeRating || !supportQualityRating || wouldRecommend === null) {
      toast({
        title: "Incomplete Survey",
        description: "Please answer all questions before submitting.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    try {
      const { error } = await supabase
        .from("satisfaction_surveys")
        .update({
          rating,
          response_time_rating: responseTimeRating,
          support_quality_rating: supportQualityRating,
          would_recommend: wouldRecommend,
          feedback,
          submitted_at: new Date().toISOString(),
        })
        .eq("survey_token", token);

      if (error) throw error;

      setSubmitted(true);
      toast({
        title: "Thank You!",
        description: "Your feedback has been submitted successfully.",
      });
    } catch (error) {
      console.error("Error submitting survey:", error);
      toast({
        title: "Submission Failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const StarRating = ({ value, onChange, label }: { value: number; onChange: (val: number) => void; label: string }) => (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="transition-transform hover:scale-110"
          >
            <Star
              className={`w-8 h-8 ${
                star <= value ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading survey...</p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-lg w-full text-center">
            <CardHeader>
              <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <CardTitle>Thank You!</CardTitle>
              <CardDescription>
                Your feedback has been submitted successfully and helps us improve our service.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate("/")} className="mt-4">
                Return to Home
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Student Satisfaction Survey</CardTitle>
            <CardDescription>
              Help us improve by sharing your experience with concern: <strong>{complaint?.title}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <StarRating
                value={rating}
                onChange={setRating}
                label="Overall, how satisfied are you with how your concern was handled?"
              />

              <StarRating
                value={responseTimeRating}
                onChange={setResponseTimeRating}
                label="How would you rate our response time?"
              />

              <StarRating
                value={supportQualityRating}
                onChange={setSupportQualityRating}
                label="How would you rate the quality of support you received?"
              />

              <div className="space-y-2">
                <label className="text-sm font-medium">Would you recommend StudentVoice to other students?</label>
                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant={wouldRecommend === true ? "default" : "outline"}
                    onClick={() => setWouldRecommend(true)}
                  >
                    Yes
                  </Button>
                  <Button
                    type="button"
                    variant={wouldRecommend === false ? "default" : "outline"}
                    onClick={() => setWouldRecommend(false)}
                  >
                    No
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="feedback" className="text-sm font-medium">
                  Additional feedback (optional)
                </label>
                <Textarea
                  id="feedback"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Tell us more about your experience..."
                  rows={4}
                />
              </div>

              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? "Submitting..." : "Submit Survey"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default Survey;
