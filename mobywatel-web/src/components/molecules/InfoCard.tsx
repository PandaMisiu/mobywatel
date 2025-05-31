import { Card, CardContent, Box } from '@mui/material';
import type { SvgIconTypeMap } from '@mui/material';
import type { OverridableComponent } from '@mui/material/OverridableComponent';
import { AppTypography, AppAvatar, AppChip } from '../atoms';

export interface InfoCardProps {
  Avatar: OverridableComponent<SvgIconTypeMap>;
  title: string;
  content: string;
  chips?: string[];
  sx?: object;
}

export const InfoCard = ({
  Avatar,
  title,
  content,
  chips,
  sx,
}: InfoCardProps) => {
  return (
    <Card sx={sx}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <AppAvatar icon={<Avatar />} sx={{ mr: 2 }} />
          <AppTypography variant='h5' component='h2'>
            {title}
          </AppTypography>
        </Box>
        <AppTypography variant='body1' sx={{ mb: 2 }}>
          {content}
        </AppTypography>
        {chips && (
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {chips.map((chip, index) => (
              <AppChip key={index} label={chip} />
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default InfoCard;
