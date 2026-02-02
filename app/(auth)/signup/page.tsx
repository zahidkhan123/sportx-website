'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SPORTS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { InterestsStep } from '@/components/signup/InterestsStep';
import { BasicInfoStep } from '@/components/signup/BasicInfoStep';
import { ProfileDetailsStep } from '@/components/signup/ProfileDetailsStep';

export default function SignupPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<'interests' | 'basic' | 'profile'>('interests');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  useEffect(() => {
    // Check if user is already authenticated
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        router.push('/home');
      }
    }
  }, [router]);

  const handleInterestsComplete = (interests: string[]) => {
    setSelectedInterests(interests);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('selectedInterests', JSON.stringify(interests));
    }
    setCurrentStep('basic');
  };

  const handleBasicInfoComplete = () => {
    setCurrentStep('profile');
  };

  const handleBackToInterests = () => {
    setCurrentStep('interests');
  };

  const handleBackToBasic = () => {
    setCurrentStep('basic');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4">
      <Card className="glass-card w-full max-w-md border-white/10">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-white text-center">
            {currentStep === 'interests' && (
              <>
                Join <span className="text-[#00FFFF]">Sport</span>X
              </>
            )}
            {currentStep === 'basic' && (
              <>
                Create your <span className="text-[#00FFFF]">Sport</span>X Account
              </>
            )}
            {currentStep === 'profile' && (
              <>
                Complete Your <span className="text-[#00FFFF]">Profile</span>
              </>
            )}
          </CardTitle>
          <CardDescription className="text-white/70 text-center">
            {currentStep === 'interests' && 'Select your favorite sports to personalize your experience'}
            {currentStep === 'basic' && 'Step 1 of 2: Basic Information'}
            {currentStep === 'profile' && 'Step 2 of 2: Profile Details'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Progress Indicator */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center",
                currentStep === 'interests' 
                  ? "bg-[#00FFFF]" 
                  : "bg-[#00FFA3]"
              )}>
                {currentStep !== 'interests' ? (
                  <span className="text-black text-sm font-bold">✓</span>
                ) : (
                  <span className="text-black text-sm font-bold">1</span>
                )}
              </div>
              <span className={cn(
                "text-sm font-semibold",
                currentStep === 'interests' ? "text-[#00FFFF]" : "text-[#00FFA3]"
              )}>
                Interests
              </span>
            </div>
            <div className="flex-1 h-0.5 bg-white/10"></div>
            <div className="flex items-center gap-2">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center",
                currentStep === 'basic'
                  ? "bg-[#00FFFF]"
                  : currentStep === 'profile'
                  ? "bg-[#00FFA3]"
                  : "bg-white/10"
              )}>
                {currentStep === 'profile' ? (
                  <span className="text-black text-sm font-bold">✓</span>
                ) : (
                  <span className={cn(
                    "text-sm font-bold",
                    currentStep === 'basic' ? "text-black" : "text-white"
                  )}>2</span>
                )}
              </div>
              <span className={cn(
                "text-sm font-semibold",
                currentStep === 'basic' 
                  ? "text-[#00FFFF]" 
                  : currentStep === 'profile'
                  ? "text-[#00FFA3]"
                  : "text-white/50"
              )}>
                Sign Up
              </span>
            </div>
            <div className="flex-1 h-0.5 bg-white/10"></div>
            <div className="flex items-center gap-2">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center",
                currentStep === 'profile'
                  ? "bg-[#00FFFF]"
                  : "bg-white/10"
              )}>
                <span className={cn(
                  "text-sm font-bold",
                  currentStep === 'profile' ? "text-black" : "text-white"
                )}>3</span>
              </div>
              <span className={cn(
                "text-sm font-semibold",
                currentStep === 'profile' ? "text-[#00FFFF]" : "text-white/50"
              )}>
                Profile
              </span>
            </div>
          </div>

          {/* Step Content */}
          {currentStep === 'interests' && (
            <InterestsStep onComplete={handleInterestsComplete} />
          )}

          {currentStep === 'basic' && (
            <BasicInfoStep 
              onComplete={handleBasicInfoComplete}
              onBack={handleBackToInterests}
            />
          )}

          {currentStep === 'profile' && (
            <ProfileDetailsStep 
              onBack={handleBackToBasic}
            />
          )}

          {/* Login Link */}
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
