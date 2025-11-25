import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { MessageSquare, Shield, TrendingUp, Lock, Zap, Eye, Users } from "lucide-react";
import LiveChat from "@/components/LiveChat";
import Footer from "@/components/Footer";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-hero text-white py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
            StudentVoice 🎓
          </h1>
          <p className="text-xl md:text-2xl mb-4 opacity-90 font-semibold">
            Empowering Your Campus Experience
          </p>
          <p className="text-lg md:text-xl italic opacity-80 mb-8">
            "Your voice creates change. Together, we build a better campus community."
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
          <div className="mt-6 flex gap-4 justify-center">
            <Button
              variant="link"
              onClick={() => navigate("/faq")}
              className="text-white underline text-lg"
            >
              FAQ
            </Button>
            <Button
              variant="link"
              onClick={() => navigate("/about")}
              className="text-white underline text-lg"
            >
              About Us
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">How We Support You</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg student-card shadow-soft hover:shadow-elevated transition-shadow">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 text-student-accent" />
              <h3 className="text-2xl font-bold mb-3">Share Your Concerns</h3>
              <p className="text-muted-foreground">
                Safely submit your concerns with details and supporting evidence. Your privacy is protected.
              </p>
            </div>
            <div className="text-center p-6 rounded-lg admin-card shadow-soft hover:shadow-elevated transition-shadow">
              <Shield className="w-16 h-16 mx-auto mb-4 text-admin-accent" />
              <h3 className="text-2xl font-bold mb-3">Dedicated Support</h3>
              <p className="text-muted-foreground">
                Our caring team reviews every concern and works diligently to find solutions that work for you.
              </p>
            </div>
            <div className="text-center p-6 rounded-lg complaint-card shadow-soft hover:shadow-elevated transition-shadow">
              <TrendingUp className="w-16 h-16 mx-auto mb-4 text-complaint-accent" />
              <h3 className="text-2xl font-bold mb-3">Watch Progress Unfold</h3>
              <p className="text-muted-foreground">
                Stay informed with real-time updates as we work together towards positive outcomes.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Why StudentVoice Section */}
      <div className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Why StudentVoice?</h2>
            <p className="text-xl text-muted-foreground">
              What makes our platform special and trusted by students across campus
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 text-center hover:shadow-elevated transition-all hover:-translate-y-1">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Lock className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-foreground">Safe & Private</h3>
              <p className="text-sm text-muted-foreground">
                Your information is encrypted and protected. Share concerns confidently knowing your privacy is our priority.
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-elevated transition-all hover:-translate-y-1">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-foreground">Faster Communication</h3>
              <p className="text-sm text-muted-foreground">
                Get quick responses and real-time updates. No more waiting weeks for email replies or getting lost in bureaucracy.
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-elevated transition-all hover:-translate-y-1">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Eye className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-foreground">Full Transparency</h3>
              <p className="text-sm text-muted-foreground">
                Track your concern from submission to resolution. See exactly what&apos;s happening every step of the way.
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-elevated transition-all hover:-translate-y-1">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-foreground">Campus Improvement</h3>
              <p className="text-sm text-muted-foreground">
                Your feedback drives positive change. Help us build a better campus community for everyone.
              </p>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <Card className="p-8 bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
              <h3 className="text-2xl font-bold mb-3 text-foreground">Easy-to-Use Interface</h3>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Simple, intuitive design means you can focus on what matters - being heard. 
                Submit concerns in minutes, not hours. No complicated forms or confusing processes.
              </p>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 px-4 bg-gradient-student">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Make a Difference?</h2>
          <p className="text-xl mb-8 text-muted-foreground">
            Join StudentVoice today and be part of creating a supportive, thriving campus community where every concern is heard and valued. 🌟
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
      <Footer />

      {/* Live Chat */}
      <LiveChat />
    </div>
  );
};

export default Index;