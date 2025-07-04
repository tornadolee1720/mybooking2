'use client';

import { useEffect } from 'react';
import { useFormStatus, useFormState } from 'react-dom';
import type { Settings } from '@/lib/types';
import { updateSettingsAction } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Save, Store, Clock, Hourglass, Briefcase } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full mt-4" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
      儲存設定
    </Button>
  );
}

export default function SettingsForm({ settings }: { settings: Settings }) {
  const { toast } = useToast();
  const [state, formAction] = useFormState(updateSettingsAction, undefined);

  useEffect(() => {
    if (state?.message) {
      toast({
        title: state.success ? '成功' : '錯誤',
        description: state.message,
        variant: state.success ? 'default' : 'destructive',
      });
    }
  }, [state, toast]);

  return (
    <form action={formAction} className="space-y-6">
      {state && !state.success && state.message && (
         <Alert variant="destructive">
           <AlertDescription>{state.message}</AlertDescription>
         </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="storeName" className="flex items-center text-base"><Store className="mr-2 h-4 w-4"/>店家名稱</Label>
        <Input id="storeName" name="storeName" defaultValue={settings.storeName} required />
      </div>

      <div className="space-y-4 rounded-lg border p-4">
        <h3 className="text-lg font-medium">預約時段設定</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="startTime" className="flex items-center"><Clock className="mr-2 h-4 w-4"/>開始時間</Label>
                <Input id="startTime" name="startTime" type="time" defaultValue={settings.timeSlots.startTime} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="endTime" className="flex items-center"><Clock className="mr-2 h-4 w-4"/>結束時間</Label>
                <Input id="endTime" name="endTime" type="time" defaultValue={settings.timeSlots.endTime} required />
            </div>
        </div>
        <div className="space-y-2">
            <Label htmlFor="interval" className="flex items-center"><Hourglass className="mr-2 h-4 w-4"/>時間間隔 (分鐘)</Label>
            <Input id="interval" name="interval" type="number" defaultValue={settings.timeSlots.interval} min="5" step="1" required />
            <p className="text-sm text-muted-foreground">每次預約的時長，例如 30 分鐘。</p>
        </div>
      </div>
      
      <div className="space-y-4 rounded-lg border p-4">
        <h3 className="text-lg font-medium flex items-center"><Briefcase className="mr-2 h-5 w-5"/>服務項目設定</h3>
        <div className="space-y-2">
            <Label htmlFor="services">服務列表</Label>
            <Textarea
                id="services"
                name="services"
                defaultValue={settings.services.join('\n')}
                rows={5}
                required
            />
            <p className="text-sm text-muted-foreground">每行輸入一個服務項目。顧客將可以在預約時從這個列表中選擇。</p>
        </div>
      </div>

      <SubmitButton />
    </form>
  );
}
