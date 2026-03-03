'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authService } from '@/lib/auth';
import { toast } from 'sonner';

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        router.push('/home');
      }
    }
  }, [router]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password || formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!acceptedTerms) {
      newErrors.acceptedTerms = 'You must accept the terms to continue';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setLoading(true);
    try {
      await authService.signup({
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      // Store credentials temporarily for post-OTP login (to ensure token for profile completion)
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(
          'signupCredentials',
          JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        );
      }

      toast.success('Account created! Please verify your email with the OTP code.');
      router.push(
        `/verify-otp?email=${encodeURIComponent(formData.email)}&type=register`,
      );
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4">
      <Card className="glass-card w-full max-w-md border-white/10">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-white text-center">
            Create your <span className="text-[#00FFFF]">Sport</span>X Account
          </CardTitle>
          <CardDescription className="text-white/70 text-center">
            Sign up with email and password. You&apos;ll complete your profile after verifying OTP.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  if (errors.email) setErrors({ ...errors, email: '' });
                }}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    if (errors.password)
                      setErrors({ ...errors, password: '' });
                  }}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/50 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white text-xs"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-white">
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    });
                    if (errors.confirmPassword)
                      setErrors({ ...errors, confirmPassword: '' });
                  }}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/50 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white text-xs"
                >
                  {showConfirmPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <div className="flex items-start gap-2 text-sm">
              <button
                type="button"
                onClick={() => {
                  setAcceptedTerms(!acceptedTerms);
                  if (errors.acceptedTerms)
                    setErrors({ ...errors, acceptedTerms: '' });
                }}
                className="mt-1 h-4 w-4 rounded border border-[#00FFFF] flex items-center justify-center bg-white"
              >
                {acceptedTerms && (
                  <span className="text-[10px] font-bold text-black">✓</span>
                )}
              </button>
              <p className="text-white/80">
                I agree to the{' '}
                <Link
                  href="/terms"
                  className="text-[#00FFFF] hover:underline"
                >
                  Terms &amp; Conditions
                </Link>
                .
              </p>
            </div>
            {errors.acceptedTerms && (
              <p className="text-sm text-red-500">{errors.acceptedTerms}</p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#00FFFF] text-black hover:bg-[#00FFFF]/90"
            >
              {loading ? 'Signing up...' : 'Sign Up'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-white/70">
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
