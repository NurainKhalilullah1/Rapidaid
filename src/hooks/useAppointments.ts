'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { Appointment } from '../lib/database.types';

export function useAppointments(userId: string | undefined) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch appointments
  const fetchAppointments = useCallback(async () => {
    if (!userId) return;
    setLoading(true);

    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setAppointments(data as Appointment[]);
    }
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  // Subscribe to realtime updates
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel('appointments-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'appointments',
          filter: `user_id=eq.${userId}`,
        },
        () => {
          fetchAppointments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, fetchAppointments]);

  // Book new appointment
  const bookAppointment = async (
    department: string,
    date: string,
    time: string
  ): Promise<Appointment | null> => {
    if (!userId) return null;

    // Calculate queue position
    const { data: existing } = await supabase
      .from('appointments')
      .select('queue_position')
      .eq('department', department)
      .eq('date', date)
      .eq('status', 'scheduled')
      .order('queue_position', { ascending: false })
      .limit(1);

    const queuePosition = existing && existing.length > 0
      ? (existing[0] as Appointment).queue_position + 1
      : 1;
    const estimatedWait = queuePosition * 15;

    const { data, error } = await supabase
      .from('appointments')
      .insert({
        user_id: userId,
        department,
        date,
        time,
        queue_position: queuePosition,
        estimated_wait_minutes: estimatedWait,
        status: 'scheduled',
      })
      .select()
      .single();

    if (error) {
      console.error('Book appointment error:', error);
      return null;
    }

    // Optimistic update
    setAppointments((prev) => [data as Appointment, ...prev]);
    return data as Appointment;
  };

  // Cancel appointment
  const cancelAppointment = async (id: string): Promise<boolean> => {
    const { error } = await supabase
      .from('appointments')
      .update({ status: 'cancelled' })
      .eq('id', id);

    if (error) {
      console.error('Cancel appointment error:', error);
      return false;
    }

    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'cancelled' } : a))
    );
    return true;
  };

  const activeAppointment = appointments.find((a) => a.status === 'scheduled');

  return {
    appointments,
    activeAppointment,
    loading,
    bookAppointment,
    cancelAppointment,
    refetch: fetchAppointments,
  };
}
