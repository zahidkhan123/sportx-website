'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GENDERS } from '@/lib/constants';
import { toast } from 'sonner';

export default function CompleteProfileStep2Page() {
  const router = useRouter();
  const [gender, setGender] = useState('');
  const [dob, setDob] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const step1 = sessionStorage.getItem('completeProfileStep1');
    if (!step1) {
      router.push('/complete-profile/step1');
      return;
    }
    const stored = sessionStorage.getItem('completeProfileStep2');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setGender(parsed.gender || '');
        setDob(parsed.dob || '');
        setPhone(parsed.phone || '');
        setWhatsapp(parsed.whatsapp || '');
        setProfileImage(parsed.profileImage || '');
      } catch {
        // ignore parse errors
      }
    }
  }, [router]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!gender) {
      newErrors.gender = 'Gender is required';
    }
    if (!dob) {
      newErrors.dob = 'Date of birth is required';
    }
    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (phone.trim().length < 10) {
      newErrors.phone = 'Phone number must be at least 10 characters';
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
        'completeProfileStep2',
        JSON.stringify({
          gender,
          dob,
          phone: phone.trim(),
          whatsapp: whatsapp.trim() || undefined,
          profileImage: profileImage.trim() || undefined,
        }),
      );
    }

    router.push('/complete-profile/step3');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4">
      <Card className="glass-card w-full max-w-2xl border-white/10">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-white text-center">
            Let&apos;s add a personal touch
          </CardTitle>
          <CardDescription className="text-white/70 text-center">
            Basic details to help people know you
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-white">Gender</Label>
              <Select
                value={gender}
                onValueChange={(value) => {
                  setGender(value);
                  if (errors.gender) setErrors((prev) => ({ ...prev, gender: '' }));
                }}
              >
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent className="bg-black border-white/10">
                  {GENDERS.map((g) => (
                    <SelectItem key={g} value={g} className="text-white">
                      {g}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.gender && (
                <p className="text-sm text-red-500">{errors.gender}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dob" className="text-white">
                Date of birth
              </Label>
              <Input
                id="dob"
                type="date"
                value={dob}
                onChange={(e) => {
                  setDob(e.target.value);
                  if (errors.dob) setErrors((prev) => ({ ...prev, dob: '' }));
                }}
                className="bg-white/5 border-white/10 text-white"
              />
              {errors.dob && <p className="text-sm text-red-500">{errors.dob}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-white">
                Your contact number
              </Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
                }}
                placeholder="Enter your phone number"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
              />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsapp" className="text-white">
                WhatsApp number (optional)
              </Label>
              <Input
                id="whatsapp"
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="Enter WhatsApp number"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="profileImage" className="text-white">
                Profile photo URL (optional)
              </Label>
              <Input
                id="profileImage"
                type="url"
                value={profileImage}
                onChange={(e) => setProfileImage(e.target.value)}
                placeholder="https://..."
                className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
              />
              <p className="text-xs text-white/50">
                Paste a link to your profile picture. (Upload support can be added later.)
              </p>
            </div>

            <Button
              onClick={handleNext}
              className="mt-2 w-full bg-[#00FFFF] text-black hover:bg-[#00FFFF]/90"
            >
              Next: Where you play
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

