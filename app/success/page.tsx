'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

type Status = 'verifying' | 'paid' | 'failed';

function SuccessContent() {
  const params = useSearchParams();
  const reference = params.get('reference');
  const [status, setStatus] = useState<Status>('verifying');
  const [attempts, setAttempts] = useState(0);

  // Poll /api/notify up to 3 times if it initially fails
  useEffect(() => {
    if (!reference) {
      setStatus('failed');
      return;
    }

    let cancelled = false;
    let tries = 0;
    const maxTries = 3;

    const tryVerify = async () => {
      tries += 1;
      setAttempts(tries);

      try {
        const res = await fetch('/api/notify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reference }),
        });
        const data = await res.json();

        if (data.status === 'paid') {
          if (!cancelled) setStatus('paid');
          return;
        }

        // Not paid yet — retry up to maxTries, then give up gracefully
        if (tries < maxTries) {
          setTimeout(tryVerify, 3000);
        } else {
          if (!cancelled) setStatus('failed');
        }
      } catch {
        if (tries < maxTries) {
          setTimeout(tryVerify, 3000);
        } else {
          if (!cancelled) setStatus('failed');
        }
      }
    };

    tryVerify();

    return () => {
      cancelled = true;
    };
  }, [reference]);

  // Warn user if they try to close the tab while verifying
  useEffect(() => {
    if (status !== 'verifying') return;

    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [status]);

  return (
    <main className="min-h-screen bg-[#f9f7f3] py-16 px-4 flex items-center justify-center">
      <div className="bg-white max-w-lg w-full rounded-2xl p-10 shadow-lg text-center">
        {status === 'verifying' && (
          <>
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
            </div>

            <h1 className="text-2xl font-bold text-green-900 mb-2">
              Confirming your payment...
            </h1>

            <p className="text-gray-600 mb-2">
              Please <b>hold on</b> — do not close this page.
            </p>

            <p className="text-sm text-gray-400 mb-8">
              This usually takes a few seconds.
              {attempts > 1 && ` (Attempt ${attempts} of 3)`}
            </p>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-sm text-orange-800">
               If you close this page now, we may not be able to
              automatically confirm your registration.
            </div>
          </>
        )}

        {status === 'paid' && (
          <>
            <div className="text-6xl mb-4"></div>
            <h1 className="text-2xl font-bold text-green-900 mb-2">
              Payment received
            </h1>
            <p className="text-gray-600 mb-6">
              Thank you for registering for <b>BLC 2.0</b>.
            </p>

            {reference && (
              <div className="bg-gray-50 rounded-xl p-4 text-left mb-8">
                <p className="text-xs text-gray-500 mb-1">Your reference</p>
                <p className="text-sm font-mono text-gray-800 break-all">
                  {reference}
                </p>
              </div>
            )}

            <a
              href="https://theblc.wuaze.com/?i=1#tickets"
              className="block w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 rounded-lg transition-colors mb-3"
            >
              Continue to BLC 2.0 →
            </a>

            <p className="text-xs text-gray-400">
              A confirmation has also been sent to your email.
            </p>
          </>
        )}

        {status === 'failed' && (
          <>
            <div className="text-6xl mb-4"></div>
            <h1 className="text-2xl font-bold text-green-900 mb-2">
              Payment is being processed
            </h1>
            <p className="text-gray-600 mb-6">
              Your payment was received but confirmation is taking a bit
              longer than usual. Don&apos;t worry — you will receive a
              confirmation email shortly.
            </p>

            {reference && (
              <div className="bg-gray-50 rounded-xl p-4 text-left mb-8">
                <p className="text-xs text-gray-500 mb-1">Your reference</p>
                <p className="text-sm font-mono text-gray-800 break-all">
                  {reference}
                </p>
                <p className="text-xs text-gray-500 mt-3">
                  Keep this reference. If you don&apos;t hear from us within 24
                  hours, contact us with this number.
                </p>
              </div>
            )}

            <a
              href="https://theblc.wuaze.com/?i=1#tickets"
              className="block w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 rounded-lg transition-colors mb-3"
            >
              Continue to BLC 2.0 →
            </a>
          </>
        )}
      </div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
        </main>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}