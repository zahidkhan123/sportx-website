'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SearchableDropdown } from '@/components/SearchableDropdown';
import { locationService, Country, State, City } from '@/lib/location';
import { authService } from '@/lib/auth';
import { SPORTS } from '@/lib/constants';
import { toast } from 'sonner';

export default function CompleteProfileStep3Page() {
  const router = useRouter();
  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [selectedState, setSelectedState] = useState<State | null>(null);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [area, setArea] = useState('');
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const step1 = sessionStorage.getItem('completeProfileStep1');
    const step2 = sessionStorage.getItem('completeProfileStep2');
    if (!step1) {
      router.push('/complete-profile/step1');
      return;
    }
    if (!step2) {
      router.push('/complete-profile/step2');
      return;
    }
    loadCountries();
  }, [router]);

  useEffect(() => {
    if (selectedCountry) {
      loadStates(selectedCountry.code);
    } else {
      setStates([]);
      setCities([]);
      setSelectedState(null);
      setSelectedCity(null);
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedCountry && selectedState) {
      loadCities(selectedCountry.code, selectedState.code);
    } else {
      setCities([]);
      setSelectedCity(null);
    }
  }, [selectedCountry, selectedState]);

  const loadCountries = async () => {
    setLoadingCountries(true);
    try {
      const result = await locationService.getCountries();
      if (result.success && result.data) {
        setCountries(result.data);
      } else {
        toast.error(result.message || 'Failed to load countries');
      }
    } catch (error) {
      toast.error('Failed to load countries. Please try again.');
    } finally {
      setLoadingCountries(false);
    }
  };

  const loadStates = async (countryCode: string) => {
    setLoadingStates(true);
    try {
      const result = await locationService.getStatesByCountry(countryCode);
      if (result.success && result.data) {
        setStates(result.data);
      } else {
        toast.error(result.message || 'Failed to load states');
      }
    } catch (error) {
      toast.error('Failed to load states. Please try again.');
    } finally {
      setLoadingStates(false);
    }
  };

  const loadCities = async (countryCode: string, stateCode: string) => {
    setLoadingCities(true);
    try {
      const result = await locationService.getCitiesByState(countryCode, stateCode);
      if (result.success && result.data) {
        setCities(result.data);
      } else {
        toast.error(result.message || 'Failed to load cities');
      }
    } catch (error) {
      toast.error('Failed to load cities. Please try again.');
    } finally {
      setLoadingCities(false);
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!selectedCountry) {
      newErrors.country = 'Country is required';
    }
    if (!selectedState) {
      newErrors.state = 'State is required';
    }
    if (!selectedCity) {
      newErrors.city = 'City is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleComplete = async () => {
    if (!validate()) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (typeof window === 'undefined') return;

    const step1Str = sessionStorage.getItem('completeProfileStep1');
    const step2Str = sessionStorage.getItem('completeProfileStep2');
    if (!step1Str || !step2Str) {
      toast.error('Profile steps missing, please start again');
      router.push('/complete-profile/step1');
      return;
    }

    try {
      const step1 = JSON.parse(step1Str);
      const step2 = JSON.parse(step2Str);
      setSubmitting(true);

      const favoriteSports: string[] = Array.isArray(step1.favoriteSports)
        ? step1.favoriteSports
        : [];

      // Map favoriteSports ids to ensure they exist in constants (safety)
      const validFavoriteSports = favoriteSports.filter((id) =>
        (SPORTS as unknown as { id: string }[]).some((s) => s.id === id),
      );

      await authService.completeProfile({
        fullName: step1.fullName,
        username: step1.username,
        gender: step2.gender,
        dob: step2.dob,
        phone: step2.phone,
        whatsapp: step2.whatsapp,
        country: selectedCountry!.name,
        state: selectedState!.name,
        city: selectedCity!.name,
        area: area.trim() || undefined,
        favoriteSports: validFavoriteSports,
        profileImage: step2.profileImage,
      });

      sessionStorage.removeItem('completeProfileStep1');
      sessionStorage.removeItem('completeProfileStep2');

      toast.success('Profile completed! Welcome to SportX.');
      router.push('/home');
    } catch (error: any) {
      toast.error(error.message || 'Failed to complete profile');
    } finally {
      setSubmitting(false);
    }
  };

  const isReady =
    !!selectedCountry && !!selectedState && !!selectedCity && !submitting;

  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4">
      <Card className="glass-card w-full max-w-3xl border-white/10">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-white text-center">
            Where are you usually playing from? 📍
          </CardTitle>
          <CardDescription className="text-white/70 text-center">
            We&apos;ll use this to show nearby sports activity.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <SearchableDropdown
              label="Country"
              data={countries}
              onSelect={(country) => {
                setSelectedCountry(country);
                if (errors.country)
                  setErrors((prev) => ({ ...prev, country: '' }));
              }}
              selectedItem={selectedCountry}
              placeholder={
                loadingCountries ? 'Loading countries...' : 'Select your country'
              }
              searchPlaceholder="Search countries..."
              loading={loadingCountries}
              displayKey="name"
              valueKey="code"
              emptyText={
                loadingCountries ? 'Loading countries...' : 'No countries available'
              }
              error={errors.country}
            />

            {selectedCountry && (
              <SearchableDropdown
                label="State / Province"
                data={states}
                onSelect={(state) => {
                  setSelectedState(state);
                  if (errors.state)
                    setErrors((prev) => ({ ...prev, state: '' }));
                }}
                selectedItem={selectedState}
                placeholder={
                  loadingStates ? 'Loading states...' : 'Select your state/province'
                }
                searchPlaceholder="Search states..."
                loading={loadingStates}
                displayKey="name"
                valueKey="code"
                emptyText={
                  loadingStates ? 'Loading states...' : 'No states available'
                }
                error={errors.state}
              />
            )}

            {selectedCountry && selectedState && (
              <SearchableDropdown
                label="City"
                data={cities}
                onSelect={(city) => {
                  setSelectedCity(city);
                  if (errors.city)
                    setErrors((prev) => ({ ...prev, city: '' }));
                }}
                selectedItem={selectedCity}
                placeholder={
                  loadingCities ? 'Loading cities...' : 'Select your city'
                }
                searchPlaceholder="Search cities..."
                loading={loadingCities}
                displayKey="name"
                valueKey="name"
                emptyText={
                  loadingCities ? 'Loading cities...' : 'No cities available'
                }
                error={errors.city}
              />
            )}

            {selectedCountry && selectedState && selectedCity && (
              <div className="space-y-2">
                <Label htmlFor="area" className="text-white">
                  Area or locality (optional)
                </Label>
                <Input
                  id="area"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="Enter your area/locality"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
                />
                <p className="text-xs text-white/50">
                  So we can suggest grounds & matches nearby.
                </p>
              </div>
            )}

            <Button
              onClick={handleComplete}
              disabled={!isReady}
              className="mt-4 w-full bg-[#00FFFF] text-black hover:bg-[#00FFFF]/90 disabled:opacity-50"
            >
              {submitting ? 'Completing...' : '🎉 Complete my profile'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

