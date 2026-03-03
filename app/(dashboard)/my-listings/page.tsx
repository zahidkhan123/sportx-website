'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { marketplaceAPI } from '@/lib/api';
import { ListingCard } from '@/components/ListingCard';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit, Trash2, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { EmptyState } from '@/components/EmptyState';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

export default function MyListingsPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'sold' | 'expired'>('all');
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; adId: string | null }>({
    open: false,
    adId: null,
  });
  const queryClient = useQueryClient();

  const { data: adsData, isLoading } = useQuery({
    queryKey: ['my-marketplace-ads', activeTab],
    queryFn: () => {
      if (activeTab === 'all') {
        return marketplaceAPI.getUserAds();
      }
      return marketplaceAPI.getUserAds(activeTab);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => marketplaceAPI.delete(id),
    onSuccess: () => {
      toast.success('Ad deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['my-marketplace-ads'] });
      setDeleteDialog({ open: false, adId: null });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete ad');
    },
  });

  const markSoldMutation = useMutation({
    mutationFn: (id: string) => marketplaceAPI.markAsSold(id),
    onSuccess: () => {
      toast.success('Ad marked as sold');
      queryClient.invalidateQueries({ queryKey: ['my-marketplace-ads'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to mark as sold');
    },
  });

  const ads = adsData?.data || [];

  const activeAds = ads.filter((ad: any) => ad.status === 'active');
  const soldAds = ads.filter((ad: any) => ad.status === 'sold');
  const expiredAds = ads.filter((ad: any) => {
    return ad.status === 'expired' || (ad.featuredUntil && new Date(ad.featuredUntil) < new Date());
  });

  const handleDelete = () => {
    if (deleteDialog.adId) {
      deleteMutation.mutate(deleteDialog.adId);
    }
  };

  const handleMarkAsSold = (id: string) => {
    markSoldMutation.mutate(id);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">My Marketplace Ads</h1>
          <p className="text-white/70">Manage your marketplace listings</p>
        </div>
        <Link href="/add-listing">
          <Button className="bg-[#00FFFF] text-black hover:bg-[#00FFFF]/90">
            <Plus className="h-4 w-4 mr-2" />
            Create New Ad
          </Button>
        </Link>
      </div>

      <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-white/5 border-white/10">
          <TabsTrigger value="all" className="text-white data-[state=active]:text-[#00FFFF]">
            All ({ads.length})
          </TabsTrigger>
          <TabsTrigger value="active" className="text-white data-[state=active]:text-[#00FFFF]">
            Active ({activeAds.length})
          </TabsTrigger>
          <TabsTrigger value="sold" className="text-white data-[state=active]:text-[#00FFFF]">
            Sold ({soldAds.length})
          </TabsTrigger>
          <TabsTrigger value="expired" className="text-white data-[state=active]:text-[#00FFFF]">
            Expired ({expiredAds.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <AdsList ads={ads} onDelete={(id) => setDeleteDialog({ open: true, adId: id })} onMarkSold={handleMarkAsSold} isLoading={isLoading} />
        </TabsContent>

        <TabsContent value="active" className="mt-6">
          <AdsList ads={activeAds} onDelete={(id) => setDeleteDialog({ open: true, adId: id })} onMarkSold={handleMarkAsSold} isLoading={isLoading} />
        </TabsContent>

        <TabsContent value="sold" className="mt-6">
          <AdsList ads={soldAds} onDelete={(id) => setDeleteDialog({ open: true, adId: id })} onMarkSold={handleMarkAsSold} isLoading={isLoading} />
        </TabsContent>

        <TabsContent value="expired" className="mt-6">
          <AdsList ads={expiredAds} onDelete={(id) => setDeleteDialog({ open: true, adId: id })} onMarkSold={handleMarkAsSold} isLoading={isLoading} />
        </TabsContent>
      </Tabs>

      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, adId: null })}>
        <DialogContent className="bg-black border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Delete Ad</DialogTitle>
            <DialogDescription className="text-white/70">
              Are you sure you want to delete this ad? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialog({ open: false, adId: null })}
              className="border-white/10 text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="bg-red-500/20 text-red-500 hover:bg-red-500/30 border border-red-500/30"
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function AdsList({ ads, onDelete, onMarkSold, isLoading }: { ads: any[]; onDelete: (id: string) => void; onMarkSold: (id: string) => void; isLoading: boolean }) {
  if (isLoading) {
    return <div className="text-center py-12 text-white/70">Loading...</div>;
  }

  if (ads.length === 0) {
    return <EmptyState title="No ads found" description="You don't have any ads in this category." icon="inbox" />;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {ads.map((ad: any) => (
        <Card key={ad._id} className="glass-card border-white/10 hover:border-[#00FFFF]/50 transition-all">
          <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
            {ad.images?.[0] ? (
              <img
                src={ad.images[0]}
                alt={ad.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-[#00FFFF]/20 to-[#39FF14]/20 flex items-center justify-center">
                <span className="text-white/50 text-sm">No Image</span>
              </div>
            )}
            <div className="absolute top-2 right-2">
              <StatusBadge status={ad.status} />
            </div>
          </div>
          <CardContent className="p-4">
            <h3 className="font-semibold text-white mb-2 line-clamp-2">{ad.title}</h3>
            <div className="flex items-center justify-between text-sm text-white/70 mb-4">
              <span>{ad.location}</span>
              <span className="font-semibold text-[#39FF14]">Rs. {ad.price}</span>
            </div>
            <div className="flex items-center gap-2">
              {ad.status === 'active' && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onMarkSold(ad._id)}
                  className="flex-1 border-white/10 text-white hover:bg-white/5"
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Mark Sold
                </Button>
              )}
              <Link href={`/marketplace/${ad._id}/edit`} className="flex-1">
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full border-white/10 text-white hover:bg-white/5"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              </Link>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onDelete(ad._id)}
                className="border-red-500/30 text-red-500 hover:bg-red-500/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

