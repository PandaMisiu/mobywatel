import { Box } from '@mui/material';
import { AppButton } from './AppButton';

export const SkipNavigation = () => {
  const skipToMain = () => {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.focus();
      mainContent.scrollIntoView();
    }
  };

  return (
    <Box
      sx={{
        position: 'absolute',
        top: -40,
        left: 6,
        zIndex: 9999,
        '&:focus-within': {
          top: 6,
        },
      }}
    >
      <AppButton
        onClick={skipToMain}
        variant='contained'
        size='small'
        sx={{
          fontSize: '0.875rem',
          fontWeight: 'bold',
        }}
        onFocus={(e) => {
          e.currentTarget.parentElement!.style.top = '6px';
        }}
        onBlur={(e) => {
          e.currentTarget.parentElement!.style.top = '-40px';
        }}
      >
        Przejdź do głównej treści
      </AppButton>
    </Box>
  );
};

export default SkipNavigation;
