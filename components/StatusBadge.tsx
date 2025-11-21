'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: 'active' | 'pending' | 'suspended' | 'approved' | 'rejected' | 'sold' | 'expired';
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const variants = {
    active: 'bg-[#39FF14]/20 text-[#39FF14] border-[#39FF14]/30',
    pending: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30',
    suspended: 'bg-red-500/20 text-red-500 border-red-500/30',
    approved: 'bg-[#39FF14]/20 text-[#39FF14] border-[#39FF14]/30',
    rejected: 'bg-red-500/20 text-red-500 border-red-500/30',
    sold: 'bg-white/20 text-white border-white/30',
    expired: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  };

  return (
    <Badge className={cn('border', variants[status] || variants.active, className)}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}

