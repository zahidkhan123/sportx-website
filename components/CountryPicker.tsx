'use client';

import { useState, useEffect, useRef } from 'react';
import { locationService, Country } from '@/lib/location';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, ChevronDown, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CountryPickerProps {
  value: {
    cca2: string;
    callingCode: string;
    name: string;
    flag: string;
  };
  onChange: (country: {
    cca2: string;
    callingCode: string;
    name: string;
    flag: string;
  }) => void;
  error?: string;
}

export function CountryPicker({ value, onChange, error }: CountryPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadCountries = async () => {
      setLoading(true);
      const result = await locationService.getCountries();
      if (result.success) {
        setCountries(result.data);
      }
      setLoading(false);
    };

    if (isOpen && countries.length === 0) {
      loadCountries();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredCountries = countries.filter(country => {
    const name = country.name.toLowerCase();
    const code = country.code.toLowerCase();
    const query = searchQuery.toLowerCase();
    return name.includes(query) || code.includes(query);
  });

  const handleSelect = (country: Country) => {
    // Get flag emoji from country code
    const getFlagEmoji = (code: string) => {
      const codePoints = code
        .toUpperCase()
        .split('')
        .map(char => 127397 + char.charCodeAt(0));
      return String.fromCodePoint(...codePoints);
    };

    onChange({
      cca2: country.code,
      callingCode: country.phonecode || '',
      name: country.name,
      flag: country.flag || getFlagEmoji(country.code),
    });
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div className="space-y-2" ref={dropdownRef}>
      <Label className="text-white">Country Code</Label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          disabled={loading}
          className={cn(
            "w-full flex items-center justify-between px-4 py-3 rounded-lg border bg-white/5 text-white transition-colors",
            error
              ? "border-red-500 focus:border-red-500"
              : "border-white/10 focus:border-[#00FFFF]",
            loading && "opacity-50 cursor-not-allowed"
          )}
        >
          <div className="flex items-center gap-2">
            <span className="text-xl">{value.flag}</span>
            <span>+{value.callingCode}</span>
            <span className="text-white/70">{value.name}</span>
          </div>
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin text-white/50" />
          ) : (
            <ChevronDown className={cn("h-4 w-4 text-white/50 transition-transform", isOpen && "rotate-180")} />
          )}
        </button>

        {isOpen && (
          <div className="absolute z-50 w-full mt-2 bg-[#1a1e23] border border-white/10 rounded-lg shadow-lg max-h-60 overflow-hidden">
            <div className="p-2 border-b border-white/10">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
                <Input
                  type="text"
                  placeholder="Search countries..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/50"
                  autoFocus
                />
              </div>
            </div>
            <div className="overflow-y-auto max-h-48">
              {loading ? (
                <div className="p-4 text-center text-white/50">
                  <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2" />
                  <p>Loading countries...</p>
                </div>
              ) : filteredCountries.length === 0 ? (
                <div className="p-4 text-center text-white/50">No countries found</div>
              ) : (
                filteredCountries.map((country) => {
                  const getFlagEmoji = (code: string) => {
                    const codePoints = code
                      .toUpperCase()
                      .split('')
                      .map(char => 127397 + char.charCodeAt(0));
                    return String.fromCodePoint(...codePoints);
                  };

                  const flag = country.flag || getFlagEmoji(country.code);
                  const isSelected = country.code === value.cca2;

                  return (
                    <button
                      key={country.code}
                      type="button"
                      onClick={() => handleSelect(country)}
                      className={cn(
                        "w-full text-left px-4 py-2 hover:bg-white/5 transition-colors flex items-center gap-2",
                        isSelected && "bg-[#00FFFF]/10 text-[#00FFFF]"
                      )}
                    >
                      <span>{flag}</span>
                      <span className="flex-1">{country.name}</span>
                      <span className="text-white/50">+{country.phonecode || ''}</span>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

