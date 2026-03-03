import { Navbar } from '@/components/Navbar';
import { ConditionalFooter } from '@/components/ConditionalFooter';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-black">
      <Navbar />
      <main className="flex-1 flex flex-col min-h-0">{children}</main>
      <ConditionalFooter />
    </div>
  );
}

