import { Avatar } from '@mui/material';
import type { AvatarProps, SvgIconTypeMap } from '@mui/material';
import type { OverridableComponent } from '@mui/material/OverridableComponent';
import { forwardRef } from 'react';

export interface AppAvatarProps extends AvatarProps {
  icon?: React.ReactElement<OverridableComponent<SvgIconTypeMap>>;
}

export const AppAvatar = forwardRef<HTMLDivElement, AppAvatarProps>(
  ({ icon, children, sx, ...props }, ref) => {
    return (
      <Avatar
        ref={ref}
        sx={{
          bgcolor: 'primary.main',
          ...sx,
        }}
        {...props}
      >
        {icon || children}
      </Avatar>
    );
  }
);

AppAvatar.displayName = 'AppAvatar';

export default AppAvatar;
