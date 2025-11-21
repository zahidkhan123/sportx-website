import GoogleAds from '@/components/GoogleAds';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Target, Zap, Shield } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex gap-6">
        <div className="flex-1 max-w-3xl mx-auto">
          {/* Hero Section */}
          <div className="mb-12 text-center">
            <h1 className="text-5xl font-bold text-white mb-4">
              About <span className="text-[#00FFFF]">Sport</span>X
            </h1>
            <p className="text-xl text-white/70">
              Your ultimate sports marketplace connecting athletes, teams, and sports enthusiasts
            </p>
          </div>

          {/* Main Content */}
          <div className="space-y-8 text-white/70">
            <section>
              <h2 className="text-3xl font-bold text-white mb-4 text-center">Who We Are</h2>
              <p className="mb-4 text-left max-w-2xl mx-auto">
                SportX is a comprehensive sports marketplace platform designed to bring together athletes, 
                teams, coaches, and sports enthusiasts in one vibrant community. Whether you're looking 
                to buy or sell sports equipment, join a team, organize a tournament, or find coaching 
                opportunities, SportX makes it easy to discover and connect with sports opportunities 
                around you.
            </p>
            <p className="text-left max-w-2xl mx-auto">
                Founded with a passion for sports and community building, SportX aims to break down 
                barriers and make sports more accessible to everyone. We believe that sports have the 
                power to unite people, build character, and create lasting friendships.
              </p>
            </section>

            {/* Values Grid */}
            <section>
              <h2 className="text-3xl font-bold text-white mb-6 text-center">Our Values</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <Card className="glass-card border-white/10">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-[#00FFFF]/20 rounded-lg">
                        <Target className="h-6 w-6 text-[#00FFFF]" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">Community First</h3>
                        <p className="text-white/70">
                          We prioritize building a strong, supportive sports community where everyone 
                          feels welcome and valued.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-card border-white/10">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-[#00FFFF]/20 rounded-lg">
                        <Zap className="h-6 w-6 text-[#00FFFF]" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">Innovation</h3>
                        <p className="text-white/70">
                          We continuously improve our platform with cutting-edge features to enhance 
                          your sports experience.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-card border-white/10">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-[#00FFFF]/20 rounded-lg">
                        <Shield className="h-6 w-6 text-[#00FFFF]" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">Trust & Safety</h3>
                        <p className="text-white/70">
                          We maintain the highest standards of security and verification to ensure a 
                          safe marketplace for all users.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-card border-white/10">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-[#00FFFF]/20 rounded-lg">
                        <Users className="h-6 w-6 text-[#00FFFF]" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">Accessibility</h3>
                        <p className="text-white/70">
                          We believe sports should be accessible to everyone, regardless of skill level, 
                          background, or location.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Mission Section */}
            <section>
              <h2 className="text-3xl font-bold text-white mb-4 text-center">Our Mission</h2>
              <p className="mb-4 text-left max-w-2xl mx-auto">
                To create a vibrant, inclusive sports community where athletes, teams, and enthusiasts 
                can easily discover, connect, and engage with sports opportunities. We're committed to 
                making sports more accessible and helping people find their perfect match in the world 
                of sports.
              </p>
            </section>

            {/* Vision Section */}
            <section>
              <h2 className="text-3xl font-bold text-white mb-4 text-center">Our Vision</h2>
              <p className="text-left max-w-2xl mx-auto">
                To become the leading sports marketplace platform that connects millions of sports 
                enthusiasts worldwide, fostering a global community where everyone can pursue their 
                passion for sports, find opportunities, and build lasting connections.
              </p>
            </section>

            {/* What We Offer */}
            <section>
              <h2 className="text-3xl font-bold text-white mb-4 text-center">What We Offer</h2>
              <ul className="space-y-3 list-disc list-inside text-left max-w-2xl mx-auto">
                <li>
                  <strong className="text-white">Marketplace:</strong> Buy and sell sports equipment 
                  with ease. Browse through verified listings from trusted sellers.
                </li>
                <li>
                  <strong className="text-white">Sports Listings:</strong> Find players, teams, 
                  tournaments, coaches, and more. Connect with opportunities that match your interests.
                </li>
                <li>
                  <strong className="text-white">Community:</strong> Join a thriving community of 
                  sports enthusiasts. Share experiences, get advice, and make connections.
                </li>
                <li>
                  <strong className="text-white">Verification:</strong> Get verified as a trusted 
                  member of the community. Build credibility and stand out from the crowd.
                </li>
              </ul>
            </section>

            {/* Join Us Section */}
            <section className="pt-8">
              <Card className="glass-card border-[#00FFFF]/30 bg-gradient-to-r from-[#00FFFF]/10 to-transparent">
                <CardContent className="p-8 text-center">
                  <h2 className="text-3xl font-bold text-white mb-4">Join the SportX Community</h2>
                  <p className="text-white/70 mb-6 text-lg">
                    Whether you're a professional athlete, weekend warrior, or just getting started, 
                    SportX is here to help you on your sports journey.
                  </p>
                  <div className="flex gap-4 justify-center">
                    <a
                      href="/signup"
                      className="px-6 py-3 bg-[#00FFFF] text-black font-semibold rounded-lg hover:bg-[#00FFFF]/90 transition-colors"
                    >
                      Get Started
                    </a>
                    <a
                      href="/contact"
                      className="px-6 py-3 border border-white/20 text-white font-semibold rounded-lg hover:bg-white/5 transition-colors"
                    >
                      Contact Us
                    </a>
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>
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
