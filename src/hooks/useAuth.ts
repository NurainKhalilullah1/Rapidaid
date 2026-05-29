'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { Profile } from '../lib/database.types';

const SESSION_KEY = 'rapidaid_session';

interface SignUpData {
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
}

export function useAuth() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Convenience: expose user-like object for hooks that need user.id
  const user = profile ? { id: profile.id } : null;

  // Restore session from localStorage on mount
  const restoreSession = useCallback(async () => {
    const storedId = localStorage.getItem(SESSION_KEY);
    if (!storedId) {
      setLoading(false);
      return;
    }

    const { data, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', storedId)
      .single();

    if (fetchError || !data) {
      localStorage.removeItem(SESSION_KEY);
      setLoading(false);
      return;
    }

    setProfile(data as Profile);
    setLoading(false);
  }, []);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  // Generate unique student health ID
  const generateHealthId = (): string => {
    const year = new Date().getFullYear();
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    return `RA-${year}-${randomNum}`;
  };

  // Sign up: inserts profile directly into Supabase profiles table
  const signUp = async (data: SignUpData): Promise<Profile | null> => {
    setError(null);
    setLoading(true);

    try {
      const studentHealthId = generateHealthId();

      const { data: inserted, error: insertError } = await supabase
        .from('profiles')
        .insert({
          name: data.name,
          email: data.email,
          password: data.password,
          matric_no: data.matric_no,
          faculty: data.faculty,
          department: data.department,
          blood_group: data.blood_group,
          genotype: data.genotype,
          allergies: data.allergies,
          medical_history: data.medical_history,
          student_health_id: studentHealthId,
        })
        .select()
        .single();

      if (insertError) {
        console.error('Profile insert error details:', {
          message: insertError.message,
          code: insertError.code,
          details: insertError.details,
          hint: insertError.hint
        });
        if (insertError.message?.includes('duplicate')) {
          setError('An account with this email already exists.');
        } else {
          setError('Registration failed: ' + (insertError.message || 'Unknown database error'));
        }
        setLoading(false);
        return null;
      }

      const prof = inserted as Profile;
      setProfile(prof);
      localStorage.setItem(SESSION_KEY, prof.id);
      setLoading(false);
      return prof;
    } catch (err) {
      console.error('SignUp error:', err);
      setError('An unexpected error occurred during registration.');
      setLoading(false);
      return null;
    }
  };

  // Sign in with Health ID + Password
  const signIn = async (healthId: string, password: string): Promise<boolean> => {
    setError(null);
    setLoading(true);

    try {
      // Look up profile by student_health_id
      const { data: profileData, error: lookupError } = await supabase
        .from('profiles')
        .select('*')
        .eq('student_health_id', healthId.toUpperCase().trim())
        .single();

      if (lookupError || !profileData) {
        setError('No account found with this Health ID. Please register first.');
        setLoading(false);
        return false;
      }

      const prof = profileData as Profile;

      // Check password
      if (prof.password !== password) {
        setError('Invalid password. Please try again.');
        setLoading(false);
        return false;
      }

      setProfile(prof);
      localStorage.setItem(SESSION_KEY, prof.id);
      setLoading(false);
      return true;
    } catch (err) {
      console.error('SignIn error:', err);
      setError('An unexpected error occurred during login.');
      setLoading(false);
      return false;
    }
  };

  // Sign out
  const signOut = () => {
    setProfile(null);
    localStorage.removeItem(SESSION_KEY);
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  // Update profile (e.g., edit allergies, medical history)
  const updateProfile = async (updates: Partial<Profile>): Promise<boolean> => {
    if (!profile) return false;
    setError(null);

    const { error: updateError } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', profile.id);

    if (updateError) {
      setError('Failed to update profile: ' + updateError.message);
      return false;
    }

    // Refresh profile
    const { data: refreshed } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', profile.id)
      .single();

    if (refreshed) {
      setProfile(refreshed as Profile);
    }
    return true;
  };

  return {
    user,
    profile,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    updateProfile,
    clearError: () => setError(null),
  };
}
