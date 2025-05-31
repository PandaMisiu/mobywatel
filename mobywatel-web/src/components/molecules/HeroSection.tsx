import { Paper } from '@mui/material';
import { AppTypography, AppButton } from '../atoms';

export interface HeroSectionProps {
  title: string;
  subtitle: string;
  buttonText: string;
  onButtonClick?: () => void;
  sx?: object;
}

export const HeroSection = ({
  title,
  subtitle,
  buttonText,
  onButtonClick,
  sx,
}: HeroSectionProps) => {
  return (
    <Paper
      elevation={0}
      sx={{
        bgcolor: 'primary.main',
        color: 'white',
        p: 6,
        mb: 4,
        borderRadius: 2,
        ...sx,
      }}
    >
      <AppTypography variant='h2' component='h1' gutterBottom>
        {title}
      </AppTypography>
      <AppTypography variant='h5' component='p' sx={{ mb: 3 }}>
        {subtitle}
      </AppTypography>
      <AppButton
        variant='contained'
        color='secondary'
        size='large'
        onClick={onButtonClick}
      >
        {buttonText}
      </AppButton>
    </Paper>
  );
};

export default HeroSection;
