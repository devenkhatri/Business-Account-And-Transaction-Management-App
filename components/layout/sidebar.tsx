'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  CreditCard,
  Users,
  MapPin,
  FileText,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { useMediaQuery } from '@/hooks/use-media-query';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Transactions', href: '/transactions', icon: CreditCard },
  { name: 'Accounts', href: '/accounts', icon: Users },
  { name: 'Locations', href: '/locations', icon: MapPin },
  { name: 'Reports', href: '/reports', icon: FileText },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Close sidebar when navigating on mobile
  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    }
  }, [pathname, isMobile]);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    if (!isMobile) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const sidebar = document.querySelector('.sidebar-container');
      const menuButton = document.querySelector('.mobile-menu-button');
      
      if (
        sidebar && 
        !sidebar.contains(target) && 
        menuButton && 
        !menuButton.contains(target) &&
        isOpen
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile, isOpen]);

  // Toggle sidebar open/closed
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Sidebar content component
  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-gray-900">
      <div className="flex h-16 items-center justify-between px-6">
        <h2 className="text-xl font-bold text-white">Business Manager</h2>
        {isMobile && (
          <button
            onClick={toggleSidebar}
            className="rounded-md p-1 text-gray-300 hover:bg-gray-700 hover:text-white focus:outline-none"
          >
            <X className="h-6 w-6" />
          </button>
        )}
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'group flex items-center rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                'focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500'
              )}
            >
              <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
              <span className="truncate">{item.name}</span>
            </Link>
          );
        })}
      </nav>
      <div className="px-3 py-4">
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-300 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-inset focus:ring-blue-500"
          onClick={() => signOut({ callbackUrl: '/login' })}
        >
          <LogOut className="mr-3 h-5 w-5 flex-shrink-0" />
          <span className="truncate">Logout</span>
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile menu button */}
      <button
        type="button"
        onClick={toggleSidebar}
        className="fixed bottom-4 left-4 z-40 rounded-full bg-gray-900 p-3 text-white shadow-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 md:hidden"
        aria-label="Open sidebar"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Sidebar for desktop */}
      <div className="hidden h-full w-64 flex-col bg-gray-900 md:flex">
        <SidebarContent />
      </div>

      {/* Mobile sidebar overlay */}
      {isMobile && (
        <>
          {/* Overlay */}
          {isOpen && (
            <div 
              className="fixed inset-0 z-40 bg-black/50 transition-opacity"
              onClick={() => setIsOpen(false)}
            />
          )}
          
          {/* Mobile sidebar */}
          <div
            className={cn(
              'fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out',
              isOpen ? 'translate-x-0' : '-translate-x-full',
              'md:hidden'
            )}
          >
            <SidebarContent />
          </div>
        </>
      )}
    </>
  );
}