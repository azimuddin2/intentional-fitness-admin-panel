'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { Mail, Phone, CalendarDays, ShieldCheck } from 'lucide-react';
import { IUser } from '@/src/types/user.type';

interface UserModalProps {
  selectedUser: IUser | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const InfoRow = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value?: string | null;
}) => (
  <div className="flex items-center justify-between gap-4 px-4 py-3.5">
    <span className="flex items-center gap-2.5 text-sm font-medium text-gray-500">
      <Icon className="h-4 w-4 shrink-0" />
      {label}
    </span>
    <span className="truncate text-sm font-semibold text-[#212529]">
      {value || '—'}
    </span>
  </div>
);

const UserViewModal = ({
  selectedUser,
  isOpen,
  onOpenChange,
}: UserModalProps) => {
  const joinDate = selectedUser?.createdAt
    ? format(new Date(selectedUser.createdAt), 'dd MMM, yyyy')
    : '';

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-xl sm:max-w-md">
        <DialogHeader className="items-center text-center">
          <DialogTitle className="sr-only">User Details</DialogTitle>

          <Avatar className="h-24 w-24 ring-4 ring-[#1A73E8]/10">
            <AvatarImage src={selectedUser?.image} alt={selectedUser?.name} />
            <AvatarFallback className="bg-[#1A73E8] text-3xl font-medium capitalize text-white">
              {selectedUser?.name?.slice(0, 1)}
            </AvatarFallback>
          </Avatar>

          <div className="mt-3 space-y-1">
            <h3 className="text-lg font-semibold text-gray-900">
              {selectedUser?.name}
            </h3>
            {selectedUser?.role && (
              <Badge
                variant="secondary"
                className="bg-[#1A73E8]/10 capitalize text-[#1A73E8] hover:bg-[#1A73E8]/10"
              >
                {selectedUser.role}
              </Badge>
            )}
          </div>
        </DialogHeader>

        <div className="mt-2 divide-y divide-gray-100 rounded-lg border border-gray-100">
          <InfoRow icon={Mail} label="Email" value={selectedUser?.email} />
          <InfoRow
            icon={Phone}
            label="Phone Number"
            value={selectedUser?.phone}
          />
          <InfoRow icon={CalendarDays} label="Date of Join" value={joinDate} />
          <InfoRow
            icon={ShieldCheck}
            label="Account Type"
            value={selectedUser?.role}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserViewModal;
