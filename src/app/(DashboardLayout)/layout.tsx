'use client';

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAppDispatch } from '@/src/redux/hooks';
import { logout } from '@/src/redux/features/auth/authSlice';
import Link from 'next/link';
import { Bell, LogOut, UserPen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
// import { useGetAllNotificationsQuery } from '@/redux/features/notification/notificationApi';
import { AppSidebar } from '@/src/components/layout/app-sidebar';
import { useGetUserProfileQuery } from '@/src/redux/features/user/userApi';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  // const user = useAppSelector(selectCurrentUser);
  const { data } = useGetUserProfileQuery();
  const user = data?.data;

  const userId = user?._id;

  //   const { data } = useGetAllNotificationsQuery(
  //     { receiver: userId as string, page: 1, limit: 100 },
  //     {
  //       skip: !userId,
  //       pollingInterval: 3000,
  //       refetchOnMountOrArgChange: true,
  //     },
  //   );

  //   const unreadCount = data?.data?.filter((n) => !n.read).length ?? 0;

  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleLogout = () => {
    // 1. Clear redux user state
    dispatch(logout());

    // 2. Remove cookie from client
    Cookies.remove('dashboardAccessToken');

    router.push('/');
  };

  return (
    <div>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex ps-3 pr-5 lg:pr-10 justify-between h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
            </div>
            <div className="flex justify-center items-center gap-3">
              <Link href={'/admin/notification'}>
                <Button className="relative p-2 rounded-full shadow bg-white hover:bg-gray-100 cursor-pointer">
                  <Bell className="h-12 w-12 text-gray-700" />

                  {/* Notification badge */}
                  <span className="absolute -top-2 left-3 w-5 h-5 bg-[#1c3b4a] text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {'0'}
                  </span>
                </Button>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar className="cursor-pointer w-10 h-10 border-2 border-[#1c3b4a]">
                    <AvatarImage src={user?.image} alt="" />
                    <AvatarFallback className="bg-[#1c3b4a] text-white text-base">
                      {user?.name?.slice(0, 1)}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="rounded-[10px] mt-2 w-80 mr-6 p-3">
                  <div>
                    <Avatar className="mx-auto w-14 h-14">
                      <AvatarImage src={user?.image} />
                      <AvatarFallback className="bg-[#1c3b4a] text-white text-2xl">
                        {user?.name?.slice(0, 1)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-center my-2">
                      <h2 className="text-lg">{user?.name}</h2>
                      <p className="text-sm text-gray-500">{user?.email}</p>
                    </div>
                  </div>
                  <Link href={`/${user?.role}/profile`}>
                    <DropdownMenuItem className="rounded-[5px] cursor-pointe bg-gray-100">
                      <UserPen />
                      <span>Edit Profile</span>
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="rounded-[5px] text-white bg-red-500 cursor-pointer mt-2"
                  >
                    <LogOut className="text-white" />
                    <span>Log Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          <div className="min-h-[100vh] bg-[#f6f6f6] flex-1 rounded md:min-h-min p-3 lg:p-8 lg:m-2 mt-0">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
};

export default DashboardLayout;
