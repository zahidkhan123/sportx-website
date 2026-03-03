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
              Terms & <span className="text-[#00FFFF]">Conditions</span>
            </h1>
            <p className="text-white/70">
              Last updated: February 2025
            </p>
          </div>

          {/* Introduction */}
          <section className="mb-8">
            <p className="text-white/70 leading-relaxed text-center max-w-2xl mx-auto">
              These Terms & Conditions (&quot;Terms&quot;) govern your access to and use of the SportX360 mobile application and related services (&quot;Services&quot;) operated by SportX360 (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;). This app is intended for users in Pakistan. By accessing or using the SportX360 app, you agree to be bound by these Terms. If you do not agree, do not use our Services.
            </p>
          </section>

          {/* 1. Acceptance of Terms */}
          <section className="mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <CheckCircle className="h-6 w-6 text-[#00FFFF]" />
              <h2 className="text-3xl font-bold text-white">1. Acceptance of Terms</h2>
            </div>
            <p className="text-white/70 leading-relaxed text-left max-w-2xl mx-auto">
              By creating an account, accessing, or using the SportX360 app and Services (including listings, marketplace, and communications), you agree to be bound by these Terms and our Privacy Policy. If you are using the Services on behalf of an organization, you represent that you have authority to bind that organization to these Terms.
            </p>
          </section>

          {/* 2. Use License */}
          <section className="mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <FileText className="h-6 w-6 text-[#00FFFF]" />
              <h2 className="text-3xl font-bold text-white">2. Use License</h2>
            </div>
            <div className="space-y-2 text-white/70 text-left max-w-2xl mx-auto">
              <p>
                We grant you a limited, non-exclusive, non-transferable, revocable license to use the SportX360 app for personal or commercial use in accordance with these Terms. You may not copy, modify, distribute, reverse-engineer, or create derivative works of the app or its content without our prior written permission.
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Use the app only for lawful purposes and in compliance with applicable laws</li>
                <li>Do not reverse-engineer or attempt to extract source code or underlying data</li>
                <li>Respect intellectual property rights of SportX360 and third parties</li>
              </ul>
            </div>
          </section>

          {/* 3. User Accounts */}
          <section className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-4 text-center">3. User Accounts</h2>
            <p className="text-white/70 leading-relaxed text-left max-w-2xl mx-auto">
              You are responsible for maintaining the confidentiality of your account credentials and for all activity under your account. You agree to provide accurate and complete information and to notify us promptly of any unauthorized use. We reserve the right to suspend or terminate accounts that violate these Terms or that we reasonably believe pose a risk to the Services or other users.
            </p>
          </section>

          {/* 4. Listings & Marketplace */}
          <section className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-4 text-center">4. Listings & Marketplace</h2>
            <div className="space-y-4 text-white/70 text-left max-w-2xl mx-auto">
              <p>
                Listings (players, teams, tournaments, grounds, officials) and marketplace ads (buy/sell gear) posted through the app are subject to our applicable policies. You represent that you have the right to post listings or ads and that the information you provide is accurate. You are responsible for the condition and accuracy of your listings and ads. We may remove or reject content that violates our policies or applicable law in Pakistan.
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Accurate description of listings, ads, and pricing</li>
                <li>Compliance with laws and regulations in Pakistan</li>
              </ul>
              <p>
                We do not process, facilitate, or take responsibility for any payments between users. Any payment or transaction you conduct with another user (e.g. for marketplace items) is at your own risk. We are not liable for disputes, fraud, non-payment, or any loss arising from such transactions. You deal with other users at your own risk.
              </p>
            </div>
          </section>

          {/* 5. Prohibited Uses */}
          <section className="mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <AlertCircle className="h-6 w-6 text-[#00FFFF]" />
              <h2 className="text-3xl font-bold text-white">5. Prohibited Uses</h2>
            </div>
            <div className="space-y-2 text-white/70 text-left max-w-2xl mx-auto">
              <p>
                You may not use the SportX360 app to harass others, post false or misleading content, circumvent security measures, or engage in illegal or harmful activity. We have a zero-tolerance policy for hate speech, threats, promotion of violence, or other abusive or illegal behavior. We may suspend or terminate access for violations.
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>No spam, fraud, abuse, or impersonation</li>
                <li>No hate speech, discrimination, or harassment</li>
                <li>No threats, promotion of violence, or self-harm content</li>
                <li>No illegal content, including criminal activity or exploitation</li>
                <li>No false or misleading information in listings or marketplace</li>
                <li>No misuse of other users&apos; data or the Services</li>
              </ul>
            </div>
          </section>

          {/* 6. Limitation of Liability */}
          <section className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-4 text-center">6. Limitation of Liability</h2>
            <p className="text-white/70 leading-relaxed text-left max-w-2xl mx-auto">
              To the maximum extent permitted by applicable law in Pakistan, SportX360 and its affiliates, officers, directors, employees, and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages (including loss of data, revenue, or profits) arising from your use of or inability to use the Services, or from any payment or transaction between you and other users—all such transactions are at your own risk. Our total liability shall not exceed the amount you paid us, if any, in the twelve (12) months preceding the claim. Where the law of Pakistan does not allow certain limitations, our liability will be limited to the fullest extent permitted by law.
            </p>
          </section>

          {/* 7. Disclaimer of Warranties */}
          <section className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-4 text-center">7. Disclaimer of Warranties</h2>
            <p className="text-white/70 leading-relaxed text-left max-w-2xl mx-auto">
              The Services are provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind, either express or implied. We do not warrant that the Services will be uninterrupted, error-free, or free of harmful components. Your use of the Services is at your sole risk.
            </p>
          </section>

          {/* 8. Changes to Terms */}
          <section className="mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <XCircle className="h-6 w-6 text-[#00FFFF]" />
              <h2 className="text-3xl font-bold text-white">8. Changes to Terms</h2>
            </div>
            <p className="text-white/70 leading-relaxed text-left max-w-2xl mx-auto">
              We may update these Terms from time to time. We will notify you of material changes via the app, email, or other reasonable means. Continued use of the Services after changes constitutes acceptance of the revised Terms. If you do not agree, you must stop using the Services and may close your account.
            </p>
          </section>

          {/* 9. Governing Law & Disputes */}
          <section className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-4 text-center">9. Governing Law & Disputes</h2>
            <p className="text-white/70 leading-relaxed text-left max-w-2xl mx-auto">
              These Terms are governed by the laws of Pakistan. Any disputes arising from these Terms or the Services shall be subject to the exclusive jurisdiction of the courts of Pakistan.
            </p>
          </section>

          {/* 10. Contact Information */}
          <Card className="glass-card border-[#00FFFF]/30 bg-gradient-to-r from-[#00FFFF]/10 to-transparent">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-white mb-4">10. Contact Information</h2>
              <p className="text-white/70 mb-4">
                For questions about these Terms & Conditions, please contact us at support@sportx360.com or at the contact details provided within the SportX360 app.
              </p>
              <ul className="space-y-2 text-white/70">
                <li>Email: support@sportx360.com</li>
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
