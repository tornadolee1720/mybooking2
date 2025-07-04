'use client';

import { useFormStatus, useFormState } from 'react-dom';
import { loginAction } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, LogIn } from 'lucide-react';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogIn className="mr-2 h-4 w-4" />}
      登入
    </Button>
  );
}

export function LoginForm() {
  const [state, formAction] = useFormState(loginAction, undefined);

  return (
    <form action={formAction} className="space-y-4">
      {state && !state.success && state.message && (
        <Alert variant="destructive">
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}
      <div className="space-y-2">
        <Label htmlFor="username">帳號</Label>
        <Input id="username" name="username" placeholder="admin" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">密碼</Label>
        <Input id="password" name="password" type="password" required />
      </div>
      <SubmitButton />
    </form>
  );
}
