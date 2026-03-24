-- ============================================================
-- VitaLog — Supabase Storage Setup
-- ============================================================
-- Run this SQL in the Supabase SQL Editor to create the
-- required storage bucket and RLS policies for exam uploads.
-- ============================================================

-- 1. Create the "exams" storage bucket (public, for exam files)
INSERT INTO storage.buckets (id, name, public)
VALUES ('exams', 'exams', true)
ON CONFLICT (id) DO NOTHING;

-- 2. RLS policies for the "exams" bucket

-- Allow authenticated users to upload files to their own folder
CREATE POLICY "Users can upload exam files"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'exams'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow authenticated users to read their own files
CREATE POLICY "Users can read own exam files"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'exams'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow public read access (since bucket is public, for shared links)
CREATE POLICY "Public can read exam files"
  ON storage.objects FOR SELECT
  TO anon
  USING (bucket_id = 'exams');

-- Allow authenticated users to delete their own files
CREATE POLICY "Users can delete own exam files"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'exams'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- ============================================================
-- Notification preference columns on profiles table
-- ============================================================
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS notify_medication boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS notify_daily_checkin boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS notify_weekly_report boolean DEFAULT false;
