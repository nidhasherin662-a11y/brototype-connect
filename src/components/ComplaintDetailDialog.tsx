import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { format } from "date-fns";
import { Calendar, Clock, Send } from "lucide-react";

interface Response {
  id: string;
  message: string;
  is_admin: boolean;
  created_at: string;
  user_id: string;
}

interface ComplaintDetailDialogProps {
  complaint: any;
  onClose: () => void;
  isAdmin: boolean;
  studentName?: string;
}

const ComplaintDetailDialog = ({
  complaint,
  onClose,
  isAdmin,
  studentName,
}: ComplaintDetailDialogProps) => {
  const [responses, setResponses] = useState<Response[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [status, setStatus] = useState(complaint.status);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchResponses();
    subscribeToResponses();
  }, [complaint.id]);

  const fetchResponses = async () => {
    const { data, error } = await supabase
      .from("complaint_responses")
      .select("*")
      .eq("complaint_id", complaint.id)
      .order("created_at", { ascending: true });

    if (!error && data) {
      setResponses(data);
    }
  };

  const subscribeToResponses = () => {
    const channel = supabase
      .channel(`responses-${complaint.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "complaint_responses",
          filter: `complaint_id=eq.${complaint.id}`,
        },
        () => {
          fetchResponses();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("complaint_responses")
        .insert({
          complaint_id: complaint.id,
          user_id: user.id,
          message: newMessage,
          is_admin: isAdmin,
        });

      if (error) throw error;

      setNewMessage("");
      toast.success("Message sent!");
    } catch (error: any) {
      toast.error("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (status === complaint.status) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from("complaints")
        .update({ status })
        .eq("id", complaint.id);

      if (error) throw error;

      toast.success("Status updated!");
      onClose();
    } catch (error: any) {
      toast.error("Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "status-pending";
      case "In Progress":
        return "status-progress";
      case "Resolved":
        return "status-resolved";
      default:
        return "bg-gray-500";
    }
  };

  const date = new Date(complaint.created_at);
  const dateStr = format(date, "PPP");
  const timeStr = format(date, "p");
  const dayStr = format(date, "EEEE");

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{complaint.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Complaint Details */}
          <div className="complaint-card p-4 rounded-lg">
            <div className="flex justify-between items-start mb-3">
              <Badge className={getStatusColor(complaint.status)}>
                {complaint.status}
              </Badge>
              {studentName && (
                <p className="text-sm text-muted-foreground">
                  Student: <span className="font-semibold">{studentName}</span>
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-3">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {dateStr} ({dayStr})
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {timeStr}
              </span>
            </div>

            <p className="text-foreground mb-3">{complaint.description}</p>
            
            {complaint.image_url && (
              <img
                src={complaint.image_url}
                alt="Complaint evidence"
                className="w-full h-64 object-cover rounded-md"
              />
            )}
          </div>

          {/* Admin Controls */}
          {isAdmin && (
            <div className="flex gap-4">
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleStatusUpdate} disabled={loading || status === complaint.status}>
                Update Status
              </Button>
            </div>
          )}

          {/* Conversation Thread */}
          <div>
            <h3 className="text-lg font-bold mb-3">Conversation</h3>
            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
              {responses.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No messages yet</p>
              ) : (
                responses.map((response) => (
                  <div
                    key={response.id}
                    className={`p-3 rounded-lg ${
                      response.is_admin ? "admin-card ml-8" : "student-card mr-8"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-sm font-semibold">
                        {response.is_admin ? "Admin" : "Student"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(response.created_at), "PPp")}
                      </span>
                    </div>
                    <p className="text-sm">{response.message}</p>
                  </div>
                ))
              )}
            </div>

            {/* Message Input */}
            <div className="flex gap-2">
              <Textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                rows={2}
                maxLength={500}
              />
              <Button onClick={handleSendMessage} disabled={loading || !newMessage.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ComplaintDetailDialog;