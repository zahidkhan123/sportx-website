'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { marketplaceAPI, formSchemaAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import GoogleAds from '@/components/GoogleAds';

export default function AddListingPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    images: [''] as string[],
    price: '',
    category: '',
    condition: 'New' as 'New' | 'Used',
    location: '',
    contactNumber: '',
    isFeatured: false,
  });

  const { data: categories } = useQuery({
    queryKey: ['marketplace-categories'],
    queryFn: () => marketplaceAPI.getCategories(),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => marketplaceAPI.create(data),
    onSuccess: () => {
      toast.success('Ad created successfully!');
      queryClient.invalidateQueries({ queryKey: ['my-marketplace-ads'] });
      router.push('/my-listings');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create ad');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.title || formData.title.trim() === '') {
      toast.error('Title is required');
      return;
    }

    if (!formData.description || formData.description.trim() === '') {
      toast.error('Description is required');
      return;
    }

    if (!formData.images[0] || formData.images[0].trim() === '') {
      toast.error('Please add at least one image URL');
      return;
    }

    if (!formData.price || formData.price.trim() === '' || Number(formData.price) < 0) {
      toast.error('Please enter a valid price');
      return;
    }

    if (!formData.category || formData.category.trim() === '') {
      toast.error('Please select a category');
      return;
    }

    if (!formData.location || formData.location.trim() === '') {
      toast.error('Location is required');
      return;
    }

    if (!formData.contactNumber || formData.contactNumber.trim() === '') {
      toast.error('Contact number is required');
      return;
    }

    createMutation.mutate({
      ...formData,
      price: Number(formData.price),
      images: formData.images.filter(img => img.trim() !== ''),
    });
  };

  const addImageField = () => {
    if (formData.images.length < 6) {
      setFormData({ ...formData, images: [...formData.images, ''] });
    }
  };

  const removeImageField = (index: number) => {
    if (formData.images.length > 1) {
      setFormData({
        ...formData,
        images: formData.images.filter((_, i) => i !== index),
      });
    }
  };

  const updateImage = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData({ ...formData, images: newImages });
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex gap-6">
          {/* Left Vertical Ad Sidebar */}
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

          {/* Main Form Content */}
          <div className="flex-1">
            <Link href="/my-listings" className="inline-flex items-center text-white/70 hover:text-white mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to My Listings
            </Link>

            <Card className="glass-card border-white/10">
              <CardHeader className="border-b border-white/10">
                <CardTitle className="text-3xl font-bold text-white">Create New Marketplace Ad</CardTitle>
                <p className="text-white/70 mt-2">
                  List your sports equipment or items for sale
                </p>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information Section */}
            <div className="space-y-6 pb-6 border-b border-white/10">
              <h3 className="text-xl font-semibold text-white mb-4">
                Basic Information
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-white text-sm font-medium">
                    Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    maxLength={100}
                    className="bg-white/5 border-white/10 text-white h-11"
                    placeholder="e.g., Professional Cricket Bat"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-white text-sm font-medium">
                    Description <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    maxLength={2000}
                    rows={5}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/40 resize-none"
                    placeholder="Describe your item in detail..."
                  />
                </div>
              </div>
            </div>

            {/* Images Section */}
            <div className="space-y-4 pb-6 border-b border-white/10">
              <h3 className="text-xl font-semibold text-white mb-4">
                Images
              </h3>
              <div className="space-y-3">
                <Label className="text-white text-sm font-medium">
                  Image URLs <span className="text-red-500">*</span> (1-6 images)
                </Label>
                {formData.images.map((image, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      type="url"
                      value={image}
                      onChange={(e) => updateImage(index, e.target.value)}
                      placeholder={`Image URL ${index + 1}`}
                      className="bg-white/5 border-white/10 text-white h-11"
                    />
                    {formData.images.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => removeImageField(index)}
                        className="border-red-500/30 text-red-500 hover:bg-red-500/10 h-11"
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                ))}
                {formData.images.length < 6 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addImageField}
                    className="border-white/10 text-white hover:bg-white/5 h-11"
                  >
                    + Add Another Image
                  </Button>
                )}
              </div>
            </div>

            {/* Pricing & Details Section */}
            <div className="space-y-6 pb-6 border-b border-white/10">
              <h3 className="text-xl font-semibold text-white mb-4">
                Pricing & Details
              </h3>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-white text-sm font-medium">
                    Price (Rs) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    min="0"
                    className="bg-white/5 border-white/10 text-white h-11"
                    placeholder="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category" className="text-white text-sm font-medium">
                    Category <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white h-11">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-white/10">
                      {categories?.data?.map((cat: any) => (
                        <SelectItem key={cat.value} value={cat.value} className="text-white">
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="condition" className="text-white text-sm font-medium">
                    Condition <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.condition} onValueChange={(value: any) => setFormData({ ...formData, condition: value })}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-white/10">
                      <SelectItem value="New" className="text-white">New</SelectItem>
                      <SelectItem value="Used" className="text-white">Used</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location" className="text-white text-sm font-medium">
                    Location <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                    className="bg-white/5 border-white/10 text-white h-11"
                    placeholder="e.g., Lahore, Pakistan"
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-6 pb-6 border-b border-white/10">
              <h3 className="text-xl font-semibold text-white mb-4">
                Contact Information
              </h3>
              <div className="space-y-2">
                <Label htmlFor="contactNumber" className="text-white text-sm font-medium">
                  Contact Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="contactNumber"
                  value={formData.contactNumber}
                  onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                  required
                  className="bg-white/5 border-white/10 text-white h-11"
                  placeholder="+92 300 1234567"
                />
              </div>
            </div>

            {/* Featured Option */}
            <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-white/10">
              <input
                type="checkbox"
                id="isFeatured"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="w-5 h-5 rounded accent-[#00FFA3]"
              />
              <Label htmlFor="isFeatured" className="text-white cursor-pointer">
                Make this a featured ad (premium)
              </Label>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                disabled={createMutation.isPending}
                className="w-full bg-[#00FFFF] text-black hover:bg-[#00FFFF]/90 h-12 text-lg font-semibold"
              >
                {createMutation.isPending ? 'Creating Ad...' : 'Create Ad'}
              </Button>
            </div>
          </form>
              </CardContent>
            </Card>
          </div>

          {/* Right Vertical Ad Sidebar */}
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
    </div>
  );
}

