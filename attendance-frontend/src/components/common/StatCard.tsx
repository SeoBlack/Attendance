import { Box, Typography, type SxProps, type Theme } from '@mui/material';
import DisplayPanel from './DisplayPanel';

export type StatCardColor =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info';

export type StatCardIndicatorType = 'positive' | 'negative' | 'neutral';

export interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  color?: StatCardColor;
  indicator?: string;
  indicatorType?: StatCardIndicatorType;
  sx?: SxProps<Theme>;
}

const colorMap: Record<StatCardColor, { bg: string; icon: string }> = {
  primary: { bg: '#E6F7F5', icon: '#0D9488' },
  secondary: { bg: '#F3E8FF', icon: '#7C3AED' },
  success: { bg: '#DCFCE7', icon: '#22C55E' },
  warning: { bg: '#FEF3C7', icon: '#F59E0B' },
  error: { bg: '#FEE2E2', icon: '#EF4444' },
  info: { bg: '#DBEAFE', icon: '#3B82F6' },
};


const indicatorTextMap: Record<StatCardIndicatorType, string> = {
  positive: '#22C55E',
  negative: '#EF4444',
  neutral: '#6B7280',
};

export default function StatCard({
  title,
  value,
  icon,
  color = 'primary',
  indicator,
  indicatorType = 'neutral',
  sx,
}: StatCardProps) {
  const colors = colorMap[color] ?? colorMap.primary;
  const indicatorText = indicatorTextMap[indicatorType];

  return (
    <DisplayPanel sx={sx}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
          justifyContent: 'space-between',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
          }}
        >
          {icon && (
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: colors.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: colors.icon,
                '& svg': { fontSize: 20 },
              }}
            >
              {icon}
            </Box>
          )}
          {indicator && (
            <Box
              sx={{
                px: 1.25,
                py: 0.5,
                borderRadius: 2,
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: indicatorText,
                  fontWeight: 600,
                  fontSize: '0.75rem',
                }}
              >
                {indicator}
              </Typography>
            </Box>
          )}
        </Box>
        <Box>
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, color: 'text.primary', lineHeight: 1.2 }}
          >
            {value}
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: 'text.secondary', mt: 0.5 }}
          >
            {title}
          </Typography>
        </Box>
      </Box>
    </DisplayPanel>
  );
}
