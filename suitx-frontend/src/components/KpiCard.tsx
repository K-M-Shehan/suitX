import { Card, CardContent, Typography } from '@mui/material';

type Props = {
  title: string;
  value: string | number;
  subtitle?: string;
  color?: string;
};

export default function KpiCard({ title, value, subtitle, color }: Props) {
  return (
    <Card sx={{ borderLeft: `6px solid ${color || '#1976d2'}` }}>
      <CardContent>
        <Typography variant="overline" color="text.secondary">{title}</Typography>
        <Typography variant="h4" fontWeight={700}>{value}</Typography>
        {subtitle && <Typography color="text.secondary">{subtitle}</Typography>}
      </CardContent>
    </Card>
  );
}