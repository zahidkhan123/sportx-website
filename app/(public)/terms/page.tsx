import GoogleAds from '@/components/GoogleAds';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex gap-6">
        <div className="flex-1 max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="text-5xl font-bold text-white mb-4">
              Terms of <span className="text-[#00FFFF]">Service</span>
            </h1>
            <p className="text-white/70">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {/* Introduction */}
          <section className="mb-8">
            <p className="text-white/70 leading-relaxed text-center max-w-2xl mx-auto">
              Welcome to SportX. These Terms of Service ("Terms") govern your access to and use of 
              our platform, services, and applications (collectively, the "Service"). By accessing 
              or using our Service, you agree to be bound by these Terms. If you disagree with any 
              part of these terms, then you may not access the Service.
            </p>
          </section>

          {/* Acceptance of Terms */}
          <section className="mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <CheckCircle className="h-6 w-6 text-[#00FFFF]" />
              <h2 className="text-3xl font-bold text-white">Acceptance of Terms</h2>
            </div>
            <p className="text-white/70 leading-relaxed text-center max-w-2xl mx-auto">
              By creating an account, accessing, or using SportX, you acknowledge that you have read, 
              understood, and agree to be bound by these Terms and our Privacy Policy. If you do not 
              agree to these Terms, you must not use our Service.
            </p>
          </section>

          {/* Eligibility */}
          <section className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-4 text-center">Eligibility</h2>
            <div className="space-y-2 text-white/70 text-left max-w-2xl mx-auto">
              <p>To use SportX, you must:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Be at least 13 years of age (or the age of majority in your jurisdiction)</li>
                <li>Have the legal capacity to enter into binding agreements</li>
                <li>Provide accurate, current, and complete information during registration</li>
                <li>Maintain and update your information to keep it accurate</li>
                <li>Not have been previously suspended or removed from our Service</li>
              </ul>
            </div>
          </section>

          {/* User Accounts */}
          <section className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-4 text-center">User Accounts</h2>
            <div className="space-y-4 text-white/70 text-left max-w-2xl mx-auto">
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Account Creation</h3>
                <p>
                  You are responsible for maintaining the confidentiality of your account credentials 
                  and for all activities that occur under your account. You agree to notify us 
                  immediately of any unauthorized use of your account.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Account Security</h3>
                <p>
                  You are responsible for safeguarding your password and for any activities or actions 
                  under your account. We cannot and will not be liable for any loss or damage arising 
                  from your failure to comply with this requirement.
                </p>
              </div>
            </div>
          </section>

          {/* Use of Service */}
          <section className="mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <FileText className="h-6 w-6 text-[#00FFFF]" />
              <h2 className="text-3xl font-bold text-white">Use of Service</h2>
            </div>
            <div className="space-y-4 text-white/70 text-left max-w-2xl mx-auto">
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Permitted Use</h3>
                <p>You may use our Service for lawful purposes only and in accordance with these Terms.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Prohibited Activities</h3>
                <p className="mb-2">You agree not to:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Violate any applicable laws or regulations</li>
                  <li>Infringe upon the rights of others</li>
                  <li>Post false, misleading, or fraudulent information</li>
                  <li>Harass, abuse, or harm other users</li>
                  <li>Spam or send unsolicited communications</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Interfere with or disrupt the Service</li>
                  <li>Use automated systems to access the Service without permission</li>
                  <li>Impersonate any person or entity</li>
                  <li>Collect user information without consent</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Marketplace and Listings */}
          <section className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-4 text-center">Marketplace and Listings</h2>
            <div className="space-y-4 text-white/70 text-left max-w-2xl mx-auto">
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Listing Items</h3>
                <p>
                  When you create a listing, you represent and warrant that you have the right to sell 
                  the item and that all information provided is accurate. You are responsible for your 
                  listings and any transactions that result from them.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Transactions</h3>
                <p>
                  SportX facilitates connections between buyers and sellers but is not a party to any 
                  transaction. All transactions are between users, and SportX is not responsible for 
                  the quality, safety, or legality of items listed or the accuracy of listings.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Payment</h3>
                <p>
                  Payment arrangements are made directly between buyers and sellers. SportX does not 
                  process payments or handle transactions. We recommend using secure payment methods 
                  and meeting in person when possible.
                </p>
              </div>
            </div>
          </section>

          {/* Content and Intellectual Property */}
          <section className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-4 text-center">Content and Intellectual Property</h2>
            <div className="space-y-4 text-white/70 text-left max-w-2xl mx-auto">
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Your Content</h3>
                <p>
                  You retain ownership of any content you post on SportX. By posting content, you 
                  grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, 
                  modify, and distribute your content for the purpose of operating and promoting 
                  our Service.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Our Content</h3>
                <p>
                  The Service and its original content, features, and functionality are owned by 
                  SportX and are protected by international copyright, trademark, patent, trade 
                  secret, and other intellectual property laws.
                </p>
              </div>
            </div>
          </section>

          {/* Disclaimers */}
          <section className="mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <AlertCircle className="h-6 w-6 text-[#00FFFF]" />
              <h2 className="text-3xl font-bold text-white">Disclaimers</h2>
            </div>
            <div className="space-y-2 text-white/70 text-left max-w-2xl mx-auto">
              <p>The Service is provided "as is" and "as available" without warranties of any kind, 
              either express or implied. We do not warrant that:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>The Service will be uninterrupted or error-free</li>
                <li>Defects will be corrected</li>
                <li>The Service is free of viruses or other harmful components</li>
                <li>The information on the Service is accurate or complete</li>
              </ul>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-4 text-center">Limitation of Liability</h2>
            <p className="text-white/70 leading-relaxed text-center max-w-2xl mx-auto">
              To the maximum extent permitted by law, SportX shall not be liable for any indirect, 
              incidental, special, consequential, or punitive damages, or any loss of profits or 
              revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, 
              or other intangible losses resulting from your use of the Service.
            </p>
          </section>

          {/* Indemnification */}
          <section className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-4 text-center">Indemnification</h2>
            <p className="text-white/70 leading-relaxed text-center max-w-2xl mx-auto">
              You agree to defend, indemnify, and hold harmless SportX and its officers, directors, 
              employees, and agents from and against any claims, liabilities, damages, losses, and 
              expenses, including reasonable attorney's fees, arising out of or in any way connected 
              with your access to or use of the Service or your violation of these Terms.
            </p>
          </section>

          {/* Termination */}
          <section className="mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <XCircle className="h-6 w-6 text-[#00FFFF]" />
              <h2 className="text-3xl font-bold text-white">Termination</h2>
            </div>
            <p className="text-white/70 leading-relaxed text-center max-w-2xl mx-auto">
              We may terminate or suspend your account and access to the Service immediately, without 
              prior notice or liability, for any reason, including if you breach these Terms. Upon 
              termination, your right to use the Service will cease immediately.
            </p>
          </section>

          {/* Changes to Terms */}
          <section className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-4 text-center">Changes to Terms</h2>
            <p className="text-white/70 leading-relaxed text-center max-w-2xl mx-auto">
              We reserve the right to modify these Terms at any time. We will notify users of any 
              material changes by posting the new Terms on this page and updating the "Last updated" 
              date. Your continued use of the Service after such modifications constitutes acceptance 
              of the updated Terms.
            </p>
          </section>

          {/* Governing Law */}
          <section className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-4 text-center">Governing Law</h2>
            <p className="text-white/70 leading-relaxed text-center max-w-2xl mx-auto">
              These Terms shall be governed by and construed in accordance with applicable laws, 
              without regard to its conflict of law provisions. Any disputes arising from these 
              Terms shall be subject to the exclusive jurisdiction of the competent courts.
            </p>
          </section>

          {/* Contact */}
          <Card className="glass-card border-[#00FFFF]/30 bg-gradient-to-r from-[#00FFFF]/10 to-transparent">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Questions About Terms</h2>
              <p className="text-white/70 mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <ul className="space-y-2 text-white/70">
                <li>Email: legal@sportx.com</li>
                <li>Visit our Contact Us page for more information</li>
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

