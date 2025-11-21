'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { authService } from '@/lib/auth';
import { CITIES, GENDERS } from '@/lib/constants';
import { toast } from 'sonner';
import Script from 'next/script';

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTab?: 'login' | 'signup';
  onSuccess?: () => void;
}

function AuthModalContent({
  open,
  onOpenChange,
  defaultTab = 'login',
  onSuccess,
}: AuthModalProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>(defaultTab);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: '',
    city: '',
    gender: '',
  });
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setActiveTab(defaultTab);
    }
  }, [open, defaultTab]);

  // Google Login
  const handleGoogleLogin = useCallback(() => {
    setSocialLoading('google');
    // @ts-ignore - google is loaded via script
    if (typeof window !== 'undefined' && window.google) {
      // @ts-ignore
      window.google.accounts.oauth2.initTokenClient({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
        scope: 'openid profile email',
        callback: async (response: any) => {
          try {
            // Get user info to extract ID token
            const userInfoResponse = await fetch(
              'https://www.googleapis.com/oauth2/v3/userinfo',
              {
                headers: {
                  Authorization: `Bearer ${response.access_token}`,
                },
              }
            );
            const userInfo = await userInfoResponse.json();
            
            // Send the access token - backend will verify it
            await authService.googleLogin(response.access_token, true);
            toast.success('Google login successful!');
            onOpenChange(false);
            if (onSuccess) {
              onSuccess();
            } else {
              router.refresh();
            }
          } catch (error: any) {
            toast.error(error.message || 'Google login failed');
          } finally {
            setSocialLoading(null);
          }
        },
      }).requestAccessToken();
    } else {
      toast.error('Google SDK not loaded');
      setSocialLoading(null);
    }
  }, [onSuccess, onOpenChange, router]);

  // Facebook Login
  const handleFacebookLogin = useCallback(() => {
    setSocialLoading('facebook');
    
    // Wait for SDK to be ready with retry mechanism
    const tryFacebookLogin = (retries = 5) => {
      // @ts-ignore - FB is loaded via script
      const FB = typeof window !== 'undefined' ? (window as any).FB : null;
      
      if (FB && typeof FB.login === 'function') {
        // Check if FB is initialized by calling getLoginStatus
        FB.getLoginStatus((response: any) => {
          // SDK is ready, now try to login
          try {
            FB.login(
              async (loginResponse: any) => {
                if (loginResponse.authResponse) {
                  try {
                    await authService.facebookLogin(loginResponse.authResponse.accessToken);
                    toast.success('Facebook login successful!');
                    onOpenChange(false);
                    if (onSuccess) {
                      onSuccess();
                    } else {
                      router.refresh();
                    }
                  } catch (error: any) {
                    console.error('Facebook login API error:', error);
                    toast.error(error.message || 'Facebook login failed');
                  } finally {
                    setSocialLoading(null);
                  }
                } else {
                  if (loginResponse.status !== 'unknown') {
                    toast.error('Facebook login cancelled');
                  }
                  setSocialLoading(null);
                }
              },
              { scope: 'email,public_profile' }
            );
          } catch (error: any) {
            console.error('Facebook login error:', error);
            console.error('Error details:', {
              message: error.message,
              name: error.name,
              stack: error.stack,
            });
            toast.error('Failed to initialize Facebook login. Please check browser console for details.');
            setSocialLoading(null);
          }
        }, true); // Force roundtrip to check status
      } else if (retries > 0) {
        // Retry after a short delay
        setTimeout(() => tryFacebookLogin(retries - 1), 300);
      } else {
        console.error('Facebook SDK not available:', {
          FB: !!FB,
          FBLogin: FB && typeof FB.login,
          windowFB: typeof window !== 'undefined' ? !!(window as any).FB : false,
        });
        toast.error('Facebook SDK not loaded. Please refresh the page.');
        setSocialLoading(null);
      }
    };
    
    tryFacebookLogin();
  }, [onSuccess, onOpenChange, router]);

  // Apple Login
  const handleAppleLogin = useCallback(() => {
    setSocialLoading('apple');
    // @ts-ignore - AppleID is loaded via script
    if (typeof window !== 'undefined' && window.AppleID) {
      // @ts-ignore
      window.AppleID.auth.signIn({
        requestedScopes: ['name', 'email'],
        success: async (response: any) => {
          try {
            await authService.appleLogin(response.id_token, response.user);
            toast.success('Apple login successful!');
            onOpenChange(false);
            if (onSuccess) {
              onSuccess();
            } else {
              router.refresh();
            }
          } catch (error: any) {
            toast.error(error.message || 'Apple login failed');
          } finally {
            setSocialLoading(null);
          }
        },
        failure: (error: any) => {
          toast.error('Apple login failed');
          setSocialLoading(null);
        },
      });
    } else {
      toast.error('Apple Sign In SDK not loaded');
      setSocialLoading(null);
    }
  }, [onSuccess, onOpenChange, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authService.login(loginData.email, loginData.password);
      toast.success('Login successful!');
      onOpenChange(false);
      if (onSuccess) {
        onSuccess();
      } else {
        router.refresh();
      }
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authService.register(signupData);
      toast.success('Account created successfully!');
      onOpenChange(false);
      if (onSuccess) {
        onSuccess();
      } else {
        router.refresh();
      }
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card border-white/10 max-w-md max-h-[90vh] overflow-y-auto bg-black">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">
            {activeTab === 'login' ? (
              <>
                Welcome back to <span className="text-[#00FFFF]">Sport</span>X
              </>
            ) : (
              <>
                Join <span className="text-[#00FFFF]">Sport</span>X
              </>
            )}
          </DialogTitle>
          <DialogDescription className="text-white/70">
            {activeTab === 'login'
              ? 'Sign in to your account'
              : 'Create your account to get started'}
          </DialogDescription>
        </DialogHeader>

        {/* Tab Switcher */}
        <div className="flex gap-2 mb-6">
          <Button
            type="button"
            variant={activeTab === 'login' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('login')}
            className={`flex-1 ${
              activeTab === 'login'
                ? 'bg-[#00FFFF] text-black hover:bg-[#00FFFF]/90'
                : 'text-white/70 hover:text-white'
            }`}
          >
            Login
          </Button>
          <Button
            type="button"
            variant={activeTab === 'signup' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('signup')}
            className={`flex-1 ${
              activeTab === 'signup'
                ? 'bg-[#00FFFF] text-black hover:bg-[#00FFFF]/90'
                : 'text-white/70 hover:text-white'
            }`}
          >
            Sign Up
          </Button>
        </div>

        {/* Login Form */}
        {activeTab === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="login-email" className="text-white">
                Email
              </Label>
              <Input
                id="login-email"
                type="email"
                placeholder="your@email.com"
                value={loginData.email}
                onChange={(e) =>
                  setLoginData({ ...loginData, email: e.target.value })
                }
                required
                className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="login-password" className="text-white">
                  Password
                </Label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-[#00FFFF] hover:underline"
                  onClick={(e) => {
                    e.preventDefault();
                    onOpenChange(false);
                    router.push('/forgot-password');
                  }}
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="login-password"
                type="password"
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value })
                }
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

            {/* Social Login Divider */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-black px-2 text-white/70">Or continue with</span>
              </div>
            </div>

            {/* Social Login Buttons */}
            <div className="grid grid-cols-3 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleGoogleLogin()}
                disabled={loading || socialLoading !== null}
                className="flex-1 border-white/10 bg-white/5 text-white hover:bg-white/10"
              >
                {socialLoading === 'google' ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                ) : (
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleFacebookLogin}
                disabled={loading || socialLoading !== null}
                className="flex-1 border-white/10 bg-white/5 text-white hover:bg-white/10"
              >
                {socialLoading === 'facebook' ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                ) : (
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleAppleLogin}
                disabled={loading || socialLoading !== null}
                className="flex-1 border-white/10 bg-white/5 text-white hover:bg-white/10"
              >
                {socialLoading === 'apple' ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                ) : (
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                  </svg>
                )}
              </Button>
            </div>
          </form>
        )}

        {/* Signup Form */}
        {activeTab === 'signup' && (
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="signup-name" className="text-white">
                Full Name
              </Label>
              <Input
                id="signup-name"
                placeholder="John Doe"
                value={signupData.name}
                onChange={(e) =>
                  setSignupData({ ...signupData, name: e.target.value })
                }
                required
                className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-email" className="text-white">
                Email
              </Label>
              <Input
                id="signup-email"
                type="email"
                placeholder="your@email.com"
                value={signupData.email}
                onChange={(e) =>
                  setSignupData({ ...signupData, email: e.target.value })
                }
                required
                className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-password" className="text-white">
                Password
              </Label>
              <Input
                id="signup-password"
                type="password"
                value={signupData.password}
                onChange={(e) =>
                  setSignupData({ ...signupData, password: e.target.value })
                }
                required
                className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="signup-city" className="text-white">
                  City
                </Label>
                <Select
                  value={signupData.city}
                  onValueChange={(value) =>
                    setSignupData({ ...signupData, city: value })
                  }
                >
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-white/10">
                    {CITIES.map((city) => (
                      <SelectItem key={city} value={city} className="text-white">
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-gender" className="text-white">
                  Gender
                </Label>
                <Select
                  value={signupData.gender}
                  onValueChange={(value) =>
                    setSignupData({ ...signupData, gender: value })
                  }
                >
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-white/10">
                    {GENDERS.map((gender) => (
                      <SelectItem
                        key={gender}
                        value={gender.toLowerCase()}
                        className="text-white"
                      >
                        {gender}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#00FFFF] text-black hover:bg-[#00FFFF]/90"
            >
              {loading ? 'Creating account...' : 'Sign Up'}
            </Button>

            {/* Social Login Divider */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-black px-2 text-white/70">Or continue with</span>
              </div>
            </div>

            {/* Social Login Buttons */}
            <div className="grid grid-cols-3 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleGoogleLogin()}
                disabled={loading || socialLoading !== null}
                className="flex-1 border-white/10 bg-white/5 text-white hover:bg-white/10"
              >
                {socialLoading === 'google' ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                ) : (
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleFacebookLogin}
                disabled={loading || socialLoading !== null}
                className="flex-1 border-white/10 bg-white/5 text-white hover:bg-white/10"
              >
                {socialLoading === 'facebook' ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                ) : (
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleAppleLogin}
                disabled={loading || socialLoading !== null}
                className="flex-1 border-white/10 bg-white/5 text-white hover:bg-white/10"
              >
                {socialLoading === 'apple' ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                ) : (
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                  </svg>
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function AuthModal(props: AuthModalProps) {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
  const facebookAppId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || '';
  const appleClientId = process.env.NEXT_PUBLIC_APPLE_CLIENT_ID || '';

  return (
    <>
      {/* Google Identity Services */}
      {googleClientId && (
        <Script
          id="google-identity"
          strategy="lazyOnLoad"
          src="https://accounts.google.com/gsi/client"
          onLoad={() => {
            // Google Identity Services is now loaded
          }}
        />
      )}

      {/* Facebook SDK */}
      {facebookAppId && (
        <Script
          id="facebook-jssdk"
          strategy="afterInteractive"
          src="https://connect.facebook.net/en_US/sdk.js"
          onLoad={() => {
            // @ts-ignore
            if (typeof window !== 'undefined' && window.FB) {
              // @ts-ignore
              window.FB.init({
                appId: facebookAppId,
                cookie: true,
                xfbml: true,
                version: 'v18.0',
              });
              console.log('Facebook SDK loaded successfully');
            }
          }}
          onError={() => {
            console.error('Failed to load Facebook SDK');
          }}
        />
      )}

      {/* Apple Sign In SDK */}
      {appleClientId && (
        <Script
          id="apple-signin"
          strategy="lazyOnLoad"
          src="https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js"
          onLoad={() => {
            // @ts-ignore
            if (typeof window !== 'undefined' && window.AppleID) {
              // @ts-ignore
              window.AppleID.auth.init({
                clientId: appleClientId,
                scope: 'name email',
                redirectURI: window.location.origin,
                usePopup: true,
              });
            }
          }}
        />
      )}

      <AuthModalContent {...props} />
    </>
  );
}

