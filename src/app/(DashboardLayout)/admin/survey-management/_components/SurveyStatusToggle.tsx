'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { ShieldBan, ShieldCheck } from 'lucide-react';

interface StatusToggleButtonProps {
  isActive: boolean;
  onConfirm: () => void;
}

export default function SurveyStatusToggle({
  isActive,
  onConfirm,
}: StatusToggleButtonProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={
          <button
            type="button"
            aria-label={isActive ? 'Deactivate' : 'Activate'}
            className={`rounded-md p-1.5 transition-colors cursor-pointer ${
              isActive
                ? 'text-[#FE5858] bg-red-50'
                : 'text-green-600 bg-green-50'
            }`}
          >
            {isActive ? <ShieldBan size={18} /> : <ShieldCheck size={18} />}
          </button>
        }
      />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isActive ? 'Deactivate Survey?' : 'Activate Survey?'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isActive
              ? 'This survey will no longer be visible to users.'
              : 'This survey will become visible to users again.'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="bg-white border-none">
          <AlertDialogCancel className="cursor-pointer rounded">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={`cursor-pointer text-white rounded ${
              isActive
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {isActive ? 'Deactivate' : 'Activate'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
