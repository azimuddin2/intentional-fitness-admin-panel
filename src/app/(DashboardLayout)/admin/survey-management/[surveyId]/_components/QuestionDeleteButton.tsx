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
import { Trash2, AlertTriangle } from 'lucide-react';

interface QuestionDeleteButtonProps {
  questionText: string;
  onConfirm: () => void;
}

export default function QuestionDeleteButton({
  questionText,
  onConfirm,
}: QuestionDeleteButtonProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={
          <button
            type="button"
            aria-label="Delete question"
            className="rounded-md p-2 text-red-500 bg-red-50 hover:bg-red-100 transition-colors cursor-pointer"
          >
            <Trash2 size={16} />
          </button>
        }
      />
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center mb-2 mx-auto">
            <AlertTriangle size={24} className="text-red-500" />
          </div>
          <AlertDialogTitle className="mx-auto">
            Delete this question?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action is permanent and can&apos;t be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-700 italic">
          &quot;{questionText}&quot;
        </div>

        <AlertDialogFooter className="bg-white border-none">
          <AlertDialogCancel className="cursor-pointer rounded">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="cursor-pointer text-white rounded bg-red-500 hover:bg-red-600"
          >
            Delete Question
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
