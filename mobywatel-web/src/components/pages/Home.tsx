import { Box } from '@mui/material';
import {
  HomeOutlined,
  SecurityOutlined,
  GroupOutlined,
} from '@mui/icons-material';
import { HeroSection } from '../molecules';
import { FeatureGrid } from '../organisms';
import type { Feature } from '../organisms';

const features: Feature[] = [
  {
    icon: HomeOutlined,
    title: 'Usługi dla obywateli',
    description:
      'Uzyskaj dostęp do swoich dokumentów osobistych, składaj wnioski o pozwolenia i zarządzaj usługami rządowymi online.',
  },
  {
    icon: SecurityOutlined,
    title: 'Bezpieczna platforma',
    description:
      'Twoje dane są chronione za pomocą zaawansowanych środków bezpieczeństwa i szyfrowania, aby zapewnić prywatność i bezpieczeństwo.',
  },
  {
    icon: GroupOutlined,
    title: 'Społeczność',
    description:
      'Połącz się ze swoją lokalną społecznością i bądź na bieżąco z inicjatywami rządowymi i aktualizacjami.',
  },
];

export default function Home() {
  const handleGetStarted = () => {
    // Handle navigation to services
  };

  return (
    <Box>
      <HeroSection
        title='Witamy w mObywatel'
        subtitle='Twój portal cyfrowych usług rządowych'
        buttonText='Rozpocznij'
        onButtonClick={handleGetStarted}
      />
      <FeatureGrid features={features} />
    </Box>
  );
}
