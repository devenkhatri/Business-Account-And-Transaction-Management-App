'use client';

import { useLocationStore } from '@/store/use-location-store';
import { useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Location } from '@/types';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Accounts', href: '/accounts' },
  { name: 'Transactions', href: '/transactions' },
  { name: 'Reports', href: '/reports' },
  { name: 'Locations', href: '/locations' },
];

export function Header() {
  const { selectedLocationId, setSelectedLocationId } = useLocationStore();
  const [locations, setLocations] = useState<Location[]>([]);
  const pathname = usePathname();

  useEffect(() => {
    fetch('/api/locations')
      .then((res) => res.json())
      .then(setLocations)
      .catch(console.error);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto sm:px-6">
        {/* Mobile menu button */}
        <div className="flex items-center md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="w-5 h-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4 mt-6">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                      pathname === item.href
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* Logo */}
        <div className="flex items-center">
          <Link href="/dashboard" className="text-lg font-semibold text-gray-900">
            Business Manager
          </Link>
        </div>

        {/* Desktop navigation */}
        <nav className="hidden space-x-6 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === item.href ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Location selector */}
        <div className="flex items-center space-x-2">
          <Select
            value={selectedLocationId?.toString() || 'all'}
            onValueChange={(value) =>
              setSelectedLocationId(value === 'all' ? null : parseInt(value))
            }
          >
            <SelectTrigger className="w-[180px] hidden sm:flex">
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {locations.map((location) => (
                <SelectItem key={location.id} value={location.id.toString()}>
                  {location.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </header>
  );
}