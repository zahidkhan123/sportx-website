'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import GoogleAds from '@/components/GoogleAds';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { toast } from 'sonner';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // In a real application, you would send this to your backend API
      // For now, we'll simulate a successful submission
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      toast.success('Thank you for your message! We\'ll get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex gap-6">
        <div className="flex-1 max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-5xl font-bold text-white mb-4">
              Contact <span className="text-[#00FFFF]">Us</span>
            </h1>
            <p className="text-xl text-white/70">
              Have a question or feedback? We'd love to hear from you!
            </p>
          </div>

          {/* Contact Information Cards */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <Card className="glass-card border-white/10">
              <CardContent className="p-6 text-center">
                <div className="p-3 bg-[#00FFFF]/20 rounded-lg inline-block mb-4">
                  <Mail className="h-6 w-6 text-[#00FFFF]" />
                </div>
                <h3 className="text-white font-semibold mb-2">Email</h3>
                <p className="text-white/70 text-sm">support@sportx.com</p>
              </CardContent>
            </Card>

            <Card className="glass-card border-white/10">
              <CardContent className="p-6 text-center">
                <div className="p-3 bg-[#00FFFF]/20 rounded-lg inline-block mb-4">
                  <Phone className="h-6 w-6 text-[#00FFFF]" />
                </div>
                <h3 className="text-white font-semibold mb-2">Phone</h3>
                <p className="text-white/70 text-sm">+1 (555) 123-4567</p>
              </CardContent>
            </Card>

            <Card className="glass-card border-white/10">
              <CardContent className="p-6 text-center">
                <div className="p-3 bg-[#00FFFF]/20 rounded-lg inline-block mb-4">
                  <MapPin className="h-6 w-6 text-[#00FFFF]" />
                </div>
                <h3 className="text-white font-semibold mb-2">Location</h3>
                <p className="text-white/70 text-sm">Available Worldwide</p>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <Card className="glass-card border-white/10">
            <CardHeader>
              <CardTitle className="text-white text-2xl text-center">Send us a Message</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-white">Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-white">Subject</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
                    placeholder="What's this about?"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message" className="text-white">Message</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
                    placeholder="Your message..."
                    rows={6}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#00FFFF] text-black hover:bg-[#00FFFF]/90"
                >
                  {loading ? (
                    'Sending...'
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Additional Info */}
          <div className="mt-8 p-6 glass-card border-white/10 rounded-lg text-center">
            <h3 className="text-xl font-bold text-white mb-3">Response Time</h3>
            <p className="text-white/70">
              We typically respond within 24-48 hours during business days. For urgent matters, 
              please call our support line.
            </p>
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
