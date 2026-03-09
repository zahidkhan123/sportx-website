import GoogleAds from '@/components/GoogleAds';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Lock, Eye, FileText } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex gap-6">
        <div className="flex-1 max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="text-5xl font-bold text-white mb-4">
              Privacy <span className="text-[#00FFFF]">Policy</span>
            </h1>
            <p className="text-white/70">
              Last updated: February 2025
            </p>
          </div>

          {/* Introduction */}
          <section className="mb-8">
            <p className="text-white/70 leading-relaxed text-center max-w-2xl mx-auto">
              SportX360 (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) operates the SportX360 mobile application and related services. This app is intended for users in Pakistan. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our app and services. Please read it carefully.
            </p>
          </section>

          {/* 1. Information We Collect */}
          <section className="mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <FileText className="h-6 w-6 text-[#00FFFF]" />
              <h2 className="text-3xl font-bold text-white">1. Information We Collect</h2>
            </div>
            <div className="space-y-4 text-white/70 text-left max-w-2xl mx-auto">
              <p>
                We collect information that you provide directly and information we obtain when you use the SportX360 app, including for listings, marketplace, and communications.
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Account and profile information (name, email, phone number, profile photo)</li>
                <li>Listings data (players, teams, tournaments, grounds, officials, and related details)</li>
                <li>Marketplace activity (ads, buy/sell gear, categories)</li>
                <li>Messages, chats, and support communications</li>
                <li>Device information, logs, and usage data when you use our services</li>
                <li>Location data when you use location-based features (e.g. grounds near you)</li>
              </ul>
            </div>
          </section>

          {/* 2. How We Use Your Information */}
          <section className="mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Eye className="h-6 w-6 text-[#00FFFF]" />
              <h2 className="text-3xl font-bold text-white">2. How We Use Your Information</h2>
            </div>
            <div className="space-y-2 text-white/70 text-left max-w-2xl mx-auto">
              <p>
                We use the information we collect to provide, maintain, and improve the SportX360 app; to send you updates and support; and to comply with legal obligations. We do not process payments; any payment or transaction between users is conducted at their own risk and is not our responsibility.
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>To facilitate listings and marketplace ads</li>
                <li>To personalize your experience and show relevant content</li>
                <li>To communicate with you and send notifications</li>
                <li>To detect and prevent fraud, abuse, and security issues</li>
                <li>To analyze usage and improve our services</li>
              </ul>
            </div>
          </section>

          {/* 3. Information Sharing */}
          <section className="mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Shield className="h-6 w-6 text-[#00FFFF]" />
              <h2 className="text-3xl font-bold text-white">3. Information Sharing</h2>
            </div>
            <div className="space-y-4 text-white/70 text-left max-w-2xl mx-auto">
              <p>
                We do not sell your personal information. We may share information with service providers who assist our operations, with other users as needed for listings and marketplace (e.g. listing or ad contact), or when required by law.
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Service providers (hosting, analytics, communications)</li>
                <li>Other users (e.g. for marketplace or listing contact)</li>
                <li>Legal and regulatory authorities when required by law</li>
              </ul>
            </div>
          </section>

          {/* 4. Data Security */}
          <section className="mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Lock className="h-6 w-6 text-[#00FFFF]" />
              <h2 className="text-3xl font-bold text-white">4. Data Security</h2>
            </div>
            <p className="text-white/70 leading-relaxed text-left max-w-2xl mx-auto">
              We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction.
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4 mt-4 text-white/70 max-w-2xl mx-auto">
              <li>Encrypted transmission and storage where applicable</li>
              <li>Access controls and authentication</li>
              <li>Regular security reviews and updates</li>
            </ul>
          </section>

          {/* 5. Your Rights */}
          <section className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-4 text-center">5. Your Rights</h2>
            <div className="space-y-2 text-white/70 text-left max-w-2xl mx-auto">
              <p>
                You may have rights to access, correct, delete, or port your data, and to object to or restrict certain processing, in accordance with applicable law in Pakistan. You can update your profile in the app or contact us to exercise these rights.
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Access and correction of your data</li>
                <li>Deletion of your account and associated data</li>
                <li>Opt-out of marketing communications</li>
                <li>Data portability where applicable</li>
              </ul>
            </div>
          </section>

          {/* 6. Payments and Transactions */}
          <section className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-4 text-center">6. Payments and Transactions</h2>
            <div className="space-y-2 text-white/70 text-left max-w-2xl mx-auto">
              <p>
                SportX360 is a listings and marketplace platform only. We do not provide, offer, or process any payment
                services, escrow, or money transfers. Any payment or financial transaction arranged between users
                (including but not limited to cash, bank transfers, mobile wallets, or third-party payment providers)
                takes place directly between those users and outside of our control.
              </p>
              <p>
                You are solely responsible for choosing how and with whom to pay or receive payment and for verifying
                the legitimacy of any counterparty. SportX360 does not act as a party to any transaction and is not
                responsible or liable for any payment issues, disputes, refunds, chargebacks, fraud, or losses arising
                from transactions between users.
              </p>
            </div>
          </section>

          {/* 7. Children's Privacy */}
          <section className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-4 text-center">7. Children&apos;s Privacy</h2>
            <p className="text-white/70 leading-relaxed text-left max-w-2xl mx-auto">
              Our services are not directed to individuals under the age of 13 (or higher where required by law). We do not knowingly collect personal information from children. If you believe we have collected such information, please contact us so we can delete it.
            </p>
          </section>

          {/* 8. Contact Us */}
          <Card className="glass-card border-[#00FFFF]/30 bg-gradient-to-r from-[#00FFFF]/10 to-transparent">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-white mb-4">8. Contact Us</h2>
              <p className="text-white/70 mb-4">
                For privacy-related questions, requests, or complaints, please contact us at support@sportx360.com or at the contact details provided within the SportX360 app. We will respond in accordance with applicable law in Pakistan.
              </p>
              <ul className="space-y-2 text-white/70">
                <li>Email: support@sportx360.com</li>
                <li>Address: Available on our Contact Us page</li>
              </ul>
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
