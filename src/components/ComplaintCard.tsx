import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Calendar, Clock, MessageSquare } from "lucide-react";

interface Complaint {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

interface ComplaintCardProps {
  complaint: Complaint;
  onClick?: () => void;
  showStudentInfo?: boolean;
  studentName?: string;
}

const ComplaintCard = ({ complaint, onClick, showStudentInfo, studentName }: ComplaintCardProps) => {
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
    <Card 
      className="p-6 complaint-card shadow-soft hover:shadow-elevated transition-all cursor-pointer"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-bold flex-1">{complaint.title}</h3>
        <Badge className={getStatusColor(complaint.status)}>
          {complaint.status}
        </Badge>
      </div>
      
      {showStudentInfo && studentName && (
        <p className="text-sm text-muted-foreground mb-2">
          Student: <span className="font-semibold">{studentName}</span>
        </p>
      )}

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
      
      <p className="text-muted-foreground line-clamp-2 mb-3">
        {complaint.description}
      </p>
      
      {complaint.image_url && (
        <img
          src={complaint.image_url}
          alt="Complaint evidence"
          className="w-full h-48 object-cover rounded-md mb-3"
        />
      )}
      
      <div className="flex items-center gap-2 text-sm text-primary">
        <MessageSquare className="w-4 h-4" />
        <span>Click to view conversation</span>
      </div>
    </Card>
  );
};

export default ComplaintCard;