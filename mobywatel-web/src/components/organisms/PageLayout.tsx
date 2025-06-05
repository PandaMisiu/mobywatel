import { Box } from '@mui/material';
import { AppTypography } from '../atoms';

export interface PageLayoutProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  sx?: object;
}

export const PageLayout = ({
  title,
  subtitle,
  children,
  sx,
}: PageLayoutProps) => {
  return (
    <Box sx={sx}>
      {title && (
        <AppTypography
          variant='h3'
          component='h1'
          gutterBottom
          textAlign='center'
        >
          {title}
        </AppTypography>
      )}
      {subtitle && (
        <AppTypography
          variant='h6'
          color='text.secondary'
          textAlign='center'
          sx={{ mb: 4 }}
        >
          {subtitle}
        </AppTypography>
      )}
      {children}
    </Box>
  );
};

export default PageLayout;
