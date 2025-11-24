import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Upload } from "lucide-react";

interface ComplaintFormProps {
  onSuccess: () => void;
}

const ComplaintForm = ({ onSuccess }: ComplaintFormProps) => {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      let imageUrl = null;
      
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('complaint-images')
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('complaint-images')
          .getPublicUrl(fileName);

        imageUrl = publicUrl;
      }

      const { error } = await supabase
        .from('complaints')
        .insert({
          student_id: user.id,
          title,
          description,
          image_url: imageUrl,
        });

      if (error) throw error;

      toast.success("Complaint submitted successfully!");
      setTitle("");
      setDescription("");
      setImageFile(null);
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || "Failed to submit complaint");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 complaint-card shadow-soft">
      <h2 className="text-2xl font-bold mb-4">Submit New Complaint</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Brief description of the issue"
            maxLength={100}
          />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            placeholder="Provide detailed information about your complaint"
            rows={4}
            maxLength={1000}
          />
        </div>
        <div>
          <Label htmlFor="image">Upload Image (Optional)</Label>
          <div className="mt-2">
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="cursor-pointer"
            />
            {imageFile && (
              <p className="text-sm text-muted-foreground mt-2">
                <Upload className="inline w-4 h-4 mr-1" />
                {imageFile.name}
              </p>
            )}
          </div>
        </div>
        <Button type="submit" className="w-full bg-complaint-accent hover:bg-complaint-accent/90" disabled={loading}>
          {loading ? "Submitting..." : "Submit Complaint"}
        </Button>
      </form>
    </Card>
  );
};

export default ComplaintForm;