'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../hooks/useAuth';
import type { Profile } from '../../lib/database.types';

export default function Register() {
  const router = useRouter();
  const { signUp, error: authError, clearError } = useAuth();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [registeredProfile, setRegisteredProfile] = useState<Profile | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [matricNo, setMatricNo] = useState('');
  const [faculty, setFaculty] = useState('');
  const [department, setDepartment] = useState('');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [genotype, setGenotype] = useState('AA');
  const [allergyInput, setAllergyInput] = useState('');
  const [allergies, setAllergies] = useState<string[]>([]);
  const [historyInput, setHistoryInput] = useState('');
  const [medicalHistory, setMedicalHistory] = useState<string[]>([]);

  const addAllergy = () => {
    if (allergyInput.trim() && !allergies.includes(allergyInput.trim())) {
      setAllergies([...allergies, allergyInput.trim()]);
      setAllergyInput('');
    }
  };

  const removeAllergy = (index: number) => setAllergies(allergies.filter((_, i) => i !== index));

  const addHistory = () => {
    if (historyInput.trim() && !medicalHistory.includes(historyInput.trim())) {
      setMedicalHistory([...medicalHistory, historyInput.trim()]);
      setHistoryInput('');
    }
  };

  const removeHistory = (index: number) => setMedicalHistory(medicalHistory.filter((_, i) => i !== index));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    clearError();

    if (step < 3) {
      setStep(step + 1);
      return;
    }

    if (password.length < 6) {
      setFormError('Password must be at least 6 characters long.');
      setStep(2);
      return;
    }

    setLoading(true);
    const profile = await signUp({
      name,
      email,
      password,
      matric_no: matricNo,
      faculty,
      department,
      blood_group: bloodGroup,
      genotype,
      allergies,
      medical_history: medicalHistory,
    });

    setLoading(false);

    if (profile) {
      setRegisteredProfile(profile);
      setStep(4);
    } else {
      setFormError(authError ?? 'Registration failed. Please try again.');
    }
  };

  const inputClass =
    'w-full h-11 px-4 rounded-xl border border-border bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-medical-green text-sm text-slate-900 dark:text-white placeholder:text-slate-400';

  return (
    <div className="flex-1 flex flex-col items-center justify-center py-10 sm:py-14 px-4 sm:px-6">
      {/* Header */}
      <div className="w-full max-w-xl mb-8 flex flex-col items-center">
        <Link href="/" className="flex items-center gap-2 mb-4">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-medical-green-light">
            <svg className="w-5 h-5 text-medical-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m-8-8h16" />
            </svg>
          </div>
          <span className="font-heading font-bold text-lg text-slate-900 dark:text-white">
            Rapid<span className="text-medical-green">Aid</span>
          </span>
        </Link>

        {step < 4 && (
          <div className="w-full flex items-center justify-between text-xs font-semibold text-slate-400 mt-2 px-1">
            <span className={step >= 1 ? 'text-medical-green font-bold' : ''}>1. Academic</span>
            <div className={`flex-1 h-0.5 mx-3 rounded ${step >= 2 ? 'bg-medical-green' : 'bg-border'}`} />
            <span className={step >= 2 ? 'text-medical-green font-bold' : ''}>2. Credentials</span>
            <div className={`flex-1 h-0.5 mx-3 rounded ${step >= 3 ? 'bg-medical-green' : 'bg-border'}`} />
            <span className={step >= 3 ? 'text-medical-green font-bold' : ''}>3. Vitals</span>
          </div>
        )}
      </div>

      {/* Form Container */}
      <div className="w-full max-w-xl">
        {step < 4 ? (
          <form onSubmit={handleSubmit} className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
            <div className="mb-2">
              <h2 className="font-heading font-bold text-xl sm:text-2xl text-slate-900 dark:text-white">
                {step === 1 && 'Academic Information'}
                {step === 2 && 'Account Credentials'}
                {step === 3 && 'Vitals & Medical Details'}
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                {step === 1 && 'Help us link your health profile with your university enrollment.'}
                {step === 2 && 'Set up credentials to secure your medical data and appointments.'}
                {step === 3 && 'Critical information for our clinic staff during emergency situations.'}
              </p>
            </div>

            {(formError || authError) && (
              <div className="p-3 rounded-xl bg-emergency-light border border-emergency/20 text-emergency text-sm font-semibold">
                {formError || authError}
              </div>
            )}

            {/* Step 1 */}
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Full Name</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Ade Ranju" className={inputClass} required />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Matriculation Number</label>
                  <input type="text" value={matricNo} onChange={(e) => setMatricNo(e.target.value)} placeholder="e.g. 19/52HA001" className={inputClass} required />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Faculty</label>
                  <input type="text" value={faculty} onChange={(e) => setFaculty(e.target.value)} placeholder="e.g. Faculty of Communication & Information Sciences" className={inputClass} required />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Department</label>
                  <input type="text" value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="e.g. Computer Science" className={inputClass} required />
                </div>
              </div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Institutional Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="student@unilorin.edu.ng" className={inputClass} required />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Password</label>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className={inputClass} required />
                  <p className="text-[10px] text-slate-400 mt-1 font-semibold">Must be at least 6 characters. This + your generated Health ID will be your login.</p>
                </div>
              </div>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Blood Group</label>
                    <select value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)} className={inputClass}>
                      <option>A+</option><option>A-</option><option>B+</option><option>B-</option>
                      <option>AB+</option><option>AB-</option><option>O+</option><option>O-</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Genotype</label>
                    <select value={genotype} onChange={(e) => setGenotype(e.target.value)} className={inputClass}>
                      <option>AA</option><option>AS</option><option>SS</option><option>AC</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Allergies (If any)</label>
                  <div className="flex gap-2 mb-2">
                    <input type="text" value={allergyInput} onChange={(e) => setAllergyInput(e.target.value)} placeholder="e.g. Peanuts, Penicillin" className={`flex-1 ${inputClass}`}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addAllergy(); } }} />
                    <button type="button" onClick={addAllergy} className="h-11 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-sm font-semibold transition">Add</button>
                  </div>
                  {allergies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {allergies.map((a, i) => (
                        <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-orange-50 text-orange-700 border border-orange-200 text-xs font-semibold">
                          {a}<button type="button" onClick={() => removeAllergy(i)} className="text-orange-900 font-extrabold ml-0.5">×</button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Critical History (Ulcer, Asthma, etc.)</label>
                  <div className="flex gap-2 mb-2">
                    <input type="text" value={historyInput} onChange={(e) => setHistoryInput(e.target.value)} placeholder="e.g. Ulcer, Asthma" className={`flex-1 ${inputClass}`}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addHistory(); } }} />
                    <button type="button" onClick={addHistory} className="h-11 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-sm font-semibold transition">Add</button>
                  </div>
                  {medicalHistory.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {medicalHistory.map((cond, i) => (
                        <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-medical-blue-light text-medical-blue border border-medical-blue/20 text-xs font-semibold">
                          {cond}<button type="button" onClick={() => removeHistory(i)} className="text-medical-blue font-extrabold ml-0.5">×</button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Nav Buttons */}
            <div className="pt-4 flex items-center justify-between border-t border-border mt-4">
              {step > 1 ? (
                <button type="button" onClick={() => setStep(step - 1)} className="h-11 px-5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-semibold transition touch-target">
                  Back
                </button>
              ) : (
                <Link href="/" className="inline-flex items-center justify-center h-11 px-5 rounded-xl border border-border hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm font-semibold transition touch-target whitespace-nowrap">
                  Cancel
                </Link>
              )}
              <button type="submit" disabled={loading} className="h-11 px-6 rounded-xl bg-medical-green hover:bg-medical-green-hover text-white text-sm font-bold tracking-wide transition flex items-center justify-center gap-2 shadow-primary disabled:opacity-50 touch-target">
                {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : step === 3 ? 'Generate Health ID' : 'Continue'}
              </button>
            </div>
          </form>
        ) : (
          /* ─── Success: Digital Health ID Card ─── */
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col items-center space-y-7 animate-slide-up">
            <div className="text-center">
              <div className="w-14 h-14 bg-medical-green-light text-medical-green rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-slate-900 dark:text-white">Account Generated!</h2>
              <p className="text-sm text-slate-500 mt-1.5">Your student medical profile is now live on SU Clinic&apos;s system.</p>
            </div>

            {/* Important Login Info */}
            <div className="w-full max-w-sm p-4 rounded-2xl bg-medical-green-light border border-medical-green/20 text-center space-y-1">
              <span className="block text-[10px] uppercase font-bold tracking-wider text-medical-green">Your Login Credentials</span>
              <span className="font-mono font-bold text-lg text-slate-900 dark:text-white block">{registeredProfile?.student_health_id}</span>
              <span className="block text-xs text-slate-500 font-semibold">Use this Health ID + your password to sign in.</span>
            </div>

            {/* Health ID Card */}
            <div className="relative w-full max-w-sm rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 text-white p-5 sm:p-6 shadow-2xl overflow-hidden border border-slate-700/50">
              <div className="absolute -top-10 -right-10 w-28 h-28 rounded-full border-[8px] border-medical-green/10" />
              <div className="flex justify-between items-start mb-5">
                <div>
                  <span className="font-heading font-bold text-sm tracking-tight">Rapid<span className="text-medical-green">Aid</span></span>
                  <span className="block text-[8px] tracking-wider text-slate-400 uppercase font-bold">Unilorin Student ID</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-medical-green/20 text-medical-green text-[9px] font-extrabold tracking-wide uppercase border border-medical-green/30">Active</span>
              </div>
              <div className="space-y-3 mb-5">
                <div>
                  <span className="block text-[9px] uppercase tracking-wider text-slate-400 font-bold">Student Name</span>
                  <span className="font-heading font-bold text-base leading-tight block">{registeredProfile?.name}</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="block text-[9px] uppercase tracking-wider text-slate-400 font-bold">Health ID</span>
                    <span className="font-mono text-xs font-semibold tracking-wider text-white bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700 inline-block mt-0.5">{registeredProfile?.student_health_id}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] uppercase tracking-wider text-slate-400 font-bold">Matric No</span>
                    <span className="font-mono text-xs font-semibold text-slate-200 mt-0.5 block">{registeredProfile?.matric_no}</span>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-700/50">
                  <div>
                    <span className="block text-[8px] uppercase tracking-wider text-slate-400 font-semibold">Blood</span>
                    <span className="font-heading font-extrabold text-sm text-medical-green">{registeredProfile?.blood_group}</span>
                  </div>
                  <div>
                    <span className="block text-[8px] uppercase tracking-wider text-slate-400 font-semibold">Genotype</span>
                    <span className="font-heading font-extrabold text-sm text-sky-300">{registeredProfile?.genotype}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="block text-[8px] uppercase tracking-wider text-slate-400 font-semibold">Allergies</span>
                    <span className="text-[10px] text-slate-300 font-semibold truncate block mt-0.5">
                      {registeredProfile?.allergies && registeredProfile.allergies.length > 0 ? registeredProfile.allergies.join(', ') : 'None'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-[8px] text-slate-400 border-t border-slate-700/30 pt-2.5 flex justify-between font-semibold">
                <span>SU Clinic Registry</span>
                <span>Exp: Grad. Year</span>
              </div>
            </div>

            {/* Actions */}
            <div className="w-full max-w-sm pt-2">
              <Link href="/dashboard" className="inline-flex items-center justify-center w-full h-11 rounded-xl bg-medical-green hover:bg-medical-green-hover text-white text-sm font-bold transition text-center touch-target shadow-primary gap-2">
                Enter Portal
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
