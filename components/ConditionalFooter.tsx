'use client';

import { usePathname } from 'next/navigation';
import { Footer } from '@/components/Footer';

export function ConditionalFooter() {
  const pathname = usePathname();
  const isMessages = pathname === '/chats' || pathname.startsWith('/chats/');
  if (isMessages) return null;
  return <Footer />;
}
