export interface UserProfile {
  id: string;
  name: string;
  email: string;
  matric_no: string;
  department: string;
  blood_group: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  genotype: 'AA' | 'AS' | 'SS' | 'AC';
  allergies: string[];
  medical_history: string[]; // e.g., 'Ulcer', 'Asthma', 'Hypertension', 'Diabetes'
  student_health_id: string; // RA-2026-XXXXX
  registered_at: string;
}

export interface EmergencyAlert {
  id: string;
  user_id: string;
  user_name: string;
  student_health_id: string;
  blood_group: string;
  genotype: string;
  allergies: string[];
  medical_history: string[];
  latitude: number;
  longitude: number;
  status: 'active' | 'resolved';
  timestamp: string;
  fallback_sms_sent: boolean;
}

export interface Appointment {
  id: string;
  user_id: string;
  department: 'General Outpatient' | 'Dental Clinic' | 'Nursing Unit' | 'Pharmacy' | 'Laboratory';
  date: string;
  time: string;
  queue_position: number;
  estimated_wait_minutes: number;
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
  created_at: string;
}

export interface DietMeal {
  id: string;
  name: string;
  description: string;
  local_ingredients: string[];
  price_range: 'Budget' | 'Moderate' | 'Premium';
  restricted_for: string[]; // medical conditions that cannot eat this (e.g. 'Ulcer', 'Diabetes')
  contains_allergens: string[]; // e.g. 'Nuts', 'Fish', 'Dairy'
  image_url: string;
  benefits: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
