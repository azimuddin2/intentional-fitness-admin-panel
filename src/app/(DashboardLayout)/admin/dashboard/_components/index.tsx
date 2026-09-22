'use client';

import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { IUser } from '@/src/types/user.type';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useGetRecentUsersQuery } from '@/src/redux/features/dashboard/dashboardApi';
import TrainerOverviewChart from './TrainerOverviewChart';
import UserOverviewChart from './UserOverviewChart';
import UserTrainerStats from './UserTrainerStats';
import { ADTable } from '@/src/components/modules/IFTable';
import Spinner from '@/src/components/shared/Spinner';

const Dashboard = () => {
  const { data, isLoading } = useGetRecentUsersQuery(undefined);
  const recentUsers = data?.data;

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
      header: 'Date of Join',
      cell: ({ row }) => (
        <span className="text-sm text-gray-500">
          {format(new Date(row.original.createdAt), 'dd MMM, yyyy')}
        </span>
      ),
    },
  ];

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div>
      <UserTrainerStats />
      <div className="my-5 grid grid-cols-1 lg:grid-cols-2 gap-5">
        <UserOverviewChart />
        <TrainerOverviewChart />
      </div>
      <ADTable columns={columns} data={recentUsers || []} />
    </div>
  );
};

export default Dashboard;
