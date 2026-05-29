'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { useAppointments } from '../../../hooks/useAppointments';

export default function AppointmentsPage() {
  const { profile } = useAuth();
  const { appointments, activeAppointment, bookAppointment, cancelAppointment } = useAppointments(profile?.id);

  const departments = ['General Outpatient', 'Dental Clinic', 'Nursing Unit', 'Pharmacy', 'Laboratory'];
  const [department, setDepartment] = useState('General Outpatient');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setDate(new Date().toISOString().split('T')[0]);
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const deptParam = params.get('dept');
      if (deptParam && departments.includes(deptParam)) {
        setDepartment(deptParam);
      }
    }
  }, []);

  const timeSlots = ['08:30 AM', '09:15 AM', '10:00 AM', '10:45 AM', '11:30 AM', '01:00 PM', '01:45 PM', '02:30 PM', '03:15 PM'];

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!department || !date || !time) return;
    setLoading(true);
    const booked = await bookAppointment(department, date, time);
    setLoading(false);
    if (booked) {
      setSuccess(true);
      setTime('');
      setTimeout(() => setSuccess(false), 5000);
    }
  };

  if (!profile) return null;

  return (
    <div className="flex-1 flex flex-col">
      <header className="sticky top-0 z-20 w-full border-b border-border glass">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center">
          <h1 className="font-heading font-bold text-base text-slate-900 dark:text-white">Appointments</h1>
        </div>
      </header>

      <div className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-8 animate-slide-up">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-3">
            {success && (
              <div className="mb-4 p-3 rounded-xl bg-medical-green-light border border-medical-green/20 text-medical-green text-sm font-semibold flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                Appointment booked successfully!
              </div>
            )}

            <form onSubmit={handleBook} className="bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-sm space-y-5">
              <div>
                <h2 className="font-heading font-bold text-lg text-slate-900 dark:text-white">Book a Clinic Slot</h2>
                <p className="text-sm text-slate-500 mt-0.5">Select a department and time slot.</p>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Department</label>
                <div className="grid grid-cols-1 gap-2">
                  {departments.map((dept) => (
                    <button key={dept} type="button" onClick={() => setDepartment(dept)}
                      className={`h-11 px-4 rounded-xl border text-left text-sm font-semibold transition flex items-center justify-between touch-target ${
                        department === dept ? 'border-medical-blue bg-medical-blue-light text-medical-blue' : 'border-border bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}>
                      <span>{dept}</span>
                      {department === dept && <svg className="w-5 h-5 text-medical-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Date</label>
                <input type="date" value={date} min={new Date().toISOString().split('T')[0]} onChange={(e) => setDate(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-border bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-medical-blue text-sm text-slate-900 dark:text-white" required />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Time Slots</label>
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map((slot) => (
                    <button key={slot} type="button" onClick={() => setTime(slot)}
                      className={`h-11 rounded-xl border text-xs font-bold transition text-center touch-target ${
                        time === slot ? 'border-medical-blue bg-medical-blue text-white shadow-sm' : 'border-border bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}>{slot}</button>
                  ))}
                </div>
              </div>

              <button type="submit" disabled={loading || !time}
                className="w-full h-12 rounded-xl bg-medical-blue hover:bg-medical-blue-hover text-white text-sm font-bold tracking-wide transition flex items-center justify-center gap-2 shadow-md disabled:opacity-50 touch-target">
                {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Schedule and Join Queue'}
              </button>
            </form>
          </div>

          {/* Appointment History */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white">Your Appointments</h3>
            {appointments.length === 0 ? (
              <div className="bg-card border border-border rounded-2xl p-6 text-center">
                <p className="text-sm text-slate-400 font-semibold italic">No appointments yet. Book your first slot!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {appointments.map((appt) => (
                  <div key={appt.id} className={`bg-card border rounded-2xl p-4 shadow-sm ${appt.status === 'scheduled' ? 'border-medical-blue/30' : 'border-border'}`}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-heading font-bold text-sm text-slate-900 dark:text-white">{appt.department}</h4>
                        <p className="text-xs text-slate-500 font-mono mt-0.5">{appt.date} · {appt.time}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        appt.status === 'scheduled' ? 'bg-medical-blue-light text-medical-blue' :
                        appt.status === 'completed' ? 'bg-medical-green-light text-medical-green' :
                        'bg-slate-100 dark:bg-slate-800 text-slate-500'
                      }`}>{appt.status}</span>
                    </div>
                    {appt.status === 'scheduled' && (
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                        <span className="text-xs font-bold text-slate-500">Queue: <span className="text-medical-blue text-base font-heading">#{appt.queue_position}</span></span>
                        <button onClick={() => cancelAppointment(appt.id)} className="text-xs font-semibold text-emergency hover:underline">Cancel</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
