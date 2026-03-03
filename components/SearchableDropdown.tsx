"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, ChevronDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchableDropdownProps<T> {
  label: string;
  data: T[];
  onSelect: (item: T) => void;
  selectedItem: T | null;
  placeholder: string;
  searchPlaceholder?: string;
  loading?: boolean;
  displayKey: keyof T;
  valueKey?: keyof T;
  emptyText?: string;
  disabled?: boolean;
  error?: string;
}

export function SearchableDropdown<T extends Record<string, any>>({
  label,
  data,
  onSelect,
  selectedItem,
  placeholder,
  searchPlaceholder = "Search...",
  loading = false,
  displayKey,
  valueKey,
  emptyText = "No items available",
  disabled = false,
  error,
}: SearchableDropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredData = data.filter((item) => {
    const displayValue = String(item[displayKey] || "").toLowerCase();
    return displayValue.includes(searchQuery.toLowerCase());
  });

  const handleSelect = (item: T) => {
    onSelect(item);
    setIsOpen(false);
    setSearchQuery("");
  };

  return (
    <div className={cn("space-y-2", !label && "space-y-0")} ref={dropdownRef}>
      {label && <Label className="text-white">{label}</Label>}
      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled || loading}
          className={cn(
            "w-full flex items-center justify-between px-4 py-3 rounded-lg border bg-white/5 text-white placeholder:text-white/50 transition-colors",
            error
              ? "border-red-500 focus:border-red-500"
              : "border-white/10 focus:border-[#00FFFF]",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          <span className={cn("truncate", !selectedItem && "text-white/50")}>
            {selectedItem ? String(selectedItem[displayKey]) : placeholder}
          </span>
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin text-white/50" />
          ) : (
            <ChevronDown
              className={cn(
                "h-4 w-4 text-white/50 transition-transform",
                isOpen && "rotate-180"
              )}
            />
          )}
        </button>

        {isOpen && (
          <div className="absolute z-50 w-full mt-2 bg-[#1a1e23] border border-white/10 rounded-lg shadow-lg max-h-60 overflow-hidden">
            <div className="p-2 border-b border-white/10">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
                <Input
                  type="text"
                  placeholder={searchPlaceholder}
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
                  <p>Loading...</p>
                </div>
              ) : filteredData.length === 0 ? (
                <div className="p-4 text-center text-white/50">{emptyText}</div>
              ) : (
                filteredData.map((item, index) => {
                  const isSelected =
                    selectedItem && valueKey
                      ? item[valueKey] === selectedItem[valueKey]
                      : item === selectedItem;

                  // Use a unique key - prefer valueKey if available, otherwise use displayKey
                  const uniqueKey = valueKey
                    ? item[valueKey]
                    : item[displayKey] || index;

                  return (
                    <button
                      key={uniqueKey}
                      type="button"
                      onClick={() => handleSelect(item)}
                      className={cn(
                        "w-full text-left px-4 py-2 hover:bg-white/5 transition-colors",
                        isSelected && "bg-[#00FFFF]/10 text-[#00FFFF]"
                      )}
                    >
                      {String(item[displayKey])}
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
