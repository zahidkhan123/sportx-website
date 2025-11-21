'use client';

import { Search, Inbox } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: 'search' | 'inbox';
}

export function EmptyState({ title, description, icon = 'inbox' }: EmptyStateProps) {
  const Icon = icon === 'search' ? Search : Inbox;

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-white/5 p-6 mb-4">
        <Icon className="h-12 w-12 text-white/50" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-white/70 max-w-md">{description}</p>
    </div>
  );
}

