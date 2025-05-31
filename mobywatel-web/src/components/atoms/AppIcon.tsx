import type { SvgIconTypeMap, SxProps } from '@mui/material';
import type { OverridableComponent } from '@mui/material/OverridableComponent';
import { forwardRef } from 'react';

export interface AppIconProps {
  icon: OverridableComponent<SvgIconTypeMap>;
  size?: 'small' | 'medium' | 'large';
  color?:
    | 'inherit'
    | 'action'
    | 'disabled'
    | 'primary'
    | 'secondary'
    | 'error'
    | 'info'
    | 'success'
    | 'warning';
  sx?: SxProps;
}

export const AppIcon = forwardRef<SVGSVGElement, AppIconProps>(
  (
    { icon: IconComponent, size = 'medium', color = 'inherit', sx, ...props },
    ref
  ) => {
    const sizeMap = {
      small: 24,
      medium: 32,
      large: 48,
    };

    return (
      <IconComponent
        ref={ref}
        color={color}
        sx={{
          fontSize: sizeMap[size],
          ...sx,
        }}
        {...props}
      />
    );
  }
);

AppIcon.displayName = 'AppIcon';

export default AppIcon;
