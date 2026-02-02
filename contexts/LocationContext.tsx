'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { locationService } from '@/lib/location';

export type LocationOption = {
  value: string;
  label: string;
  city?: string;
  state?: string;
};

export const DEFAULT_LOCATION: LocationOption = { value: 'all', label: 'Pakistan', city: '', state: '' };

interface LocationContextType {
  selectedLocation: LocationOption;
  setSelectedLocation: (location: LocationOption) => void;
  cities: Array<{ name: string; stateCode?: string }>;
  loadingCities: boolean;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: ReactNode }) {
  const [selectedLocation, setSelectedLocationState] = useState<LocationOption>(DEFAULT_LOCATION);
  const [cities, setCities] = useState<Array<{ name: string; stateCode?: string }>>([]);
  const [loadingCities, setLoadingCities] = useState(false);

  // Load cities for Pakistan on mount
  useEffect(() => {
    const loadCities = async () => {
      setLoadingCities(true);
      try {
        const result = await locationService.getCitiesByCountry('PK'); // PK is Pakistan's ISO code
        if (result.success && result.data) {
          setCities(result.data);
          console.log(`Loaded ${result.data.length} cities for Pakistan`);
        } else {
          console.error('Failed to load cities:', result.message);
        }
      } catch (error) {
        console.error('Error loading cities:', error);
      } finally {
        setLoadingCities(false);
      }
    };

    loadCities();
  }, []);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('selectedLocation');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setSelectedLocationState(parsed);
        } catch (e) {
          console.error('Error parsing saved location:', e);
        }
      }
    }
  }, []);

  const setSelectedLocation = (location: LocationOption) => {
    setSelectedLocationState(location);
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedLocation', JSON.stringify(location));
      // Trigger a custom event to notify pages to refetch
      window.dispatchEvent(new CustomEvent('locationChanged', { detail: location }));
    }
  };

  return (
    <LocationContext.Provider value={{ selectedLocation, setSelectedLocation, cities, loadingCities }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
}

