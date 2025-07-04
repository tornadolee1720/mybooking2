import Link from 'next/link';
import { Droplet } from 'lucide-react';
import { getSettings } from '@/lib/data';

export default async function Header() {
  const { storeName } = await getSettings();
  return (
    <header className="border-b bg-card">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3 font-bold text-primary">
          <Droplet className="h-7 w-7" />
          <span className="font-headline text-2xl font-semibold tracking-tight">{storeName}</span>
        </Link>
        <nav className="flex items-center gap-4 sm:gap-6">
          <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
            預約
          </Link>
          <Link href="/admin" className="text-sm font-medium transition-colors hover:text-primary">
            管理
          </Link>
        </nav>
      </div>
    </header>
  );
}
