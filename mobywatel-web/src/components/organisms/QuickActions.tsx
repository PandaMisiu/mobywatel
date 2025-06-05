import { Card, CardContent, Grid, Box } from '@mui/material';
import { Person, CreditCard, DirectionsCar } from '@mui/icons-material';
import { AppTypography } from '../atoms';

export interface QuickActionsProps {
  onDocumentRequest: () => void;
  onPersonalDataRequest: () => void;
}

export function QuickActions({
  onDocumentRequest,
  onPersonalDataRequest,
}: QuickActionsProps) {
  const actions = [
    {
      title: 'Wniosek o dowód osobisty',
      description: 'Złóż wniosek o wydanie nowego dowodu osobistego',
      icon: CreditCard,
      color: 'primary' as const,
      onClick: onDocumentRequest,
    },
    {
      title: 'Wniosek o prawo jazdy',
      description: 'Złóż wniosek o wydanie prawa jazdy',
      icon: DirectionsCar,
      color: 'secondary' as const,
      onClick: onDocumentRequest,
    },
    {
      title: 'Zmiana danych osobowych',
      description: 'Wnioskuj o zmianę imienia lub nazwiska',
      icon: Person,
      color: 'info' as const,
      onClick: onPersonalDataRequest,
    },
  ];

  return (
    <Card>
      <CardContent>
        <AppTypography variant='h5' component='h2' gutterBottom>
          Szybkie akcje
        </AppTypography>
        <AppTypography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
          Wybierz jedną z dostępnych usług
        </AppTypography>

        <Grid container spacing={2}>
          {actions.map((action, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
              <Card
                variant='outlined'
                sx={{
                  height: '100%',
                  transition: 'all 0.2s',
                  '&:hover': {
                    boxShadow: 2,
                    transform: 'translateY(-2px)',
                  },
                  cursor: 'pointer',
                }}
                onClick={action.onClick}
              >
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      mb: 2,
                    }}
                  >
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: '50%',
                        bgcolor: `${action.color}.light`,
                        color: `${action.color}.contrastText`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <action.icon fontSize='large' />
                    </Box>
                  </Box>
                  <AppTypography variant='h6' component='h3' gutterBottom>
                    {action.title}
                  </AppTypography>
                  <AppTypography variant='body2' color='text.secondary'>
                    {action.description}
                  </AppTypography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
}
