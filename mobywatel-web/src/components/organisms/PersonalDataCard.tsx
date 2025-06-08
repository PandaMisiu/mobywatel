import { Card, CardContent, Avatar, Box, Divider } from '@mui/material';
import { Person, Edit, Email, Badge, CalendarToday } from '@mui/icons-material';
import { AppTypography, AppButton } from '../atoms';
import type { CitizenData } from '../pages/CitizenDashboard';

export interface PersonalDataCardProps {
  citizenData: CitizenData | null;
  onEditRequest: () => void;
}

export function PersonalDataCard({
  citizenData,
  onEditRequest,
}: PersonalDataCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pl-PL');
  };

  const getGenderLabel = (gender: 'MALE' | 'FEMALE') => {
    return gender === 'MALE' ? 'Mężczyzna' : 'Kobieta';
  };

  if (!citizenData) {
    return (
      <Card>
        <CardContent>
          <AppTypography variant='h6' component='h2' gutterBottom>
            Dane osobowe
          </AppTypography>
          <AppTypography variant='body2' color='text.secondary'>
            Ładowanie danych...
          </AppTypography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            sx={{ bgcolor: 'primary.main', mr: 2, width: 56, height: 56 }}
          >
            <Person fontSize='large' />
          </Avatar>
          <Box>
            <AppTypography variant='h6' component='h2'>
              {citizenData.firstName} {citizenData.lastName}
            </AppTypography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Email fontSize='small' color='action' />
            <Box>
              <AppTypography variant='body2' color='text.secondary'>
                Email
              </AppTypography>
              <AppTypography variant='body1'>{citizenData.email}</AppTypography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Badge fontSize='small' color='action' />
            <Box>
              <AppTypography variant='body2' color='text.secondary'>
                PESEL
              </AppTypography>
              <AppTypography variant='body1' fontFamily='monospace'>
                {citizenData.PESEL}
              </AppTypography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalendarToday fontSize='small' color='action' />
            <Box>
              <AppTypography variant='body2' color='text.secondary'>
                Data urodzenia
              </AppTypography>
              <AppTypography variant='body1'>
                {formatDate(citizenData.birthDate)}
              </AppTypography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Person fontSize='small' color='action' />
            <Box>
              <AppTypography variant='body2' color='text.secondary'>
                Płeć
              </AppTypography>
              <AppTypography variant='body1'>
                {getGenderLabel(citizenData.gender)}
              </AppTypography>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <AppButton
          variant='outlined'
          fullWidth
          startIcon={<Edit />}
          onClick={onEditRequest}
        >
          Wnioskuj o zmianę danych
        </AppButton>
      </CardContent>
    </Card>
  );
}
