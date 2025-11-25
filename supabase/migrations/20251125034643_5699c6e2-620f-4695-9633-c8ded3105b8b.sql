-- Create satisfaction_surveys table to track survey responses
CREATE TABLE IF NOT EXISTS public.satisfaction_surveys (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  complaint_id UUID NOT NULL REFERENCES public.complaints(id) ON DELETE CASCADE,
  student_id UUID NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT,
  response_time_rating INTEGER CHECK (response_time_rating >= 1 AND response_time_rating <= 5),
  support_quality_rating INTEGER CHECK (support_quality_rating >= 1 AND support_quality_rating <= 5),
  would_recommend BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  submitted_at TIMESTAMP WITH TIME ZONE,
  survey_token UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE
);

-- Enable RLS
ALTER TABLE public.satisfaction_surveys ENABLE ROW LEVEL SECURITY;

-- Students can view their own surveys
CREATE POLICY "Students can view their own surveys"
ON public.satisfaction_surveys
FOR SELECT
USING (auth.uid() = student_id);

-- Students can submit their own surveys
CREATE POLICY "Students can submit their own surveys"
ON public.satisfaction_surveys
FOR INSERT
WITH CHECK (auth.uid() = student_id);

-- Students can update their own unsubmitted surveys
CREATE POLICY "Students can update their own surveys"
ON public.satisfaction_surveys
FOR UPDATE
USING (auth.uid() = student_id AND submitted_at IS NULL);

-- Admins can view all surveys
CREATE POLICY "Admins can view all surveys"
ON public.satisfaction_surveys
FOR SELECT
USING (is_admin(auth.uid()));

-- Create index for performance
CREATE INDEX idx_satisfaction_surveys_complaint ON public.satisfaction_surveys(complaint_id);
CREATE INDEX idx_satisfaction_surveys_student ON public.satisfaction_surveys(student_id);
CREATE INDEX idx_satisfaction_surveys_token ON public.satisfaction_surveys(survey_token);