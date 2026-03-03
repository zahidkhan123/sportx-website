'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SPORTS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type Sport = {
  id: string;
  name: string;
  emoji: string;
};

export default function CompleteProfileStep1Page() {
  const router = useRouter();
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = sessionStorage.getItem('completeProfileStep1');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setSelectedSports(parsed.favoriteSports || []);
        setFullName(parsed.fullName || '');
        setUsername(parsed.username || '');
      } catch {
        // ignore parse errors
      }
    }
  }, []);

  const shuffledSports: Sport[] = useMemo(() => {
    const arr = [...SPORTS] as Sport[];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, []);

  const toggleSport = (sportId: string) => {
    setSelectedSports((prev) =>
      prev.includes(sportId)
        ? prev.filter((id) => id !== sportId)
        : [...prev, sportId],
    );
    if (errors.favoriteSports) {
      setErrors((prev) => ({ ...prev, favoriteSports: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (selectedSports.length === 0) {
      newErrors.favoriteSports = 'Select at least one sport';
    }
    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }
    if (!username.trim()) {
      newErrors.username = 'Username is required';
    } else if (username.trim().length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validate()) {
      toast.error('Please fix the errors before continuing');
      return;
    }

    if (typeof window !== 'undefined') {
      sessionStorage.setItem(
        'completeProfileStep1',
        JSON.stringify({
          favoriteSports: selectedSports,
          fullName: fullName.trim(),
          username: username.trim(),
        }),
      );
    }

    router.push('/complete-profile/step2');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4">
      <Card className="glass-card w-full max-w-3xl border-white/10">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-white text-center">
            Welcome to <span className="text-[#00FFFF]">Sport</span>X
          </CardTitle>
          <CardDescription className="text-white/70 text-center">
            Let&apos;s personalize your sports world
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-white">
                Which sports get you excited?
              </h2>
              <p className="text-sm text-white/70">
                Pick one or more — we&apos;ll tailor SportX around this.
              </p>
              {errors.favoriteSports && (
                <p className="text-sm text-red-500">{errors.favoriteSports}</p>
              )}
              <div className="grid max-h-80 grid-cols-2 gap-3 overflow-y-auto pr-1">
                {shuffledSports.map((sport) => {
                  const isSelected = selectedSports.includes(sport.id);
                  return (
                    <button
                      key={sport.id}
                      type="button"
                      onClick={() => toggleSport(sport.id)}
                      className={cn(
                        'relative flex items-center justify-between gap-2 rounded-xl border-2 p-3 text-left transition-all duration-200 hover:scale-[1.02]',
                        isSelected
                          ? 'bg-[#0b1f33] border-[#00FFFF] shadow-lg shadow-[#00FFFF]/40'
                          : 'bg-white/5 border-white/10 hover:border-white/20',
                      )}
                    >
                      <span className="text-xl">{(sport as any).emoji}</span>
                      <span
                        className={cn(
                          'flex-1 text-sm font-semibold',
                          isSelected ? 'text-white' : 'text-white/70',
                        )}
                      >
                        {(sport as any).name}
                      </span>
                      {isSelected && (
                        <span className="text-xs font-bold text-[#00FFFF]">
                          ✓
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-white">Basic profile</h2>
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-white">
                  Your full name
                </Label>
                <Input
                  id="fullName"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (errors.fullName)
                      setErrors((prev) => ({ ...prev, fullName: '' }));
                  }}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
                />
                {errors.fullName && (
                  <p className="text-sm text-red-500">{errors.fullName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="username" className="text-white">
                  What should we call you?
                </Label>
                <Input
                  id="username"
                  placeholder="Enter your display name"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (errors.username)
                      setErrors((prev) => ({ ...prev, username: '' }));
                  }}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
                />
                {errors.username && (
                  <p className="text-sm text-red-500">{errors.username}</p>
                )}
                <p className="text-xs text-white/50">
                  Your SportX identity — friendly names work great!
                </p>
              </div>

              <Button
                onClick={handleNext}
                disabled={loadingOrInvalid(selectedSports, fullName, username)}
                className="mt-4 w-full bg-[#00FFFF] text-black hover:bg-[#00FFFF]/90 disabled:opacity-50"
              >
                Next: Make it personal
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function loadingOrInvalid(
  sports: string[],
  fullName: string,
  username: string,
): boolean {
  const isValid =
    sports.length > 0 &&
    fullName.trim().length >= 2 &&
    username.trim().length >= 3;
  return !isValid;
}

