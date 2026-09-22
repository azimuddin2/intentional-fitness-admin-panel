'use client';

import { ColumnDef } from '@tanstack/react-table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Eye,
  Search,
  ShieldBan,
  ShieldCheck,
  UserRoundCheck,
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import {
  useChangeUserStatusMutation,
  useGetAllUsersQuery,
  useReactivateUserAccountMutation,
} from '@/src/redux/features/user/userApi';
import UserViewModal from './user-view-modal';
import BlockUserModal from './block-user-modal';
import { toast } from 'sonner';
import { IUser, TStatus } from '@/src/types/user.type';
import Spinner from '@/src/components/shared/Spinner';
import { ADTable } from '@/src/components/modules/IFTable';
import ADPagination from '@/src/components/modules/IFPagination';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ReactivateUserModal from './reactivate-user-modal';

const UserManagement = () => {
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [blockModalUser, setBlockModalUser] = useState<IUser | null>(null);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);

  const [reactivateUser, setReactivateUser] = useState<IUser | null>(null);
  const [isReactivateModalOpen, setIsReactivateModalOpen] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();

  const [search, setSearch] = useState<string>(
    searchParams.get('searchTerm') || '',
  );
  const initialDateParam = searchParams.get('createdAt');
  const initialDate = initialDateParam ? parseISO(initialDateParam) : undefined;
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    initialDate,
  );

  const page = searchParams.get('page') || 1;
  const limit = searchParams.get('limit') || 20;
  const searchTerm = searchParams.get('searchTerm') || '';
  const createdAt = searchParams.get('createdAt') || '';

  const { data, isLoading, refetch } = useGetAllUsersQuery({
    page,
    limit,
    query: {
      searchTerm,
      createdAt,
    },
  });

  const users = data?.data || [];
  const meta = data?.meta;
  const totalPage = meta?.totalPage || 1;

  // search & createdAt date filtering part
  const updateSearchParams = useCallback(
    (newParams: Record<string, string | null | undefined>) => {
      const currentParams = new URLSearchParams(searchParams.toString());
      Object.entries(newParams).forEach(([key, value]) => {
        if (!value) {
          currentParams.delete(key);
        } else {
          currentParams.set(key, value);
        }
      });
      router.push(`?${currentParams.toString()}`);
    },
    [router, searchParams],
  );

  const handleSearch = () => {
    updateSearchParams({ searchTerm: search, page: '1' });
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    updateSearchParams({
      createdAt: date ? format(date, 'yyyy-MM-dd') : null,
      page: '1',
    });
  };

  useEffect(() => {
    setSearch(searchParams.get('searchTerm') || '');

    const dateParam = searchParams.get('createdAt');
    if (dateParam) {
      setSelectedDate(parseISO(dateParam));
    } else {
      setSelectedDate(undefined);
    }
  }, [searchParams]);

  const [changeUserStatus] = useChangeUserStatusMutation();
  const handleBlockConfirm = async (user: IUser) => {
    const isBlocking = user.status !== 'blocked';
    const nextStatus: TStatus = isBlocking ? 'blocked' : 'confirmed';

    try {
      await changeUserStatus({
        id: user._id,
        status: { status: nextStatus },
      }).unwrap();

      toast.success(
        isBlocking
          ? 'User blocked successfully'
          : 'User unblocked successfully',
      );
      refetch();
    } catch (error) {
      toast.error(
        isBlocking ? 'Failed to block user' : 'Failed to unblock user',
      );
    }
  };

  const [reactivateUserAccount, { isLoading: isReactivating }] =
    useReactivateUserAccountMutation();

  const handleReactivateConfirm = async () => {
    if (!reactivateUser) return;
    try {
      await reactivateUserAccount(reactivateUser._id).unwrap();
      toast.success('Account has been reactivated. The user can now log in.');
      setIsReactivateModalOpen(false);
      setReactivateUser(null);
      refetch();
    } catch {
      toast.error('Failed to reactivate account. Please try again.');
    }
  };

  const columns: ColumnDef<IUser>[] = [
    {
      id: 'serial',
      header: 'Serial',
      cell: ({ row }) => (
        <span className="text-sm font-medium text-gray-500">
          {String(row.index + 1).padStart(2, '0')}
        </span>
      ),
    },
    {
      accessorKey: 'fullName',
      header: 'Name',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={row.original.image} alt={row.original.name} />
            <AvatarFallback className="bg-[#1A73E8] text-xs font-medium capitalize text-white">
              {row.original.name?.slice(0, 1)}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium text-[#212529]">
            {row.original.name}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => (
        <span className="text-sm text-gray-600">{row.original.email}</span>
      ),
    },
    {
      accessorKey: 'role',
      header: 'Account Type',
      cell: ({ row }) => {
        const role = row.original.role;

        const roleStyles: Record<string, string> = {
          user: 'bg-blue-50 text-blue-600',
          trainer: 'bg-purple-50 text-purple-600',
          admin: 'bg-amber-50 text-amber-600',
        };

        const style = roleStyles[role] ?? 'bg-gray-100 text-gray-600';

        return (
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium capitalize ${style}`}
          >
            {role || 'N/A'}
          </span>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.original.status;
        const isBlocked = status === 'blocked';

        // Backend value → user-friendly display label
        const statusLabel: Record<string, string> = {
          confirmed: 'Active',
          ongoing: 'Active',
          blocked: 'Blocked',
        };

        return (
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
              isBlocked
                ? 'bg-red-50 text-red-600'
                : 'bg-green-50 text-green-600'
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isBlocked ? 'bg-red-500' : 'bg-green-500'
              }`}
            />
            {statusLabel[status] || status}
          </span>
        );
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Date & Time',
      cell: ({ row }) => (
        <span className="text-sm text-gray-500">
          {format(new Date(row.original.createdAt), 'dd MMM, yyyy')}
        </span>
      ),
    },
    {
      accessorKey: 'action',
      header: 'Action',
      cell: ({ row }) => {
        const isBlocked = row.original.status === 'blocked';

        return (
          <div className="flex items-center gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <button
                      type="button"
                      aria-label="View user"
                      onClick={() => {
                        setSelectedUser(row.original);
                        setIsModalOpen(true);
                      }}
                      className="rounded-md p-1.5 text-[#1c3b4a] transition-colors hover:bg-[#1c3b4a]/10"
                    >
                      <Eye size={20} />
                    </button>
                  }
                />
                <TooltipContent>View</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <button
                      type="button"
                      aria-label={isBlocked ? 'Unblock user' : 'Block user'}
                      onClick={() => {
                        setBlockModalUser(row.original);
                        setIsBlockModalOpen(true);
                      }}
                      className={`rounded-md p-1.5 transition-colors ${
                        isBlocked
                          ? 'text-green-600 hover:bg-green-50'
                          : 'text-[#FE5858] hover:bg-red-50'
                      }`}
                    >
                      {isBlocked ? (
                        <ShieldCheck size={20} />
                      ) : (
                        <ShieldBan size={20} />
                      )}
                    </button>
                  }
                />
                <TooltipContent>
                  {isBlocked ? 'Unblock' : 'Block'}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {row.original.isDeleted === true && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <button
                        type="button"
                        aria-label="Reactivate account"
                        onClick={() => {
                          setReactivateUser(row.original);
                          setIsReactivateModalOpen(true);
                        }}
                        className="rounded-md p-1.5 text-blue-500 transition-colors hover:bg-blue-50"
                      >
                        <UserRoundCheck size={18} />
                      </button>
                    }
                  />
                  <TooltipContent>Reactivate Account</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        );
      },
    },
  ];

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="">
      {/* Search + Date Filter Section */}
      <div className="flex flex-col lg:justify-between lg:flex-row gap-4 mt-5 mb-5">
        <div className="relative w-full lg:w-3/5">
          <Input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
            className="border px-4 py-5 pr-12 rounded w-full"
          />
          <button
            onClick={handleSearch}
            className="absolute top-1/2 right-0 -translate-y-1/2 px-3 py-2 bg-[#1c3b4a] text-white rounded cursor-pointer"
          >
            <Search />
          </button>
        </div>

        {/* Date Picker */}
        <input
          type="date"
          value={selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''}
          onChange={(e) =>
            handleDateSelect(
              e.target.value ? new Date(e.target.value) : undefined,
            )
          }
          className="px-4 py-2 border rounded lg:w-2/5"
        />
      </div>

      <ADTable columns={columns} data={users || []} />
      {users?.length > 0 && <ADPagination totalPage={totalPage} />}

      <UserViewModal
        selectedUser={selectedUser}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
      />

      <BlockUserModal
        user={blockModalUser}
        isOpen={isBlockModalOpen}
        onOpenChange={setIsBlockModalOpen}
        onConfirm={handleBlockConfirm}
      />

      <ReactivateUserModal
        user={reactivateUser}
        isOpen={isReactivateModalOpen}
        isLoading={isReactivating}
        onOpenChange={(open) => {
          setIsReactivateModalOpen(open);
          if (!open) setReactivateUser(null);
        }}
        onConfirm={handleReactivateConfirm}
      />
    </div>
  );
};

export default UserManagement;
