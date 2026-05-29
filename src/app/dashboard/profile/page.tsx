'use client';

import { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';

export default function ProfilePage() {
  const { profile, signOut, updateProfile, error } = useAuth();
  const [editing, setEditing] = useState(false);
  const [allergyInput, setAllergyInput] = useState('');
  const [allergies, setAllergies] = useState<string[]>([]);
  const [historyInput, setHistoryInput] = useState('');
  const [medicalHistory, setMedicalHistory] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const startEditing = () => {
    setAllergies(profile?.allergies ?? []);
    setMedicalHistory(profile?.medical_history ?? []);
    setEditing(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const success = await updateProfile({
      allergies,
      medical_history: medicalHistory,
    });
    setSaving(false);
    if (success) {
      setEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  if (!profile) return null;

  return (
    <div className="flex-1 flex flex-col">
      <header className="sticky top-0 z-20 w-full border-b border-border glass">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <h1 className="font-heading font-bold text-base text-slate-900 dark:text-white">Profile</h1>
          <button onClick={signOut} className="text-xs font-semibold text-emergency hover:underline">Sign Out</button>
        </div>
      </header>

      <div className="flex-1 w-full max-w-xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6 animate-slide-up">
        {saved && (
          <div className="p-3 rounded-xl bg-medical-green-light border border-medical-green/20 text-medical-green text-sm font-semibold flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            Profile updated successfully!
          </div>
        )}

        {error && (
          <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 text-red-700 dark:text-red-400 text-sm font-semibold">{error}</div>
        )}

        {/* Health ID Card */}
        <div className="relative w-full rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 text-white p-5 sm:p-6 shadow-2xl overflow-hidden border border-slate-700/50">
          <div className="absolute -top-10 -right-10 w-28 h-28 rounded-full border-[8px] border-medical-green/10" />
          <div className="flex justify-between items-start mb-5">
            <div>
              <span className="font-heading font-bold text-sm">Rapid<span className="text-medical-green">Aid</span></span>
              <span className="block text-[8px] tracking-wider text-slate-400 uppercase font-bold">Unilorin Student ID</span>
            </div>
            <span className="px-2 py-0.5 rounded bg-medical-green/20 text-medical-green text-[9px] font-extrabold tracking-wide uppercase border border-medical-green/30">Active</span>
          </div>
          <div className="space-y-3 mb-5">
            <div>
              <span className="block text-[9px] uppercase tracking-wider text-slate-400 font-bold">Student Name</span>
              <span className="font-heading font-bold text-base block">{profile.name}</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="block text-[9px] uppercase tracking-wider text-slate-400 font-bold">Health ID</span>
                <span className="font-mono text-xs font-semibold tracking-wider bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700 inline-block mt-0.5">{profile.student_health_id}</span>
              </div>
              <div>
                <span className="block text-[9px] uppercase tracking-wider text-slate-400 font-bold">Matric No</span>
                <span className="font-mono text-xs font-semibold text-slate-200 mt-0.5 block">{profile.matric_no}</span>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-700/50">
              <div>
                <span className="block text-[8px] uppercase tracking-wider text-slate-400 font-semibold">Blood</span>
                <span className="font-heading font-extrabold text-sm text-medical-green">{profile.blood_group}</span>
              </div>
              <div>
                <span className="block text-[8px] uppercase tracking-wider text-slate-400 font-semibold">Genotype</span>
                <span className="font-heading font-extrabold text-sm text-sky-300">{profile.genotype}</span>
              </div>
              <div className="col-span-2">
                <span className="block text-[8px] uppercase tracking-wider text-slate-400 font-semibold">Faculty</span>
                <span className="text-[10px] text-slate-300 font-semibold truncate block mt-0.5">{profile.faculty}</span>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-700/50">
              <span className="block text-[8px] uppercase tracking-wider text-slate-400 font-semibold">Department</span>
              <span className="text-[10px] text-slate-300 font-semibold block mt-0.5">{profile.department}</span>
            </div>
          </div>
          <div className="text-[8px] text-slate-400 border-t border-slate-700/30 pt-2.5 flex justify-between font-semibold">
            <span>SU Clinic Registry</span>
            <span>{profile.email}</span>
          </div>
        </div>

        {/* Editable Medical Info */}
        <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white">Medical Information</h3>
            {!editing ? (
              <button onClick={startEditing} className="text-xs font-semibold text-medical-blue hover:underline">Edit</button>
            ) : (
              <div className="flex gap-2">
                <button onClick={() => setEditing(false)} className="text-xs font-semibold text-slate-400 hover:underline">Cancel</button>
                <button onClick={handleSave} disabled={saving} className="text-xs font-bold text-medical-green hover:underline disabled:opacity-50">
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            )}
          </div>

          {!editing ? (
            <div className="space-y-3">
              <div>
                <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1.5">Allergies</span>
                {(profile.allergies ?? []).length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {profile.allergies.map((a, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg bg-orange-50 dark:bg-orange-950/20 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-900/30 text-xs font-semibold">{a}</span>
                    ))}
                  </div>
                ) : <span className="text-xs text-slate-400 italic font-semibold">None logged</span>}
              </div>
              <div>
                <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1.5">Medical History</span>
                {(profile.medical_history ?? []).length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {profile.medical_history.map((c, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg bg-medical-blue-light text-medical-blue border border-medical-blue/20 text-xs font-semibold">{c}</span>
                    ))}
                  </div>
                ) : <span className="text-xs text-slate-400 italic font-semibold">None logged</span>}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Allergies</label>
                <div className="flex gap-2 mb-2">
                  <input type="text" value={allergyInput} onChange={(e) => setAllergyInput(e.target.value)} placeholder="e.g. Peanuts"
                    className="flex-1 h-10 px-3 rounded-xl border border-border bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-medical-green text-slate-900 dark:text-white"
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); if (allergyInput.trim()) { setAllergies([...allergies, allergyInput.trim()]); setAllergyInput(''); } } }} />
                  <button type="button" onClick={() => { if (allergyInput.trim()) { setAllergies([...allergies, allergyInput.trim()]); setAllergyInput(''); } }}
                    className="h-10 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition">Add</button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {allergies.map((a, i) => (
                    <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-orange-50 text-orange-700 border border-orange-200 text-xs font-semibold">
                      {a}<button onClick={() => setAllergies(allergies.filter((_, idx) => idx !== i))} className="font-bold ml-0.5">×</button>
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Medical History</label>
                <div className="flex gap-2 mb-2">
                  <input type="text" value={historyInput} onChange={(e) => setHistoryInput(e.target.value)} placeholder="e.g. Ulcer"
                    className="flex-1 h-10 px-3 rounded-xl border border-border bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-medical-green text-slate-900 dark:text-white"
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); if (historyInput.trim()) { setMedicalHistory([...medicalHistory, historyInput.trim()]); setHistoryInput(''); } } }} />
                  <button type="button" onClick={() => { if (historyInput.trim()) { setMedicalHistory([...medicalHistory, historyInput.trim()]); setHistoryInput(''); } }}
                    className="h-10 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition">Add</button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {medicalHistory.map((c, i) => (
                    <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-medical-blue-light text-medical-blue border border-medical-blue/20 text-xs font-semibold">
                      {c}<button onClick={() => setMedicalHistory(medicalHistory.filter((_, idx) => idx !== i))} className="font-bold ml-0.5">×</button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
