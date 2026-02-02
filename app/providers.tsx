'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { LocationProvider } from '@/contexts/LocationContext';
import { ChatUnreadProvider } from '@/contexts/ChatUnreadContext';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
            // Do not retry on 429 (Too Many Requests) to avoid hammering the API
            retry: (failureCount, error: unknown) => {
              const status = (error as { response?: { status?: number } })?.response?.status;
              if (status === 429) return false;
              return failureCount < 3;
            },
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <LocationProvider>
        <ChatUnreadProvider>
          {children}
        </ChatUnreadProvider>
      </LocationProvider>
    </QueryClientProvider>
  );
}

