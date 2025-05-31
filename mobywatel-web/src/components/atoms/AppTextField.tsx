import { TextField } from '@mui/material';
import type { TextFieldProps } from '@mui/material';
import { forwardRef } from 'react';

export type AppTextFieldProps = TextFieldProps;

export const AppTextField = forwardRef<HTMLDivElement, AppTextFieldProps>(
  ({ variant = 'outlined', fullWidth = true, ...props }, ref) => {
    return (
      <TextField ref={ref} variant={variant} fullWidth={fullWidth} {...props} />
    );
  }
);

AppTextField.displayName = 'AppTextField';

export default AppTextField;
