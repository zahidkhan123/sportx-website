'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { SearchableDropdown } from '@/components/SearchableDropdown';
import { locationService, Country, State, City } from '@/lib/location';
import { ROLES, GENDERS, SPORTS } from '@/lib/constants';
import { authService } from '@/lib/auth';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface ProfileDetailsStepProps {
  onBack: () => void;
}

export function ProfileDetailsStep({ onBack }: ProfileDetailsStepProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    country: '',
    state: '',
    city: '',
    role: '',
    gender: '',
    favoriteSports: [] as string[],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // Location data states
  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [selectedState, setSelectedState] = useState<State | null>(null);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);

  // Load step 1 data and selected interests
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const step1Data = sessionStorage.getItem('signupStep1');
    const selectedInterests = sessionStorage.getItem('selectedInterests');

    if (!step1Data) {
      toast.error('Please complete step 1 first');
      router.push('/signup');
      return;
    }

    if (selectedInterests) {
      try {
        const interests = JSON.parse(selectedInterests);
        setFormData(prev => ({ ...prev, favoriteSports: interests }));
      } catch (e) {
        console.error('Error parsing selected interests:', e);
      }
    }

    loadCountries();
  }, []);

  // Load states when country is selected
  useEffect(() => {
    if (selectedCountry) {
      loadStates(selectedCountry.code);
      setFormData(prev => ({ ...prev, country: selectedCountry.name }));
    } else {
      setStates([]);
      setCities([]);
      setSelectedState(null);
      setSelectedCity(null);
    }
  }, [selectedCountry]);

  // Load cities when state is selected
  useEffect(() => {
    if (selectedCountry && selectedState) {
      loadCities(selectedCountry.code, selectedState.code);
      setFormData(prev => ({ ...prev, state: selectedState.name }));
    } else {
      setCities([]);
      setSelectedCity(null);
    }
  }, [selectedCountry, selectedState]);

  // Update city when selected
  useEffect(() => {
    if (selectedCity) {
      setFormData(prev => ({ ...prev, city: selectedCity.name }));
    }
  }, [selectedCity]);

  const loadCountries = async () => {
    setLoadingCountries(true);
    try {
      console.log('Loading countries...');
      const result = await locationService.getCountries();
      console.log('Countries result:', result);
      if (result.success && result.data) {
        console.log(`Loaded ${result.data.length} countries`);
        setCountries(result.data);
      } else {
        console.error('Failed to load countries:', result.message);
        toast.error(result.message || 'Failed to load countries');
      }
    } catch (error) {
      console.error('Error loading countries:', error);
      toast.error('Failed to load countries. Please try again.');
    } finally {
      setLoadingCountries(false);
    }
  };

  const loadStates = async (countryCode: string) => {
    setLoadingStates(true);
    try {
      console.log('Loading states for country:', countryCode);
      const result = await locationService.getStatesByCountry(countryCode);
      console.log('States result:', result);
      if (result.success && result.data) {
        console.log(`Loaded ${result.data.length} states`);
        setStates(result.data);
      } else {
        console.error('Failed to load states:', result.message);
        toast.error(result.message || 'Failed to load states');
      }
    } catch (error) {
      console.error('Error loading states:', error);
      toast.error('Failed to load states. Please try again.');
    } finally {
      setLoadingStates(false);
    }
  };

  const loadCities = async (countryCode: string, stateCode: string) => {
    setLoadingCities(true);
    try {
      console.log('Loading cities for country:', countryCode, 'state:', stateCode);
      const result = await locationService.getCitiesByState(countryCode, stateCode);
      console.log('Cities result:', result);
      if (result.success && result.data) {
        console.log(`Loaded ${result.data.length} cities`);
        setCities(result.data);
      } else {
        console.error('Failed to load cities:', result.message);
        toast.error(result.message || 'Failed to load cities');
      }
    } catch (error) {
      console.error('Error loading cities:', error);
      toast.error('Failed to load cities. Please try again.');
    } finally {
      setLoadingCities(false);
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.country) {
      newErrors.country = 'Country is required';
    }

    if (!formData.state) {
      newErrors.state = 'State is required';
    }

    if (!formData.city) {
      newErrors.city = 'City is required';
    }

    if (!formData.role) {
      newErrors.role = 'Role is required';
    }

    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
    }

    if (formData.favoriteSports.length === 0) {
      newErrors.favoriteSports = 'Please select at least one favorite sport';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    if (!validate()) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (typeof window === 'undefined') return;

    const step1DataStr = sessionStorage.getItem('signupStep1');
    if (!step1DataStr) {
      toast.error('Please complete step 1 first');
      router.push('/signup');
      return;
    }

    try {
      const step1Data = JSON.parse(step1DataStr);
      setLoading(true);

      // Prepare signup data matching app structure
      // Convert role to array (backend expects array)
      const roleArray = Array.isArray(formData.role)
        ? formData.role
        : formData.role
        ? [formData.role]
        : [];

      const signupData = {
        fullName: step1Data.fullName,
        email: step1Data.email,
        password: step1Data.password,
        confirmPassword: step1Data.confirmPassword,
        phoneNumber: `+${step1Data.countryCode.callingCode}${step1Data.phoneNumber}`,
        phone: `${step1Data.countryCode.callingCode}${step1Data.phoneNumber}`.replace(/\D/g, ''),
        country: formData.country,
        state: formData.state,
        city: formData.city,
        role: roleArray,
        gender: formData.gender,
        favoriteSports: formData.favoriteSports || [],
      };

      console.log('Signup data being sent:', signupData);

      await authService.register(signupData);
      
      toast.success('Account created! Please verify your email with the OTP sent to you.');
      
      // Clear session storage
      sessionStorage.removeItem('signupStep1');
      sessionStorage.removeItem('selectedInterests');
      
      // Redirect to OTP verification
      router.push(`/verify-otp?email=${encodeURIComponent(step1Data.email)}&type=register`);
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 max-h-[60vh] overflow-y-auto">
      <SearchableDropdown
        label="Country"
        data={countries}
        onSelect={(country) => {
          console.log('Country selected:', country);
          setSelectedCountry(country);
          setSelectedState(null);
          setSelectedCity(null);
          if (errors.country) setErrors({ ...errors, country: '' });
        }}
        selectedItem={selectedCountry}
        placeholder={loadingCountries ? "Loading countries..." : "Select your country"}
        searchPlaceholder="Search countries..."
        loading={loadingCountries}
        displayKey="name"
        valueKey="code"
        emptyText={loadingCountries ? "Loading countries..." : "No countries available"}
        error={errors.country}
      />

      {selectedCountry && (
        <SearchableDropdown
          label="State/Province"
          data={states}
          onSelect={(state) => {
            console.log('State selected:', state);
            setSelectedState(state);
            setSelectedCity(null);
            if (errors.state) setErrors({ ...errors, state: '' });
          }}
          selectedItem={selectedState}
          placeholder={loadingStates ? "Loading states..." : "Select your state/province"}
          searchPlaceholder="Search states..."
          loading={loadingStates}
          displayKey="name"
          valueKey="code"
          emptyText={loadingStates ? "Loading states..." : "No states available"}
          error={errors.state}
        />
      )}

      {selectedCountry && selectedState && (
        <SearchableDropdown
          label="City"
          data={cities}
          onSelect={(city) => {
            console.log('City selected:', city);
            setSelectedCity(city);
            if (errors.city) setErrors({ ...errors, city: '' });
          }}
          selectedItem={selectedCity}
          placeholder={loadingCities ? "Loading cities..." : "Select your city"}
          searchPlaceholder="Search cities..."
          loading={loadingCities}
          displayKey="name"
          emptyText={loadingCities ? "Loading cities..." : "No cities available"}
          error={errors.city}
        />
      )}

      <div className="space-y-2">
        <Label className="text-white">Role</Label>
        <Select
          value={formData.role}
          onValueChange={(value) => {
            setFormData({ ...formData, role: value });
            if (errors.role) setErrors({ ...errors, role: '' });
          }}
        >
          <SelectTrigger className="bg-white/5 border-white/10 text-white">
            <SelectValue placeholder="Select your role" />
          </SelectTrigger>
          <SelectContent className="bg-black border-white/10">
            {ROLES.map((role) => (
              <SelectItem key={role} value={role} className="text-white">
                {role}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.role && <p className="text-sm text-red-500">{errors.role}</p>}
      </div>

      <div className="space-y-2">
        <Label className="text-white">Gender</Label>
        <Select
          value={formData.gender}
          onValueChange={(value) => {
            setFormData({ ...formData, gender: value });
            if (errors.gender) setErrors({ ...errors, gender: '' });
          }}
        >
          <SelectTrigger className="bg-white/5 border-white/10 text-white">
            <SelectValue placeholder="Select gender" />
          </SelectTrigger>
          <SelectContent className="bg-black border-white/10">
            {GENDERS.map((gender) => (
              <SelectItem key={gender} value={gender} className="text-white">
                {gender}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.gender && <p className="text-sm text-red-500">{errors.gender}</p>}
      </div>

      <div className="space-y-2">
        <Label className="text-white">
          Favorite Sports
          <span className="text-white/50 text-sm ml-2">(Selected from previous step)</span>
        </Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-3 bg-white/5 rounded-lg border border-white/10 max-h-32 overflow-y-auto">
          {formData.favoriteSports.length === 0 ? (
            <p className="text-white/50 text-sm col-span-full">No sports selected</p>
          ) : (
            formData.favoriteSports.map((sportId) => {
              const sport = SPORTS.find(s => s.id === sportId);
              if (!sport) return null;
              return (
                <div
                  key={sportId}
                  className="flex items-center gap-2 p-2 bg-[#0b1f33] border border-[#00FFFF] rounded-lg"
                >
                  <span>{sport.emoji}</span>
                  <span className="text-xs text-white">{sport.name}</span>
                </div>
              );
            })
          )}
        </div>
        {errors.favoriteSports && <p className="text-sm text-red-500">{errors.favoriteSports}</p>}
      </div>

      <div className="flex gap-2 pt-2">
        <Button
          type="button"
          variant="ghost"
          onClick={onBack}
          className="flex-1 text-white/70 hover:text-white"
        >
          Back
        </Button>
        <Button
          onClick={handleSignup}
          disabled={loading}
          className="flex-1 bg-[#00FFFF] text-black hover:bg-[#00FFFF]/90 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing up...
            </>
          ) : (
            'Sign Up'
          )}
        </Button>
      </div>
    </div>
  );
}

