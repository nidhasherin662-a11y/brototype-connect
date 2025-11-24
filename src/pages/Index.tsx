import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { MessageSquare, Shield, TrendingUp } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-hero text-white py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
            Brototype Complaint Portal
          </h1>
          <p className="text-xl md:text-2xl mb-4 opacity-90">
            Connecting Voices. Building Solutions.
          </p>
          <p className="text-lg md:text-xl italic opacity-80 mb-8">
            "Every voice matters — when you speak, we listen."
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate("/auth")}
              className="bg-white text-primary hover:bg-gray-100 text-lg px-8 py-6"
            >
              Student Login
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/admin-auth")}
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary text-lg px-8 py-6"
            >
              Admin Login
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg student-card shadow-soft hover:shadow-elevated transition-shadow">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 text-student-accent" />
              <h3 className="text-2xl font-bold mb-3">Raise Complaints</h3>
              <p className="text-muted-foreground">
                Students can submit complaints with details and upload images as proof
              </p>
            </div>
            <div className="text-center p-6 rounded-lg admin-card shadow-soft hover:shadow-elevated transition-shadow">
              <Shield className="w-16 h-16 mx-auto mb-4 text-admin-accent" />
              <h3 className="text-2xl font-bold mb-3">Admin Review</h3>
              <p className="text-muted-foreground">
                Staff can view, track, and respond to complaints efficiently
              </p>
            </div>
            <div className="text-center p-6 rounded-lg complaint-card shadow-soft hover:shadow-elevated transition-shadow">
              <TrendingUp className="w-16 h-16 mx-auto mb-4 text-complaint-accent" />
              <h3 className="text-2xl font-bold mb-3">Track Progress</h3>
              <p className="text-muted-foreground">
                Real-time status updates: Pending, In Progress, Resolved
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 px-4 bg-gradient-student">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Make Your Voice Heard?</h2>
          <p className="text-xl mb-8 text-muted-foreground">
            Join Brototype's transparent complaint management system today
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/auth")}
            className="bg-primary hover:bg-primary/90 text-lg px-8 py-6"
          >
            Get Started
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-foreground text-background py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm opacity-80">
            © 2024 Brototype. Built with transparency and care.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;