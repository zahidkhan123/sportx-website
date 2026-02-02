'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SPORTS } from '@/lib/constants';
import { cn } from '@/lib/utils';

export default function InterestsPage() {
  const router = useRouter();
  const [selectedSports, setSelectedSports] = useState<string[]>([]);

  const toggleSport = (sportId: string) => {
    setSelectedSports(prev =>
      prev.includes(sportId)
        ? prev.filter(id => id !== sportId)
        : [...prev, sportId],
    );
  };

  const handleContinue = () => {
    if (selectedSports.length === 0) return;
    
    // Store selected interests in sessionStorage
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('selectedInterests', JSON.stringify(selectedSports));
    }
    
    router.push('/signup/step1');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4">
      <Card className="glass-card w-full max-w-4xl border-white/10">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#00FFA3] flex items-center justify-center">
                <span className="text-black text-sm font-bold">✓</span>
              </div>
              <span className="text-sm text-[#00FFA3] font-semibold">Location</span>
            </div>
            <div className="flex-1 h-0.5 bg-white/10"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#00FFFF] flex items-center justify-center">
                <span className="text-black text-sm font-bold">2</span>
              </div>
              <span className="text-sm text-[#00FFFF] font-semibold">Interests</span>
            </div>
            <div className="flex-1 h-0.5 bg-white/10"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <span className="text-white text-sm font-bold">3</span>
              </div>
              <span className="text-sm text-white/50 font-semibold">Sign Up</span>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-white text-center">
            What sports interest you?
          </CardTitle>
          <CardDescription className="text-white/70 text-center">
            Select your favorite sports to personalize your experience
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
            {SPORTS.map((sport) => {
              const isSelected = selectedSports.includes(sport.id);
              return (
                <button
                  key={sport.id}
                  onClick={() => toggleSport(sport.id)}
                  className={cn(
                    "relative p-4 rounded-2xl border-2 transition-all duration-200 hover:scale-105",
                    isSelected
                      ? "bg-[#0b1f33] border-[#00FFFF] shadow-lg shadow-[#00FFFF]/40"
                      : "bg-[#1a1e23] border-[#2e3540] hover:border-white/20"
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-2xl">{sport.emoji}</span>
                    <span className={cn(
                      "text-sm font-semibold flex-1 text-left",
                      isSelected ? "text-white" : "text-[#cfd6de]"
                    )}>
                      {sport.name}
                    </span>
                    {isSelected && (
                      <svg
                        className="w-5 h-5 text-[#00FFFF]"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
          
          <Button
            onClick={handleContinue}
            disabled={selectedSports.length === 0}
            className="w-full bg-[#00FFFF] text-black hover:bg-[#00FFFF]/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue
          </Button>

          <div className="mt-4 text-center text-sm text-white/70">
            Already have an account?{' '}
            <Link href="/login" className="text-[#00FFFF] hover:underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

