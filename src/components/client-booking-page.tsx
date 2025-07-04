'use client';

import { useState, useEffect } from 'react';
import BookingPage from '@/components/booking-page';
import type { Settings } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

function BookingPageSkeleton() {
  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <Card className="overflow-hidden shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="p-6 md:border-r">
            <div className="p-0 mb-4 space-y-2">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-5 w-full" />
            </div>
            <Skeleton className="h-[290px] w-full rounded-md" />
          </div>
          <div className="p-6">
            <div className="space-y-6">
              <div>
                <Skeleton className="h-5 w-1/2 mb-2" />
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {[...Array(12)].map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full" />
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-5 w-1/4" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>
              
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default function ClientBookingPage({ settings }: { settings: Settings }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <BookingPageSkeleton />;
  }

  return <BookingPage settings={settings} />;
}
