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
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {/* Introduction */}
          <section className="mb-8">
            <p className="text-white/70 leading-relaxed text-center max-w-2xl mx-auto">
              At SportX, we take your privacy seriously. This Privacy Policy explains how we collect, 
              use, disclose, and safeguard your information when you use our platform. Please read 
              this privacy policy carefully. If you do not agree with the terms of this privacy policy, 
              please do not access the site.
            </p>
          </section>

          {/* Information We Collect */}
          <section className="mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <FileText className="h-6 w-6 text-[#00FFFF]" />
              <h2 className="text-3xl font-bold text-white">Information We Collect</h2>
            </div>
            <div className="space-y-4 text-white/70 text-left max-w-2xl mx-auto">
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Personal Information</h3>
                <p className="mb-2">We collect information that you provide directly to us, including:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Name, email address, phone number</li>
                  <li>City, gender, and other profile information</li>
                  <li>Payment information (processed securely through third-party providers)</li>
                  <li>Content you post, including listings, messages, and reviews</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Automatically Collected Information</h3>
                <p className="mb-2">When you use our platform, we automatically collect:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Device information (IP address, browser type, operating system)</li>
                  <li>Usage data (pages visited, time spent, clicks)</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section className="mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Eye className="h-6 w-6 text-[#00FFFF]" />
              <h2 className="text-3xl font-bold text-white">How We Use Your Information</h2>
            </div>
            <div className="space-y-2 text-white/70 text-left max-w-2xl mx-auto">
              <p>We use the information we collect to:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Provide, maintain, and improve our services</li>
                <li>Process transactions and send related information</li>
                <li>Send you technical notices, updates, and support messages</li>
                <li>Respond to your comments, questions, and requests</li>
                <li>Monitor and analyze trends, usage, and activities</li>
                <li>Detect, prevent, and address technical issues and fraudulent activity</li>
                <li>Personalize your experience and provide content relevant to your interests</li>
              </ul>
            </div>
          </section>

          {/* Information Sharing */}
          <section className="mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Shield className="h-6 w-6 text-[#00FFFF]" />
              <h2 className="text-3xl font-bold text-white">Information Sharing and Disclosure</h2>
            </div>
            <div className="space-y-4 text-white/70 text-left max-w-2xl mx-auto">
              <p>We do not sell your personal information. We may share your information in the following circumstances:</p>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Public Information</h3>
                <p>
                  Information you choose to make public, such as your profile information and listings, 
                  will be visible to other users of the platform.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Service Providers</h3>
                <p>
                  We may share information with third-party service providers who perform services on 
                  our behalf, such as payment processing, data analysis, and email delivery.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Legal Requirements</h3>
                <p>
                  We may disclose your information if required to do so by law or in response to valid 
                  requests by public authorities.
                </p>
              </div>
            </div>
          </section>

          {/* Data Security */}
          <section className="mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Lock className="h-6 w-6 text-[#00FFFF]" />
              <h2 className="text-3xl font-bold text-white">Data Security</h2>
            </div>
            <p className="text-white/70 leading-relaxed text-center max-w-2xl mx-auto">
              We implement appropriate technical and organizational security measures to protect your 
              personal information against unauthorized access, alteration, disclosure, or destruction. 
              However, no method of transmission over the Internet or electronic storage is 100% secure, 
              and we cannot guarantee absolute security.
            </p>
          </section>

          {/* Your Rights */}
          <section className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-4 text-center">Your Rights</h2>
            <div className="space-y-2 text-white/70 text-left max-w-2xl mx-auto">
              <p>You have the right to:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Access and receive a copy of your personal data</li>
                <li>Rectify inaccurate or incomplete personal data</li>
                <li>Request deletion of your personal data</li>
                <li>Object to processing of your personal data</li>
                <li>Request restriction of processing your personal data</li>
                <li>Data portability (receive your data in a structured format)</li>
                <li>Withdraw consent at any time</li>
              </ul>
            </div>
          </section>

          {/* Cookies */}
          <section className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-4 text-center">Cookies and Tracking Technologies</h2>
            <p className="text-white/70 leading-relaxed text-center max-w-2xl mx-auto">
              We use cookies and similar tracking technologies to track activity on our platform and 
              hold certain information. You can instruct your browser to refuse all cookies or to 
              indicate when a cookie is being sent. However, if you do not accept cookies, you may 
              not be able to use some portions of our platform.
            </p>
          </section>

          {/* Children's Privacy */}
          <section className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-4 text-center">Children's Privacy</h2>
            <p className="text-white/70 leading-relaxed text-center max-w-2xl mx-auto">
              Our platform is not intended for children under the age of 13. We do not knowingly 
              collect personal information from children under 13. If you are a parent or guardian 
              and believe your child has provided us with personal information, please contact us 
              immediately.
            </p>
          </section>

          {/* Changes to Privacy Policy */}
          <section className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-4 text-center">Changes to This Privacy Policy</h2>
            <p className="text-white/70 leading-relaxed text-center max-w-2xl mx-auto">
              We may update our Privacy Policy from time to time. We will notify you of any changes 
              by posting the new Privacy Policy on this page and updating the "Last updated" date. 
              You are advised to review this Privacy Policy periodically for any changes.
            </p>
          </section>

          {/* Contact */}
          <Card className="glass-card border-[#00FFFF]/30 bg-gradient-to-r from-[#00FFFF]/10 to-transparent">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Contact Us</h2>
              <p className="text-white/70 mb-4">
                If you have any questions about this Privacy Policy, please contact us:
              </p>
              <ul className="space-y-2 text-white/70">
                <li>Email: privacy@sportx.com</li>
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

