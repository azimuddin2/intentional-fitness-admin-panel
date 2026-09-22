'use client';

import { IUser } from '@/src/types/user.type';
import { UserRoundCheck, X } from 'lucide-react';

interface ReactivateUserModalProps {
  user: IUser | null;
  isOpen: boolean;
  isLoading: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

const ReactivateUserModal = ({
  user,
  isOpen,
  isLoading,
  onOpenChange,
  onConfirm,
}: ReactivateUserModalProps) => {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
        {/* Close */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>

        {/* Icon */}
        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-blue-100 mx-auto mb-4">
          <UserRoundCheck className="text-blue-600" size={28} />
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-center text-gray-800 mb-2">
          Reactivate this account?
        </h2>

        {/* Description */}
        <p className="text-sm text-center text-gray-500 mb-2">
          You are about to reactivate the account of{' '}
          <span className="font-semibold text-gray-800">{user.name}</span>.
        </p>
        <p className="text-sm text-center text-gray-400 mb-6">{user.email}</p>

        {/* Info box */}
        <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 mb-6 text-center">
          <p className="text-sm text-blue-600">
            The user will be able to log in immediately after reactivation.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="flex-1 py-2.5 rounded-sm border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 py-2.5 rounded-sm bg-blue-600 hover:bg-blue-700 text-white font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? 'Reactivating...' : 'Yes, Reactivate'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReactivateUserModal;
