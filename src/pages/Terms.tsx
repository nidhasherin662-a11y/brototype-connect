import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Footer from "@/components/Footer";

const Terms = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-primary/5 to-accent/10">
      <div className="flex-1 container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <div className="max-w-4xl mx-auto bg-card/80 backdrop-blur-sm rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Terms & Conditions
          </h1>
          
          <div className="space-y-6 text-muted-foreground">
            <section>
              <h2 className="text-2xl font-semibold mb-3 text-foreground">1. Acceptance of Terms</h2>
              <p>
                By accessing and using StudentVoice, you accept and agree to be bound by the terms 
                and provisions of this agreement. If you do not agree to these terms, please do not 
                use our service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3 text-foreground">2. Use of Service</h2>
              <p>
                StudentVoice is designed to facilitate communication between students and campus 
                administration. You agree to use this service only for legitimate concerns related 
                to your campus experience.
              </p>
              <p className="mt-2">You agree NOT to:</p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li>Submit false or misleading information</li>
                <li>Use the platform to harass or defame others</li>
                <li>Attempt to gain unauthorized access to the system</li>
                <li>Interfere with the proper functioning of the service</li>
                <li>Use the platform for any illegal purposes</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3 text-foreground">3. User Accounts</h2>
              <p>
                You are responsible for maintaining the confidentiality of your account credentials. 
                You agree to accept responsibility for all activities that occur under your account. 
                Notify us immediately of any unauthorized use of your account.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3 text-foreground">4. Content Guidelines</h2>
              <p>
                All concerns and communications submitted through StudentVoice must be respectful 
                and appropriate. We reserve the right to remove content that violates our community 
                standards or these terms of service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3 text-foreground">5. Intellectual Property</h2>
              <p>
                The StudentVoice platform, including all content, features, and functionality, is 
                owned by StudentVoice and is protected by international copyright, trademark, and 
                other intellectual property laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3 text-foreground">6. Disclaimer of Warranties</h2>
              <p>
                StudentVoice is provided "as is" without any warranties, expressed or implied. We 
                do not guarantee that the service will be uninterrupted, secure, or error-free.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3 text-foreground">7. Limitation of Liability</h2>
              <p>
                StudentVoice shall not be liable for any indirect, incidental, special, consequential, 
                or punitive damages resulting from your use of or inability to use the service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3 text-foreground">8. Termination</h2>
              <p>
                We reserve the right to terminate or suspend your account at any time for violations 
                of these terms or for any other reason we deem appropriate.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3 text-foreground">9. Changes to Terms</h2>
              <p>
                We reserve the right to modify these terms at any time. We will notify users of any 
                material changes. Your continued use of StudentVoice after such modifications 
                constitutes acceptance of the updated terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3 text-foreground">10. Contact Information</h2>
              <p>
                For questions about these Terms & Conditions, please contact us at{" "}
                <a href="mailto:legal@studentvoice.com" className="text-primary hover:underline">
                  legal@studentvoice.com
                </a>
              </p>
            </section>

            <p className="text-sm mt-8 pt-6 border-t border-border">
              Last Updated: January 2025
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Terms;
