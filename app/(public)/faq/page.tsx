'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import GoogleAds from '@/components/GoogleAds';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: 'How do I create an account?',
    answer: 'Creating an account is easy! Click on "Sign Up" in the top navigation, fill in your details including name, email, password, city, and gender. After registration, you\'ll receive an OTP via email to verify your account. Once verified, you can start using all features of SportX.',
  },
  {
    question: 'How do I list an item for sale?',
    answer: 'To list an item in the marketplace, you need to be logged in. Click on "Create Ad" button on the marketplace page, fill in the details including title, description, price, category, condition, location, and upload images. Your listing will be reviewed and approved before going live.',
  },
  {
    question: 'How do I create a sports listing?',
    answer: 'Navigate to the Sports page and click "Create Listing". Select your sport type and listing type (player, team, tournament, etc.), then fill in the required details. Your listing will be visible to other users once created.',
  },
  {
    question: 'Is it free to use SportX?',
    answer: 'Yes! Creating an account and browsing listings is completely free. You can create listings, browse marketplace items, and connect with other users at no cost. Some premium features may be available for verified sellers.',
  },
  {
    question: 'How do I verify my account?',
    answer: 'To get verified, go to your profile and click on "Get Verified". You\'ll need to provide your full name, city, sports category, bio, and upload an ID document. Our team will review your application and verify your account within a few business days.',
  },
  {
    question: 'How do I contact a seller?',
    answer: 'On any marketplace listing, you\'ll find the seller\'s contact information. You can call them directly or use WhatsApp to get in touch. Make sure to verify the listing details before making a purchase.',
  },
  {
    question: 'What payment methods are accepted?',
    answer: 'SportX is a marketplace platform that connects buyers and sellers. Payment arrangements are made directly between buyers and sellers. We recommend using secure payment methods and meeting in person when possible for equipment purchases.',
  },
  {
    question: 'How do I report a problem?',
    answer: 'If you encounter any issues, inappropriate content, or suspicious activity, you can report it using the "Report" button on listings or contact our support team through the Contact Us page. We take all reports seriously and will investigate promptly.',
  },
  {
    question: 'Can I edit or delete my listings?',
    answer: 'Yes! You can edit or delete your listings from the "My Listings" page. Simply click on the listing you want to modify and use the edit or delete options. Note that once a listing is deleted, it cannot be recovered.',
  },
  {
    question: 'How do I reset my password?',
    answer: 'If you\'ve forgotten your password, click on "Forgot Password" on the login page. Enter your email address, and we\'ll send you an OTP code. Verify the code and set a new password. Make sure to use a strong password for better security.',
  },
  {
    question: 'What sports are supported?',
    answer: 'SportX supports a wide range of sports including Cricket, Football, Tennis, Badminton, Basketball, Volleyball, Hockey, Gym, Swimming, Athletics, and many more. You can filter listings by sport type to find exactly what you\'re looking for.',
  },
  {
    question: 'How do I become a featured seller?',
    answer: 'Featured sellers are verified members with excellent ratings and multiple successful transactions. To become a featured seller, maintain a good reputation, get verified, and consistently provide quality listings. You can also request featured status for individual ads.',
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex gap-6">
        <div className="flex-1 max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="text-5xl font-bold text-white mb-4">
              Frequently Asked <span className="text-[#00FFFF]">Questions</span>
            </h1>
            <p className="text-xl text-white/70">
              Find answers to common questions about SportX
            </p>
          </div>

          {/* FAQ Items */}
          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <Card
                key={index}
                className="glass-card border-white/10 hover:border-[#00FFFF]/30 transition-colors"
              >
                <CardContent className="p-0">
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full p-6 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
                  >
                    <h3 className="text-lg font-semibold text-white pr-4">
                      {faq.question}
                    </h3>
                    {openIndex === index ? (
                      <ChevronUp className="h-5 w-5 text-[#00FFFF] flex-shrink-0" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-white/50 flex-shrink-0" />
                    )}
                  </button>
                  {openIndex === index && (
                    <div className="px-6 pb-6">
                      <p className="text-white/70 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Still Have Questions */}
          <Card className="glass-card border-[#00FFFF]/30 bg-gradient-to-r from-[#00FFFF]/10 to-transparent mt-12">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-white mb-4">
                Still have questions?
              </h2>
              <p className="text-white/70 mb-6">
                Can't find the answer you're looking for? Please reach out to our friendly team.
              </p>
              <a
                href="/contact"
                className="inline-block px-6 py-3 bg-[#00FFFF] text-black font-semibold rounded-lg hover:bg-[#00FFFF]/90 transition-colors"
              >
                Contact Us
              </a>
            </CardContent>
          </Card>
        </div>

        {/* Vertical Ad Sidebar */}
        <div className="hidden xl:block w-[300px] flex-shrink-0">
          <div className="sticky top-4">
            <GoogleAds
              adSlot="3814764721"
              adFormat="vertical"
              className="w-full"
              minHeight="600px"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

