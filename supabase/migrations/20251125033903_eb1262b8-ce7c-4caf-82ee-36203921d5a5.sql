-- Add priority column to complaints table
ALTER TABLE complaints ADD COLUMN priority TEXT NOT NULL DEFAULT 'Medium';

-- Add check constraint for priority values
ALTER TABLE complaints ADD CONSTRAINT complaints_priority_check 
  CHECK (priority IN ('Low', 'Medium', 'High', 'Urgent'));

-- Create index on priority for better filtering performance
CREATE INDEX idx_complaints_priority ON complaints(priority);