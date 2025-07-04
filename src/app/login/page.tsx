
'use client';

import { useState, useEffect } from 'react';
import { LoginForm } from '@/components/auth/login-form';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Droplet } from 'lucide-react';

function LoginFormSkeleton() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-10 w-full" />
      </div>
      <Skeleton className="h-10 w-full" />
    </div>
  );
}

export default function LoginPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // This effect ensures the form is only rendered on the client,
    // preventing hydration errors from browser extensions.
    setIsClient(true);
    document.title = '管理員登入';
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 p-4">
      <Card className="w-full max-w-sm shadow-xl rounded-lg">
        <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
                <div className="p-3 bg-primary/10 rounded-full">
                    <Droplet className="h-8 w-8 text-primary" />
                </div>
            </div>
          <CardTitle className="text-2xl font-bold text-slate-800">管理員登入</CardTitle>
          <CardDescription>請輸入您的帳號密碼以繼續</CardDescription>
        </CardHeader>
        <CardContent>
          {isClient ? <LoginForm /> : <LoginFormSkeleton />}
        </CardContent>
      </Card>
    </div>
  );
}
