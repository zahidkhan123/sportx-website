'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { SPORTS } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface InterestsStepProps {
  onComplete: (interests: string[]) => void;
}

export function InterestsStep({ onComplete }: InterestsStepProps) {
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
    onComplete(selectedSports);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-96 overflow-y-auto p-2">
        {SPORTS.map((sport) => {
          const isSelected = selectedSports.includes(sport.id);
          return (
            <button
              key={sport.id}
              type="button"
              onClick={() => toggleSport(sport.id)}
              className={cn(
                "relative p-3 rounded-xl border-2 transition-all duration-200 hover:scale-105",
                isSelected
                  ? "bg-[#0b1f33] border-[#00FFFF] shadow-lg shadow-[#00FFFF]/40"
                  : "bg-white/5 border-white/10 hover:border-white/20"
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xl">{sport.emoji}</span>
                <span className={cn(
                  "text-xs font-semibold flex-1 text-left",
                  isSelected ? "text-white" : "text-white/70"
                )}>
                  {sport.name}
                </span>
                {isSelected && (
                  <svg
                    className="w-4 h-4 text-[#00FFFF] flex-shrink-0"
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
    </div>
  );
}

