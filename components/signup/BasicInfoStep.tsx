'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';
import { CountryPicker } from '@/components/CountryPicker';
import { toast } from 'sonner';

interface BasicInfoStepProps {
  onComplete: () => void;
  onBack: () => void;
}

export function BasicInfoStep({ onComplete, onBack }: BasicInfoStepProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [countryCode, setCountryCode] = useState({
    cca2: 'US',
    callingCode: '1',
    name: 'United States',
    flag: '🇺🇸',
  });

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName || formData.fullName.length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters';
    }

    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phoneNumber || !/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }

    if (!formData.password || formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, number, and special character';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validate()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    // Store step 1 data in sessionStorage
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('signupStep1', JSON.stringify({
        ...formData,
        countryCode,
      }));
    }

    onComplete();
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleNext(); }} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fullName" className="text-white">Full Name</Label>
        <Input
          id="fullName"
          placeholder="John Doe"
          value={formData.fullName}
          onChange={(e) => {
            setFormData({ ...formData, fullName: e.target.value });
            if (errors.fullName) setErrors({ ...errors, fullName: '' });
          }}
          className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
        />
        {errors.fullName && <p className="text-sm text-red-500">{errors.fullName}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-white">Email</Label>
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
        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
      </div>

      <CountryPicker
        value={countryCode}
        onChange={setCountryCode}
      />

      <div className="space-y-2">
        <Label htmlFor="phoneNumber" className="text-white">Phone Number</Label>
        <Input
          id="phoneNumber"
          type="tel"
          placeholder="1234567890"
          value={formData.phoneNumber}
          onChange={(e) => {
            setFormData({ ...formData, phoneNumber: e.target.value });
            if (errors.phoneNumber) setErrors({ ...errors, phoneNumber: '' });
          }}
          className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
        />
        {errors.phoneNumber && <p className="text-sm text-red-500">{errors.phoneNumber}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-white">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={(e) => {
              setFormData({ ...formData, password: e.target.value });
              if (errors.password) setErrors({ ...errors, password: '' });
            }}
            className="bg-white/5 border-white/10 text-white placeholder:text-white/50 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-white">Confirm Password</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={(e) => {
              setFormData({ ...formData, confirmPassword: e.target.value });
              if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
            }}
            className="bg-white/5 border-white/10 text-white placeholder:text-white/50 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
          >
            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
      </div>

      <div className="flex gap-2">
        <Button
          type="button"
          variant="ghost"
          onClick={onBack}
          className="flex-1 text-white/70 hover:text-white"
        >
          Back
        </Button>
        <Button
          type="submit"
          className="flex-1 bg-[#00FFFF] text-black hover:bg-[#00FFFF]/90"
        >
          Continue
        </Button>
      </div>
    </form>
  );
}

