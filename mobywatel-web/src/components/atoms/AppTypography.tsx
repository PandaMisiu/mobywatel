import { Typography } from '@mui/material';
import type { TypographyProps } from '@mui/material';
import { forwardRef } from 'react';

export interface AppTypographyProps extends TypographyProps {
  children: React.ReactNode;
}

export const AppTypography = forwardRef<HTMLElement, AppTypographyProps>(
  ({ children, ...props }, ref) => {
    return (
      <Typography ref={ref} {...props}>
        {children}
      </Typography>
    );
  }
);

AppTypography.displayName = 'AppTypography';

export default AppTypography;
