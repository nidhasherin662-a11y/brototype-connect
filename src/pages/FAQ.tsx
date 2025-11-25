import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, HelpCircle, Clock, Shield, Send, CheckCircle, Mail } from "lucide-react";
import Footer from "@/components/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-hero text-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            className="mb-4 text-white hover:bg-white/20"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <div className="flex items-center gap-4 mb-4">
            <HelpCircle className="w-12 h-12" />
            <h1 className="text-4xl font-bold">Frequently Asked Questions</h1>
          </div>
          <p className="text-xl opacity-90">
            Everything you need to know about StudentVoice
          </p>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Accordion type="single" collapsible className="space-y-4">
          {/* Getting Started */}
          <AccordionItem value="item-1" className="bg-white rounded-lg px-6 shadow-soft">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
              <div className="flex items-center gap-3">
                <Send className="w-5 h-5 text-primary" />
                How do I submit a concern?
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed">
              <ol className="list-decimal list-inside space-y-2 mt-2">
                <li>Click on "Student Login" from the homepage</li>
                <li>Create an account or log in with your existing credentials</li>
                <li>Once logged in, you'll see the "Share Your Concern" form</li>
                <li>Fill in the title and detailed description of your concern</li>
                <li>Optionally, upload an image as supporting evidence</li>
                <li>Click "Submit Your Concern" and you're done! 🌟</li>
              </ol>
              <p className="mt-3 text-sm italic">
                💡 Tip: Be as detailed as possible to help us understand and address your concern effectively.
              </p>
            </AccordionContent>
          </AccordionItem>

          {/* Response Times */}
          <AccordionItem value="item-2" className="bg-white rounded-lg px-6 shadow-soft">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-primary" />
                How long does it take to get a response?
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed">
              <p>Our dedicated support team aims to respond within:</p>
              <ul className="list-disc list-inside space-y-2 mt-3 ml-4">
                <li><strong>24 hours</strong> for initial acknowledgment</li>
                <li><strong>2-3 business days</strong> for detailed response</li>
                <li><strong>1 week</strong> for resolution of most concerns</li>
              </ul>
              <p className="mt-3">
                Complex issues may take longer, but we'll keep you updated throughout the process. You'll receive email notifications for every update!
              </p>
            </AccordionContent>
          </AccordionItem>

          {/* Tracking */}
          <AccordionItem value="item-3" className="bg-white rounded-lg px-6 shadow-soft">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-primary" />
                How can I track the status of my concern?
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed">
              <p>Tracking your concern is easy:</p>
              <ol className="list-decimal list-inside space-y-2 mt-3">
                <li>Log in to your student account</li>
                <li>View all your submitted concerns on your dashboard</li>
                <li>Click on any concern to see its current status and conversation history</li>
              </ol>
              <div className="mt-4 bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
                <p className="font-semibold mb-2">Status Meanings:</p>
                <ul className="space-y-1 text-sm">
                  <li>🟡 <strong>Pending:</strong> We've received your concern and will review it soon</li>
                  <li>🔵 <strong>In Progress:</strong> We're actively working on your concern</li>
                  <li>🟢 <strong>Resolved:</strong> Your concern has been addressed</li>
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Email Notifications */}
          <AccordionItem value="item-4" className="bg-white rounded-lg px-6 shadow-soft">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary" />
                Will I receive email notifications?
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed">
              <p>Yes! You'll receive email notifications for:</p>
              <ul className="list-disc list-inside space-y-2 mt-3 ml-4">
                <li>Confirmation when you submit a concern</li>
                <li>Status updates (when moved to In Progress or Resolved)</li>
                <li>New responses from our support team</li>
              </ul>
              <p className="mt-3">
                Make sure to check your email regularly and add our email to your contacts to ensure notifications don't end up in spam!
              </p>
            </AccordionContent>
          </AccordionItem>

          {/* Privacy */}
          <AccordionItem value="item-5" className="bg-white rounded-lg px-6 shadow-soft">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-primary" />
                Is my information private and secure?
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed">
              <p className="font-semibold mb-2">Absolutely! Your privacy is our top priority.</p>
              <div className="space-y-3">
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="font-semibold text-green-800">🔒 What we protect:</p>
                  <ul className="list-disc list-inside mt-2 text-sm text-green-700 ml-4">
                    <li>All data is encrypted and stored securely</li>
                    <li>Only authorized support staff can view concerns</li>
                    <li>Your personal information is never shared with third parties</li>
                    <li>We comply with data protection regulations</li>
                  </ul>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="font-semibold text-blue-800">👁️ Who can see my concerns:</p>
                  <ul className="list-disc list-inside mt-2 text-sm text-blue-700 ml-4">
                    <li>Only you and our support team have access</li>
                    <li>Your concerns are NOT visible to other students</li>
                    <li>Support staff are trained on confidentiality</li>
                  </ul>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Concern Types */}
          <AccordionItem value="item-6" className="bg-white rounded-lg px-6 shadow-soft">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
              What types of concerns can I submit?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed">
              <p>You can submit any campus-related concern, including:</p>
              <div className="grid md:grid-cols-2 gap-3 mt-3">
                <div className="bg-purple-50 p-3 rounded-lg">
                  <p className="font-semibold text-purple-800 mb-2">Academic Issues</p>
                  <ul className="text-sm text-purple-700 space-y-1">
                    <li>• Course content or teaching</li>
                    <li>• Grading concerns</li>
                    <li>• Schedule conflicts</li>
                  </ul>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="font-semibold text-blue-800 mb-2">Facilities</p>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Classroom conditions</li>
                    <li>• Equipment issues</li>
                    <li>• Safety concerns</li>
                  </ul>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="font-semibold text-green-800 mb-2">Administrative</p>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Registration issues</li>
                    <li>• Policy questions</li>
                    <li>• Documentation</li>
                  </ul>
                </div>
                <div className="bg-orange-50 p-3 rounded-lg">
                  <p className="font-semibold text-orange-800 mb-2">Campus Life</p>
                  <ul className="text-sm text-orange-700 space-y-1">
                    <li>• Student services</li>
                    <li>• Events and activities</li>
                    <li>• Community concerns</li>
                  </ul>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Support */}
          <AccordionItem value="item-7" className="bg-white rounded-lg px-6 shadow-soft">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
              What if I need additional help?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed">
              <p>We're here to support you! If you need additional assistance:</p>
              <ul className="list-disc list-inside space-y-2 mt-3 ml-4">
                <li>Reply to any email notification you receive</li>
                <li>Use the messaging feature in your concern thread to ask questions</li>
                <li>Contact your campus support office directly for urgent matters</li>
              </ul>
              <div className="mt-4 bg-gradient-hero text-white p-4 rounded-lg">
                <p className="font-semibold mb-2">💪 Remember:</p>
                <p className="text-sm">
                  Your voice matters, and we're committed to creating a supportive campus community. 
                  No concern is too small, and every submission helps us improve!
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* CTA Section */}
        <div className="mt-12 bg-gradient-to-r from-purple-50 to-blue-50 p-8 rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
          <p className="text-muted-foreground mb-6">
            We're here to help! Log in to your account and submit a concern, or reach out to our support team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate("/auth")}
              className="bg-primary hover:bg-primary/90"
            >
              Go to Student Portal
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/")}
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FAQ;
