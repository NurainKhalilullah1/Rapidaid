'use client';

import { useAuth } from '../../../hooks/useAuth';
import { useMeals } from '../../../hooks/useMeals';

export default function DietPage() {
  const { profile } = useAuth();
  const { filteredMeals, allMeals, hiddenCount, loading } = useMeals(profile);

  if (!profile) return null;

  return (
    <div className="flex-1 flex flex-col">
      <header className="sticky top-0 z-20 w-full border-b border-border glass">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center">
          <h1 className="font-heading font-bold text-base text-slate-900 dark:text-white">Nutritional Diet Hub</h1>
        </div>
      </header>

      <div className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6 sm:space-y-8 animate-slide-up">
        {/* Filter Banner */}
        <div className="bg-card border border-border p-5 sm:p-6 rounded-2xl shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="font-heading font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
                Active Medical Filters
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed max-w-xl">
                RapidAid automatically restricts meals that conflict with your logged allergies or health conditions.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {(profile.medical_history ?? []).map((cond, i) => (
                <span key={`cond-${i}`} className="px-2.5 py-1 rounded-full bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900/30 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
                  {cond}
                </span>
              ))}
              {(profile.allergies ?? []).map((allergy, i) => (
                <span key={`allergy-${i}`} className="px-2.5 py-1 rounded-full bg-orange-50 dark:bg-orange-950/20 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-900/30 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                  {allergy}
                </span>
              ))}
              {(profile.medical_history ?? []).length === 0 && (profile.allergies ?? []).length === 0 && (
                <span className="px-2.5 py-1 rounded-full bg-medical-green-light text-medical-green border border-medical-green/10 text-xs font-bold uppercase tracking-wider">
                  No dietary limitations
                </span>
              )}
            </div>
          </div>

          {hiddenCount > 0 && (
            <div className="mt-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 text-amber-800 dark:text-amber-300 text-xs font-bold flex items-center gap-2">
              <svg className="w-4 h-4 text-amber-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Auto-Protection: {hiddenCount} meal{hiddenCount > 1 ? 's' : ''} hidden due to your health profile.
            </div>
          )}
        </div>

        {/* Loading state */}
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="w-8 h-8 border-4 border-medical-green border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white px-0.5">Budget-Friendly Student Meals</h3>

            {filteredMeals.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredMeals.map((meal) => (
                  <div key={meal.id} className="bg-card border border-border rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden flex flex-col justify-between">
                    <div className="p-5 space-y-3">
                      <div className="flex justify-between items-start gap-3">
                        <div>
                          <h4 className="font-heading font-bold text-base text-slate-900 dark:text-white">{meal.name}</h4>
                          <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{meal.description}</p>
                        </div>
                        <span className={`shrink-0 px-2 py-0.5 rounded-lg text-[10px] font-extrabold tracking-wide uppercase border ${
                          meal.price_range === 'Budget' ? 'bg-medical-green-light border-medical-green/10 text-medical-green' :
                          meal.price_range === 'Moderate' ? 'bg-medical-blue-light border-medical-blue/20 text-medical-blue' :
                          'bg-indigo-50 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-900/30 text-indigo-700 dark:text-indigo-400'
                        }`}>{meal.price_range}</span>
                      </div>

                      <div className="space-y-1">
                        <span className="block text-[9px] uppercase font-bold tracking-wider text-slate-400">Ingredients</span>
                        <div className="flex flex-wrap gap-1">
                          {(meal.local_ingredients ?? []).map((ing, i) => (
                            <span key={i} className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-semibold">{ing}</span>
                          ))}
                        </div>
                      </div>

                      <div className="p-3 bg-medical-green-light/50 border border-medical-green/10 rounded-xl">
                        <span className="block text-[8px] uppercase font-bold tracking-widest text-medical-green mb-0.5">Benefits</span>
                        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">{meal.benefits}</p>
                      </div>
                    </div>

                    <div className="px-5 py-3 bg-slate-50 dark:bg-slate-900/30 border-t border-border flex justify-between items-center text-xs font-semibold text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-medical-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        Safe for your profile
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-card border border-border p-10 rounded-2xl shadow-sm text-center">
                <p className="text-slate-500 font-semibold italic text-sm">No local meals match your restrictions. Consult the clinic nutritionist.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
