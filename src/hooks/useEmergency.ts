'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { Emergency } from '../lib/database.types';
import type { Profile } from '../lib/database.types';

export function useEmergency(userId: string | undefined, profile: Profile | null) {
  const [emergencies, setEmergencies] = useState<Emergency[]>([]);
  const [activeEmergency, setActiveEmergency] = useState<Emergency | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch emergencies
  const fetchEmergencies = useCallback(async () => {
    if (!userId) return;

    const { data, error } = await supabase
      .from('emergencies')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false });

    if (!error && data) {
      setEmergencies(data as Emergency[]);
      const active = (data as Emergency[]).find((e) => e.status === 'active');
      setActiveEmergency(active ?? null);
    }
  }, [userId]);

  useEffect(() => {
    fetchEmergencies();
  }, [fetchEmergencies]);

  // Trigger emergency SOS
  const triggerEmergency = async (
    latitude: number,
    longitude: number
  ): Promise<Emergency | null> => {
    if (!userId || !profile) return null;
    setLoading(true);

    const { data, error } = await supabase
      .from('emergencies')
      .insert({
        user_id: userId,
        user_name: profile.name,
        student_health_id: profile.student_health_id,
        blood_group: profile.blood_group,
        genotype: profile.genotype,
        allergies: profile.allergies ?? [],
        medical_history: profile.medical_history ?? [],
        latitude,
        longitude,
        status: 'active',
        fallback_sms_sent: true,
      })
      .select()
      .single();

    setLoading(false);

    if (error) {
      console.error('Trigger emergency error:', error);
      return null;
    }

    const alert = data as Emergency;
    setActiveEmergency(alert);
    setEmergencies((prev) => [alert, ...prev]);
    return alert;
  };

  // Resolve emergency
  const resolveEmergency = async (id: string): Promise<boolean> => {
    const { error } = await supabase
      .from('emergencies')
      .update({ status: 'resolved' })
      .eq('id', id);

    if (error) {
      console.error('Resolve emergency error:', error);
      return false;
    }

    setActiveEmergency(null);
    setEmergencies((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: 'resolved' } : e))
    );
    return true;
  };

  return {
    emergencies,
    activeEmergency,
    loading,
    triggerEmergency,
    resolveEmergency,
  };
}
