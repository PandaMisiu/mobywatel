import { Chip } from '@mui/material';
import type { ChipProps } from '@mui/material';
import { forwardRef } from 'react';

export type AppChipProps = ChipProps;

export const AppChip = forwardRef<HTMLDivElement, AppChipProps>(
  ({ color = 'primary', ...props }, ref) => {
    return <Chip ref={ref} color={color} {...props} />;
  }
);

AppChip.displayName = 'AppChip';

export default AppChip;
