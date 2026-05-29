'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import Sidebar from '../../components/Sidebar';
import SOSButton from '../../components/SOSButton';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-dvh">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-medical-green border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-semibold text-slate-400">Loading portal...</span>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex-1 flex min-h-dvh">
      <Sidebar />

      {/* Main content area — offset by sidebar width on desktop */}
      <main className="flex-1 flex flex-col lg:ml-60 pb-20 lg:pb-0">
        {children}
      </main>

      <SOSButton />
    </div>
  );
}
