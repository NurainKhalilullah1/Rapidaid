'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { Meal, Profile } from '../lib/database.types';

export function useMeals(profile: Profile | null) {
  const [allMeals, setAllMeals] = useState<Meal[]>([]);
  const [filteredMeals, setFilteredMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all meals from Supabase
  useEffect(() => {
    const fetchMeals = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('meals')
        .select('*')
        .order('name');

      if (!error && data) {
        setAllMeals(data as Meal[]);
      }
      setLoading(false);
    };

    fetchMeals();
  }, []);

  // Filter meals based on user's medical history and allergies
  useEffect(() => {
    if (!profile) {
      setFilteredMeals(allMeals);
      return;
    }

    const userAllergies = (profile.allergies ?? []).map((a) => a.toLowerCase());
    const userHistory = (profile.medical_history ?? []).map((h) => h.toLowerCase());

    const filtered = allMeals.filter((meal) => {
      const restrictedByHistory = (meal.restricted_for ?? []).some((condition) =>
        userHistory.includes(condition.toLowerCase())
      );
      const restrictedByAllergy = (meal.contains_allergens ?? []).some((allergen) =>
        userAllergies.includes(allergen.toLowerCase())
      );
      return !restrictedByHistory && !restrictedByAllergy;
    });

    setFilteredMeals(filtered);
  }, [allMeals, profile]);

  const hiddenCount = allMeals.length - filteredMeals.length;

  return {
    allMeals,
    filteredMeals,
    hiddenCount,
    loading,
  };
}
