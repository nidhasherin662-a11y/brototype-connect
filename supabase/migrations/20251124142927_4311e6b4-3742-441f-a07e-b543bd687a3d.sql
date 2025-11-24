-- Add category column to complaints table
ALTER TABLE public.complaints 
ADD COLUMN category TEXT NOT NULL DEFAULT 'General';

-- Add a check constraint for valid categories
ALTER TABLE public.complaints
ADD CONSTRAINT valid_category CHECK (
  category IN ('Academic', 'Infrastructure', 'Food', 'Transport', 'Hostel', 'Administration', 'General')
);

-- Add index for better query performance
CREATE INDEX idx_complaints_category ON public.complaints(category);