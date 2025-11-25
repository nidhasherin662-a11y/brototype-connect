import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Users, Target, Heart, Shield } from "lucide-react";
import Footer from "@/components/Footer";

const AboutUs = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <Button variant="ghost" onClick={() => navigate("/")} className="mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-student-accent bg-clip-text text-transparent">
            About StudentVoice
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Empowering students to share their concerns and create positive change in their campus community.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Card className="p-8 shadow-elevated hover:shadow-lifted transition-shadow">
            <Target className="w-12 h-12 text-primary mb-4" />
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed">
              StudentVoice exists to bridge the gap between students and administration. We provide a
              safe, transparent platform where every student's concern is heard, tracked, and
              addressed with care and urgency.
            </p>
          </Card>

          <Card className="p-8 shadow-elevated hover:shadow-lifted transition-shadow">
            <Heart className="w-12 h-12 text-student-accent mb-4" />
            <h2 className="text-2xl font-bold mb-4">Our Values</h2>
            <p className="text-muted-foreground leading-relaxed">
              We believe in transparency, empathy, and action. Every complaint is treated with respect,
              every voice matters, and every resolution is pursued with dedication. Your well-being is
              our priority.
            </p>
          </Card>

          <Card className="p-8 shadow-elevated hover:shadow-lifted transition-shadow">
            <Users className="w-12 h-12 text-admin-accent mb-4" />
            <h2 className="text-2xl font-bold mb-4">Who We Are</h2>
            <p className="text-muted-foreground leading-relaxed">
              We're a dedicated team of administrators, counselors, and student advocates committed to
              making campus life better. Our diverse team brings together experience in student affairs,
              technology, and community building.
            </p>
          </Card>

          <Card className="p-8 shadow-elevated hover:shadow-lifted transition-shadow">
            <Shield className="w-12 h-12 text-complaint-accent mb-4" />
            <h2 className="text-2xl font-bold mb-4">Your Privacy</h2>
            <p className="text-muted-foreground leading-relaxed">
              Your privacy and security are paramount. All complaints are handled confidentially, and
              your data is protected with industry-standard security measures. You control what you
              share and who sees it.
            </p>
          </Card>
        </div>

        <Card className="p-12 text-center bg-gradient-to-r from-primary/10 to-student-accent/10">
          <h2 className="text-3xl font-bold mb-6">Making a Difference Together</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-3xl mx-auto">
            Since our launch, StudentVoice has helped resolve thousands of student concerns, from
            infrastructure improvements to policy changes. Every voice contributes to a better campus
            for everyone.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div>
              <p className="text-4xl font-bold text-primary mb-2">98%</p>
              <p className="text-sm text-muted-foreground">Student Satisfaction</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-student-accent mb-2">2.5 Days</p>
              <p className="text-sm text-muted-foreground">Avg. Response Time</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-admin-accent mb-2">5000+</p>
              <p className="text-sm text-muted-foreground">Concerns Resolved</p>
            </div>
          </div>
        </Card>

        <div className="mt-12 text-center">
          <Button
            size="lg"
            onClick={() => navigate("/auth")}
            className="bg-primary hover:bg-primary/90"
          >
            Join StudentVoice Today
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AboutUs;
