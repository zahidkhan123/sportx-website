'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { authAPI } from '@/lib/api';
import { authService } from '@/lib/auth';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';

export default function VerifyOTPForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const type = searchParams.get('type') || 'register'; // 'register' or 'reset'
  const [otp, setOtp] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const getNextRouteAfterLogin = (user: any | null | undefined) => {
    if (!user) return '/home';

    if (user.isProfileCompleted) {
      return '/home';
    }

    const hasBasic =
      !!user.fullName && Array.isArray(user.favoriteSports) && user.favoriteSports.length > 0;
    const hasDetails = !!user.gender && !!user.dob && !!user.phone;
    const hasLocation = !!user.country && !!user.state && !!user.city;

    if (!hasBasic) return '/complete-profile/step1';
    if (!hasDetails) return '/complete-profile/step2';
    if (!hasLocation) return '/complete-profile/step3';

    return '/home';
  };

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleOtpChange = (index: number, value: string) => {
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join('');

    if (otpString.length !== 4) {
      toast.error('Please enter the complete 4-digit code');
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.verifyOTP(email, otpString, {
        passwordReset: type === 'reset',
      });
      if (response.success) {
        if (type === 'reset') {
          router.push(`/reset-password?email=${encodeURIComponent(email)}&otp=${otpString}`);
        } else {
          // For registration flow: ensure we have a fresh auth token before profile completion
          try {
            if (typeof window !== 'undefined') {
              const stored = sessionStorage.getItem('signupCredentials');
              if (stored) {
                const creds = JSON.parse(stored) as { email: string; password: string };
                if (creds.email && creds.password) {
                  const loginData = await authService.login(creds.email, creds.password);
                  const user = (loginData as any)?.user;
                  const next = getNextRouteAfterLogin(user);
                  toast.success("Account verified! Let's complete your profile.");
                  router.push(next);
                  return;
                }
              }
            }
          } catch (loginError: any) {
            // If login fails, let the user know but still send them to profile completion
            toast.error(loginError?.message || 'Logged out. Please sign in again after completing your profile.');
          }

          toast.success("Account verified! Let's complete your profile.");
          router.push('/complete-profile/step1');
        }
      } else {
        toast.error(response.message || 'Invalid OTP');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Invalid OTP';
      toast.error(errorMessage);
      if (error.response?.status === 400 && type === 'register') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;

    setResendLoading(true);
    try {
      if (type === 'reset') {
        const response = await authAPI.forgotPassword(email);
        if (response.success) {
          toast.success('OTP resent successfully!');
          setCountdown(60);
        } else {
          toast.error(response.message || 'Failed to resend OTP');
        }
      } else {
        const response = await authAPI.resendOTP(email);
        if (response.success) {
          toast.success('OTP resent successfully!');
          setCountdown(60);
        } else {
          toast.error(response.message || 'Failed to resend OTP');
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4">
      <Card className="glass-card w-full max-w-md border-white/10">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="text-white/70 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <CardTitle className="text-2xl font-bold text-white flex-1">
              Verify OTP
            </CardTitle>
          </div>
          <CardDescription className="text-white/70">
            We've sent a 4-digit code to{' '}
            <span className="text-[#00FFFF] font-medium">{email}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleVerify} className="space-y-6">
            <div className="space-y-2">
              <Label className="text-white text-center block">Enter verification code</Label>
              <div className="flex gap-3 justify-center">
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-14 h-14 text-center text-2xl font-bold bg-white/5 border-white/10 text-white focus:border-[#00FFFF]"
                  />
                ))}
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading || otp.join('').length !== 4}
              className="w-full bg-[#00FFFF] text-black hover:bg-[#00FFFF]/90"
            >
              {loading ? 'Verifying...' : 'Verify Code'}
            </Button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-white/70">
              Didn't receive the code?
            </p>
            <Button
              type="button"
              variant="ghost"
              onClick={handleResend}
              disabled={countdown > 0 || resendLoading}
              className="text-[#00FFFF] hover:text-[#00FFFF]/80"
            >
              {resendLoading
                ? 'Sending...'
                : countdown > 0
                ? `Resend in ${countdown}s`
                : 'Resend Code'}
            </Button>
          </div>

          <div className="mt-4 text-center text-sm text-white/70">
            <Link href="/login" className="text-[#00FFFF] hover:underline">
              Back to Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

