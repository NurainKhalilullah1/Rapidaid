// TypeScript types matching our Supabase schema
// Compatible with @supabase/supabase-js v2 generics

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string;
          email: string;
          password: string;
          matric_no: string;
          faculty: string;
          department: string;
          blood_group: string;
          genotype: string;
          allergies: string[];
          medical_history: string[];
          student_health_id: string;
          registered_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          password: string;
          matric_no: string;
          faculty: string;
          department: string;
          blood_group: string;
          genotype: string;
          allergies?: string[];
          medical_history?: string[];
          student_health_id: string;
          registered_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          password?: string;
          matric_no?: string;
          faculty?: string;
          department?: string;
          blood_group?: string;
          genotype?: string;
          allergies?: string[];
          medical_history?: string[];
          student_health_id?: string;
          registered_at?: string;
        };
        Relationships: [];
      };
      appointments: {
        Row: {
          id: string;
          user_id: string;
          department: string;
          date: string;
          time: string;
          queue_position: number;
          estimated_wait_minutes: number;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          department: string;
          date: string;
          time: string;
          queue_position: number;
          estimated_wait_minutes: number;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          department?: string;
          date?: string;
          time?: string;
          queue_position?: number;
          estimated_wait_minutes?: number;
          status?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      emergencies: {
        Row: {
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
          status: string;
          timestamp: string;
          fallback_sms_sent: boolean;
        };
        Insert: {
          id?: string;
          user_id: string;
          user_name: string;
          student_health_id: string;
          blood_group: string;
          genotype: string;
          allergies?: string[];
          medical_history?: string[];
          latitude: number;
          longitude: number;
          status?: string;
          timestamp?: string;
          fallback_sms_sent?: boolean;
        };
        Update: {
          id?: string;
          user_id?: string;
          user_name?: string;
          student_health_id?: string;
          blood_group?: string;
          genotype?: string;
          allergies?: string[];
          medical_history?: string[];
          latitude?: number;
          longitude?: number;
          status?: string;
          timestamp?: string;
          fallback_sms_sent?: boolean;
        };
        Relationships: [];
      };
      meals: {
        Row: {
          id: string;
          name: string;
          description: string;
          local_ingredients: string[];
          price_range: string;
          restricted_for: string[];
          contains_allergens: string[];
          image_url: string;
          benefits: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          local_ingredients?: string[];
          price_range: string;
          restricted_for?: string[];
          contains_allergens?: string[];
          image_url?: string;
          benefits: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          local_ingredients?: string[];
          price_range?: string;
          restricted_for?: string[];
          contains_allergens?: string[];
          image_url?: string;
          benefits?: string;
        };
        Relationships: [];
      };
      chat_messages: {
        Row: {
          id: string;
          user_id: string;
          role: string;
          content: string;
          thought: string | null;
          timestamp: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          role: string;
          content: string;
          thought?: string | null;
          timestamp?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          role?: string;
          content?: string;
          thought?: string | null;
          timestamp?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_next_queue_position: {
        Args: {
          dept: string;
          appt_date: string;
        };
        Returns: number;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

// Convenience type aliases
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type Appointment = Database['public']['Tables']['appointments']['Row'];
export type AppointmentInsert = Database['public']['Tables']['appointments']['Insert'];
export type Emergency = Database['public']['Tables']['emergencies']['Row'];
export type EmergencyInsert = Database['public']['Tables']['emergencies']['Insert'];
export type Meal = Database['public']['Tables']['meals']['Row'];
export type ChatMsg = Database['public']['Tables']['chat_messages']['Row'];
export type ChatMsgInsert = Database['public']['Tables']['chat_messages']['Insert'];
