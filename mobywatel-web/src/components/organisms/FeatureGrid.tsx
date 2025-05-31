import { Grid } from '@mui/material';
import type { SvgIconTypeMap } from '@mui/material';
import type { OverridableComponent } from '@mui/material/OverridableComponent';
import { FeatureCard } from '../molecules';

export interface Feature {
  icon: OverridableComponent<SvgIconTypeMap>;
  title: string;
  description: string;
}

export interface FeatureGridProps {
  features: Feature[];
  sx?: object;
}

export const FeatureGrid = ({ features, sx }: FeatureGridProps) => {
  return (
    <Grid container spacing={4} sx={sx}>
      {features.map((feature, index) => (
        <Grid size={{ xs: 12, md: 4 }} key={index}>
          <FeatureCard
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default FeatureGrid;
