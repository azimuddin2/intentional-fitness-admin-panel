'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, type LucideIcon } from 'lucide-react';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
      icon: LucideIcon;
    }[];
  }[];
  currentPath: string;
}) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => {
          const isParentActive =
            pathname === item.url ||
            item.items?.some((sub) => pathname === sub.url);

          return (
            <Collapsible key={item.title} defaultOpen={true}>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip={item.title}
                  render={
                    <Link
                      href={item.url}
                      className="mt-1 flex items-center gap-2"
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  }
                  className={cn(
                    'py-5 rounded-sm w-full text-left transition-colors',
                    isParentActive
                      ? 'hover:text-white bg-[#1c3b4a] hover:bg-[#16303c] text-white font-medium'
                      : 'hover:bg-muted text-[#1c3b4a]',
                  )}
                />

                {item.items?.length ? (
                  <>
                    <CollapsibleTrigger
                      render={
                        <SidebarMenuAction
                          className={cn(
                            'transition-transform',
                            isParentActive && 'rotate-90',
                          )}
                        >
                          <ChevronRight />
                          <span className="sr-only">Toggle</span>
                        </SidebarMenuAction>
                      }
                    />
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items.map((subItem) => {
                          const isSubActive = pathname === subItem.url;
                          return (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton
                                render={
                                  <Link
                                    href={subItem.url}
                                    className="flex items-center gap-2"
                                  >
                                    <subItem.icon className="w-4 h-4" />
                                    <span>{subItem.title}</span>
                                  </Link>
                                }
                                className={cn(
                                  isSubActive
                                    ? 'bg-[#f5f5f5] text-[#000000] font-medium'
                                    : 'hover:bg-muted text-muted-foreground',
                                )}
                              />
                            </SidebarMenuSubItem>
                          );
                        })}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </>
                ) : null}
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
