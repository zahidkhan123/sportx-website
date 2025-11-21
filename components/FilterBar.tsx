'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { CITIES, SPORTS } from '@/lib/constants';

interface FilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  sport?: string;
  onSportChange: (value: string) => void;
  city?: string;
  onCityChange: (value: string) => void;
  minPrice?: number;
  onMinPriceChange: (value: number) => void;
  maxPrice?: number;
  onMaxPriceChange: (value: number) => void;
}

export function FilterBar({
  search,
  onSearchChange,
  sport,
  onSportChange,
  city,
  onCityChange,
  minPrice,
  onMinPriceChange,
  maxPrice,
  onMaxPriceChange,
}: FilterBarProps) {
  return (
    <div className="glass-card border-white/10 p-4 space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
        <Input
          placeholder="Search..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/50"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Select value={sport || 'all'} onValueChange={(value) => onSportChange(value === 'all' ? '' : value)}>
          <SelectTrigger className="bg-white/5 border-white/10 text-white">
            <SelectValue placeholder="All Sports" />
          </SelectTrigger>
          <SelectContent className="bg-black border-white/10">
            <SelectItem value="all" className="text-white">All Sports</SelectItem>
            {SPORTS.map((s) => (
              <SelectItem key={s} value={s.toLowerCase()} className="text-white">
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={city || 'all'} onValueChange={(value) => onCityChange(value === 'all' ? '' : value)}>
          <SelectTrigger className="bg-white/5 border-white/10 text-white">
            <SelectValue placeholder="All Cities" />
          </SelectTrigger>
          <SelectContent className="bg-black border-white/10">
            <SelectItem value="all" className="text-white">All Cities</SelectItem>
            {CITIES.map((c) => (
              <SelectItem key={c} value={c} className="text-white">
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          type="number"
          placeholder="Min Price"
          value={minPrice || ''}
          onChange={(e) => onMinPriceChange(Number(e.target.value))}
          className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
        />

        <Input
          type="number"
          placeholder="Max Price"
          value={maxPrice || ''}
          onChange={(e) => onMaxPriceChange(Number(e.target.value))}
          className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
        />
      </div>
    </div>
  );
}

