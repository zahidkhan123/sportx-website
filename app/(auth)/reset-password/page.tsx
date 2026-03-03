import { Suspense } from 'react';
import ResetPasswordForm from './ResetPasswordForm';

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-black p-4">
        <div className="text-white/70">Loading reset password page...</div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}

