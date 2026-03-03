'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SocialLoginButtons } from '@/components/SocialLoginButtons';
import { authService } from '@/lib/auth';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const getNextRouteAfterLogin = (user: any | null | undefined) => {
    if (!user) return '/home';

    // If profile is already completed, go home
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await authService.login(email, password);
      const user = (data as any)?.user;
      const next = getNextRouteAfterLogin(user);
      toast.success('Login successful!');
      router.push(next);
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4">
      <Card className="glass-card w-full max-w-md border-white/10">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-white">
            Welcome back to <span className="text-[#00FFFF]">Sport</span>X
          </CardTitle>
          <CardDescription className="text-white/70">
            Sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-white">Password</Label>
                <Link href="/forgot-password" className="text-sm text-[#00FFFF] hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#00FFFF] text-black hover:bg-[#00FFFF]/90"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>

            {/* <SocialLoginButtons
              onSuccess={() => {
                router.push('/home');
              }}
            /> */}
          </form>
          <div className="mt-4 text-center text-sm text-white/70">
            Don't have an account?{' '}
            <Link href="/signup" className="text-[#00FFFF] hover:underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

