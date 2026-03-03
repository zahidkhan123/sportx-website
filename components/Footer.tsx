'use client';

import Link from 'next/link';
import { Facebook, Twitter, Instagram, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/80 backdrop-blur-md">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <h3 className="text-lg font-bold text-white mb-4">
              <span className="text-[#00FFFF]">SportX360</span>
            </h3>
            <p className="text-sm text-white/70">
              Your ultimate sports marketplace. Connect, buy, sell, and discover sports opportunities.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/home" className="text-sm text-white/70 hover:text-[#00FFFF]">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/marketplace" className="text-sm text-white/70 hover:text-[#00FFFF]">
                  Marketplace
                </Link>
              </li>
              <li>
                <Link href="/sports" className="text-sm text-white/70 hover:text-[#00FFFF]">
                  Sports Listings
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-white/70 hover:text-[#00FFFF]">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Account</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/profile" className="text-sm text-white/70 hover:text-[#00FFFF]">
                  Profile
                </Link>
              </li>
              {/* <li>
                <Link href="/my-credits" className="text-sm text-white/70 hover:text-[#00FFFF]">
                  My Credits
                </Link>
              </li> */}
              <li>
                <Link href="/my-listings" className="text-sm text-white/70 hover:text-[#00FFFF]">
                  My Listings
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/contact" className="text-sm text-white/70 hover:text-[#00FFFF]">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm text-white/70 hover:text-[#00FFFF]">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-white/70 hover:text-[#00FFFF]">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-white/70 hover:text-[#00FFFF]">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <a href="#" className="text-white/70 hover:text-[#00FFFF]">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-white/70 hover:text-[#00FFFF]">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-white/70 hover:text-[#00FFFF]">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-white/70 hover:text-[#00FFFF]">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-8 text-center text-sm text-white/70">
          <p>&copy; {new Date().getFullYear()} SportX360. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

