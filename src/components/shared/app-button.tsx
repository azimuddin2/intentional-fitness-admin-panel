import { ReactNode } from 'react';
import { Button } from "@/components/ui/button"

interface IAppButton {
  className?: string;
  content: string | ReactNode;
  disabled?: boolean;
}

export const AppButton = ({ className, content, disabled }: IAppButton) => {
  return (
    <Button
      disabled={disabled}
      className={`p-6 cursor-pointer text-sm mt-2 rounded-sm border-b-4 border-r-4 ${className}`}
    >
      {content}
    </Button>
  );
};
