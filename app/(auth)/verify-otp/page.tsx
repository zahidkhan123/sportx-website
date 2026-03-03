import { Suspense } from 'react';
import VerifyOTPForm from './VerifyOTPForm';

export default function VerifyOTPPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-black p-4">
          <div className="text-white/70">Loading verification page...</div>
        </div>
      }
    >
      <VerifyOTPForm />
    </Suspense>
  );
}

