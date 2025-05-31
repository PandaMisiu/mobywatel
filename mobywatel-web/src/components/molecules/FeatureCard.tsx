import { Card, CardContent, Box } from '@mui/material';
import type { SvgIconTypeMap } from '@mui/material';
import type { OverridableComponent } from '@mui/material/OverridableComponent';
import { AppTypography, AppIcon } from '../atoms';

export interface FeatureCardProps {
  icon: OverridableComponent<SvgIconTypeMap>;
  title: string;
  description: string;
  sx?: object;
}

export const FeatureCard = ({
  icon,
  title,
  description,
  sx,
}: FeatureCardProps) => {
  return (
    <Card sx={{ height: '100%', ...sx }}>
      <CardContent sx={{ textAlign: 'center', p: 3 }}>
        <Box sx={{ mb: 2 }}>
          <AppIcon icon={icon} size='large' color='primary' />
        </Box>
        <AppTypography variant='h5' component='h2' gutterBottom>
          {title}
        </AppTypography>
        <AppTypography variant='body1' color='text.secondary'>
          {description}
        </AppTypography>
      </CardContent>
    </Card>
  );
};

export default FeatureCard;
