import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';

interface IAppButton {
  className?: string;
  content: string | ReactNode;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export const AppButton = ({
  className,
  content,
  disabled,
  type = 'submit',
}: IAppButton) => {
  return (
    <Button
      type={type}
      disabled={disabled}
      className={`p-6 cursor-pointer text-sm mt-2 rounded-sm border-b-4 border-r-4 ${className}`}
    >
      {content}
    </Button>
  );
};
