// ============================================================
// VitaLog — TypeScript Types
// ============================================================

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  email: string | null;
  date_of_birth: string | null;
  blood_type: string | null;
  allergies: string[] | null;
  chronic_conditions: string[] | null;
  emergency_contact: string | null;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  stripe_price_id: string | null;
  status: SubscriptionStatus;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  created_at: string;
  updated_at: string;
}

export type SubscriptionStatus =
  | 'trialing'
  | 'active'
  | 'canceled'
  | 'incomplete'
  | 'incomplete_expired'
  | 'past_due'
  | 'unpaid'
  | 'paused';

export interface HealthEntry {
  id: string;
  user_id: string;
  content_raw: string;
  content_parsed: ContentParsed | null;
  symptoms: string[] | null;
  category: string | null;
  intensity: number | null;
  entry_date: string;
  ai_processed: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContentParsed {
  symptoms: {
    name: string;
    severity: string;
    location?: string;
  }[];
  summary: string;
  suggested_category: string;
  suggested_intensity: number;
  triggers?: string[];
  duration?: string;
}

export interface Medication {
  id: string;
  user_id: string;
  name: string;
  dosage: string | null;
  frequency: string | null;
  schedule: string[] | null;
  start_date: string | null;
  end_date: string | null;
  is_active: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface MedicationLog {
  id: string;
  user_id: string;
  medication_id: string;
  taken_at: string;
  status: 'taken' | 'skipped' | 'late';
  created_at: string;
}

export interface Exam {
  id: string;
  user_id: string;
  name: string;
  exam_date: string | null;
  file_url: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: string;
  user_id: string;
  doctor_name: string | null;
  specialty: string | null;
  appointment_date: string;
  summary: string | null;
  report_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Report {
  id: string;
  user_id: string;
  period_start: string;
  period_end: string;
  content: ReportContent;
  pdf_url: string | null;
  share_token: string | null;
  share_expires_at: string | null;
  created_at: string;
}

export interface ReportContent {
  title: string;
  patient_name: string;
  period: string;
  summary: string;
  timeline: {
    date: string;
    entries: {
      symptom: string;
      intensity: number;
      category: string;
      notes?: string;
    }[];
  }[];
  patterns: {
    description: string;
    frequency: string;
    severity: string;
  }[];
  medications: {
    name: string;
    dosage: string;
    adherence_rate: number;
  }[];
  recommendations: string[];
}

// ============================================================
// UI Helper Types
// ============================================================

export type SymptomCategory =
  | 'dor'
  | 'humor'
  | 'energia'
  | 'digestão'
  | 'sono'
  | 'respiração'
  | 'pele'
  | 'outros';

export const SYMPTOM_CATEGORIES: { value: SymptomCategory; label: string; emoji: string; color: string }[] = [
  { value: 'dor', label: 'Dor', emoji: '🤕', color: '#EF4444' },
  { value: 'humor', label: 'Humor', emoji: '😊', color: '#8B5CF6' },
  { value: 'energia', label: 'Energia', emoji: '⚡', color: '#F59E0B' },
  { value: 'digestão', label: 'Digestão', emoji: '🍽️', color: '#10B981' },
  { value: 'sono', label: 'Sono', emoji: '😴', color: '#3B82F6' },
  { value: 'respiração', label: 'Respiração', emoji: '🫁', color: '#06B6D4' },
  { value: 'pele', label: 'Pele', emoji: '🧴', color: '#EC4899' },
  { value: 'outros', label: 'Outros', emoji: '📋', color: '#6B7280' },
];

export const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const;

export const INTENSITY_LABELS: Record<number, { label: string; color: string }> = {
  1: { label: 'Muito leve', color: '#10B981' },
  2: { label: 'Leve', color: '#34D399' },
  3: { label: 'Leve-moderado', color: '#6EE7B7' },
  4: { label: 'Moderado', color: '#FCD34D' },
  5: { label: 'Moderado', color: '#FBBF24' },
  6: { label: 'Moderado-forte', color: '#F59E0B' },
  7: { label: 'Forte', color: '#F97316' },
  8: { label: 'Muito forte', color: '#EF4444' },
  9: { label: 'Severo', color: '#DC2626' },
  10: { label: 'Insuportável', color: '#991B1B' },
};
