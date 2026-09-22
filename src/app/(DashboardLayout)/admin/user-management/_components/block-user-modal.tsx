'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ShieldBan, ShieldCheck, Loader2 } from 'lucide-react';
import { IUser } from '@/src/types/user.type';

interface BlockModalProps {
  user: IUser | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (user: IUser) => Promise<void> | void;
}

const BlockUserModal = ({
  user,
  isOpen,
  onOpenChange,
  onConfirm,
}: BlockModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!user) return null;

  const isBlocked = user.status === 'blocked';

  const handleConfirm = async () => {
    try {
      setIsSubmitting(true);
      await onConfirm(user);
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-xl p-6 sm:max-w-md">
        <DialogHeader className="items-center text-center sm:items-center">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-full ${
              isBlocked ? 'bg-green-50' : 'bg-red-50'
            }`}
          >
            {isBlocked ? (
              <ShieldCheck className="h-6 w-6 text-green-600" />
            ) : (
              <ShieldBan className="h-6 w-6 text-red-600" />
            )}
          </div>

          <DialogTitle className="mt-3 text-lg font-semibold text-gray-900">
            {isBlocked ? 'Unblock this user?' : 'Block this user?'}
          </DialogTitle>

          <DialogDescription className="text-sm text-gray-500">
            {isBlocked ? (
              <>
                <span className="font-medium text-gray-700">{user.name}</span>{' '}
                will regain full access to their account.
              </>
            ) : (
              <>
                <span className="font-medium text-gray-700">{user.name}</span>{' '}
                will lose access immediately. You can unblock them anytime.
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-6 flex-row justify-center gap-3 sm:justify-center">
          <Button
            variant="outline"
            className="flex-1 rounded"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            className={`flex-1 text-white rounded ${
              isBlocked
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-red-600 hover:bg-red-700'
            }`}
            onClick={handleConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isBlocked ? (
              'Confirm Unblock'
            ) : (
              'Confirm Block'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BlockUserModal;
