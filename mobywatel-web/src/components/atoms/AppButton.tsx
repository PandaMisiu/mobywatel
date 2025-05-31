import { Button } from '@mui/material';
import type { ButtonProps } from '@mui/material';
import { forwardRef } from 'react';

export interface AppButtonProps extends ButtonProps {
  children: React.ReactNode;
  component?: React.ElementType;
  to?: string;
}

export const AppButton = forwardRef<HTMLButtonElement, AppButtonProps>(
  ({ children, variant = 'contained', color = 'primary', ...props }, ref) => {
    return (
      <Button ref={ref} variant={variant} color={color} {...props}>
        {children}
      </Button>
    );
  }
);

AppButton.displayName = 'AppButton';

export default AppButton;
