'use client';

import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  UserCog,
  Settings,
  FileCheck,
  Info,
  ShieldCheck,
  UserPen,
  ClipboardCheck,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useAppSelector } from '@/src/redux/hooks';
import { selectCurrentUser } from '@/src/redux/features/auth/authSlice';
import { NavMain } from './nav-main';
import { NavUser } from './nav-user';
import Link from 'next/link';
import logo from '@/src/assets/logo.png';
import Image from 'next/image';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useAppSelector(selectCurrentUser);
  const pathname = usePathname();

  const navMain = [];

  // Admin-only routes
  if (user?.role === 'admin') {
    navMain.push(
      {
        title: 'Dashboard',
        url: `/admin/dashboard`,
        icon: LayoutDashboard,
      },
      {
        title: 'User Management',
        url: `/admin/user-management`,
        icon: UserCog,
      },
      {
        title: 'Survey Management',
        url: `/admin/survey-management`,
        icon: ClipboardCheck,
      },
      {
        title: 'Edit Profile',
        url: `/admin/profile`,
        icon: UserPen,
      },
      {
        title: 'Settings',
        url: '/admin/settings/privacy-policy',
        icon: Settings,
        items: [
          {
            title: 'Privacy Policy',
            url: '/admin/settings/privacy-policy',
            icon: ShieldCheck,
          },
          {
            title: 'Terms & Conditions',
            url: '/admin/settings/terms',
            icon: FileCheck,
          },
          {
            title: 'About Us',
            url: '/admin/settings/about-us',
            icon: Info,
          },
        ],
      },
    );
  }

  return (
    <Sidebar className="h-full" collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="w-full p-10">
              <Link href="/admin/dashboard" className="flex items-center gap-2">
                <Image
                  src={logo}
                  alt="Logo"
                  width={100}
                  height={100}
                  className="w-24"
                />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={navMain} currentPath={pathname} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
