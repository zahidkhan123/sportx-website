"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  User,
  LogOut,
  Plus,
  Package,
  CreditCard,
  ChevronDown,
  MessageCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { authService, type User as AuthUser } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { useLocation, DEFAULT_LOCATION } from "@/contexts/LocationContext";
import { useChatUnread } from "@/contexts/ChatUnreadContext";
import { SearchableDropdown } from "@/components/SearchableDropdown";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [mounted, setMounted] = useState(false);
  const { selectedLocation, setSelectedLocation, cities, loadingCities } =
    useLocation();
  const { totalUnread } = useChatUnread();

  useEffect(() => {
    setMounted(true);
    setIsAuthenticated(authService.isAuthenticated());
    setUser(authService.getCurrentUser());
  }, []);

  const mainNavItems = [
    { href: "/home", label: "Home" },
    { href: "/marketplace", label: "Marketplace" },
    { href: "/sports", label: "Sports" },
    { href: "/blogs", label: "Blogs" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  const exploreNavItems = [
    { href: "/players", label: "Players" },
    { href: "/teams", label: "Teams" },
    { href: "/grounds", label: "Grounds" },
    { href: "/tournaments", label: "Tournaments" },
    { href: "/equipment", label: "Equipment" },
    { href: "/discover/cricket-players-lahore", label: "Cricket in Lahore" },
  ];

  // Prepare cities data for dropdown (add "Pakistan" option at the top)
  const cityOptions = [
    { name: "Pakistan", value: "all" },
    ...cities.map((city) => ({ name: city.name, value: city.name })),
  ];

  const selectedCityOption =
    selectedLocation.value === "all"
      ? { name: "Pakistan", value: "all" }
      : cityOptions.find((c) => c.value === selectedLocation.city) || {
          name: selectedLocation.city || "Pakistan",
          value: selectedLocation.city || "all",
        };

  const navLinkActive = (href: string) => {
    if (href === "/blogs") {
      return pathname === "/blogs" || pathname.startsWith("/blogs/");
    }
    if (href === "/players") {
      return pathname === "/players" || pathname.startsWith("/player/");
    }
    if (href === "/teams") {
      return pathname === "/teams" || pathname.startsWith("/team/");
    }
    if (href === "/grounds") {
      return pathname === "/grounds" || pathname.startsWith("/ground/");
    }
    if (href === "/tournaments") {
      return (
        pathname === "/tournaments" || pathname.startsWith("/tournament/")
      );
    }
    if (href.startsWith("/discover/")) {
      return pathname.startsWith("/discover/");
    }
    return pathname === href;
  };

  const exploreNavActive = exploreNavItems.some((item) => navLinkActive(item.href));

  const handleCitySelect = (city: { name: string; value: string }) => {
    if (city.value === "all") {
      setSelectedLocation(DEFAULT_LOCATION);
    } else {
      setSelectedLocation({
        value: city.value.toLowerCase().replace(/\s+/g, "-"),
        label: city.name,
        city: city.name,
        state: "",
      });
    }
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Left side: City Selector and Logo */}
          <div className="flex items-center gap-4">
            {/* City Selector - Desktop */}

            <Link href="/home" className="text-xl font-bold text-white">
              <span className="text-[#00FFFF]">Sport</span>X<span className="text-[#39FF14]">360</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <div className="hidden md:block w-[200px]">
              <SearchableDropdown
                label=""
                data={cityOptions}
                onSelect={handleCitySelect}
                selectedItem={selectedCityOption}
                placeholder="Select city..."
                searchPlaceholder="Search cities..."
                loading={loadingCities}
                displayKey="name"
                valueKey="value"
                emptyText={
                  loadingCities ? "Loading cities..." : "No cities available"
                }
              />
            </div>
            {mainNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors",
                  navLinkActive(item.href)
                    ? "text-[#00FFFF]"
                    : "text-white/70 hover:text-white"
                )}
              >
                {item.label}
              </Link>
            ))}
            <DropdownMenu>
              <DropdownMenuTrigger
                className={cn(
                  "inline-flex items-center gap-1 text-sm font-medium transition-colors outline-none",
                  exploreNavActive
                    ? "text-[#00FFFF]"
                    : "text-white/70 hover:text-white"
                )}
              >
                Explore
                <ChevronDown className="h-4 w-4 opacity-80" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="min-w-[200px] border-white/10 bg-zinc-950 text-white"
              >
                {exploreNavItems.map((item) => (
                  <DropdownMenuItem
                    key={item.href}
                    asChild
                    className="text-white focus:bg-white/10 focus:text-[#00FFFF]"
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        "cursor-pointer",
                        navLinkActive(item.href) && "text-[#00FFFF]"
                      )}
                    >
                      {item.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {mounted && isAuthenticated ? (
              <>
                <Link href="/create-listing">
                  <Button className="bg-[#00FFFF] text-black hover:bg-[#00FFFF]/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Listing
                  </Button>
                </Link>
                {/* <Link href="/my-listings">
                  <Button variant="ghost" className="text-white/70 hover:text-white">
                    My Listings
                  </Button>
                </Link> */}
                {/* <Link href="/packages">
                  <Button
                    variant="ghost"
                    className="text-white/70 hover:text-white"
                  >
                    <Package className="h-4 w-4 mr-2" />
                    Packages
                  </Button>
                </Link>
                <Link href="/my-credits">
                  <Button
                    variant="ghost"
                    className="text-white/70 hover:text-white"
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Credits
                  </Button>
                </Link> */}
                <Link href="/chats" className="relative inline-flex items-center">
                  <Button
                    variant="ghost"
                    className="text-white/70 hover:text-white"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Messages
                    {totalUnread > 0 && (
                      <span className="ml-2 min-w-[20px] h-5 px-1.5 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">
                        {totalUnread > 99 ? "99+" : totalUnread}
                      </span>
                    )}
                  </Button>
                </Link>
                <Link href="/profile">
                  <Button
                    variant="ghost"
                    className="text-white/70 hover:text-white"
                  >
                    <User className="h-4 w-4 mr-2" />
                    {user?.name || "Profile"}
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  onClick={() => authService.logout()}
                  className="text-white/70 hover:text-white"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button
                    variant="ghost"
                    className="text-white/70 hover:text-white"
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="bg-[#00FFFF] text-black hover:bg-[#00FFFF]/90">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 py-4 space-y-2">
            {/* Mobile Location Selector */}
            <div className="px-4 py-2 border-b border-white/10 mb-2">
              <SearchableDropdown
                label="Select City"
                data={cityOptions}
                onSelect={handleCitySelect}
                selectedItem={selectedCityOption}
                placeholder="Select city..."
                searchPlaceholder="Search cities..."
                loading={loadingCities}
                displayKey="name"
                valueKey="value"
                emptyText={
                  loadingCities ? "Loading cities..." : "No cities available"
                }
              />
            </div>

            {mainNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "block px-4 py-2 text-sm font-medium transition-colors",
                  navLinkActive(item.href)
                    ? "text-[#00FFFF]"
                    : "text-white/70 hover:text-white"
                )}
              >
                {item.label}
              </Link>
            ))}
            <div className="px-4 pt-2 pb-1 text-xs font-semibold uppercase tracking-wide text-white/40">
              Explore
            </div>
            {exploreNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "block pl-8 pr-4 py-2 text-sm font-medium transition-colors",
                  navLinkActive(item.href)
                    ? "text-[#00FFFF]"
                    : "text-white/70 hover:text-white"
                )}
              >
                {item.label}
              </Link>
            ))}
            {mounted && isAuthenticated ? (
              <>
                <Link
                  href="/create-listing"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2 text-sm font-medium bg-[#00FFFF] text-black hover:bg-[#00FFFF]/90 rounded-lg text-center mb-2"
                >
                  <Plus className="h-4 w-4 inline mr-2" />
                  Create Listing
                </Link>
                <Link
                  href="/my-listings"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2 text-sm font-medium text-white/70 hover:text-white"
                >
                  My Listings
                </Link>
                <Link
                  href="/packages"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2 text-sm font-medium text-white/70 hover:text-white"
                >
                  <Package className="h-4 w-4 inline mr-2" />
                  Packages
                </Link>
                <Link
                  href="/my-credits"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2 text-sm font-medium text-white/70 hover:text-white"
                >
                  <CreditCard className="h-4 w-4 inline mr-2" />
                  My Credits
                </Link>
                <Link
                  href="/chats"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-2 text-sm font-medium text-white/70 hover:text-white"
                >
                  <span className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" />
                    Messages
                  </span>
                  {totalUnread > 0 && (
                    <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">
                      {totalUnread > 99 ? "99+" : totalUnread}
                    </span>
                  )}
                </Link>
                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2 text-sm font-medium text-white/70 hover:text-white"
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    authService.logout();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm font-medium text-white/70 hover:text-white"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2 text-sm font-medium text-white/70 hover:text-white"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2 text-sm font-medium text-white/70 hover:text-white"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
