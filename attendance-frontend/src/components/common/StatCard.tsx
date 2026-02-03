import {
  Box,
  Typography,
  type SxProps,
  type Theme,
  useTheme,
} from '@mui/material';
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

export default function StatCard({
  title,
  value,
  icon,
  color = 'primary',
  indicator,
  indicatorType = 'neutral',
  sx,
}: StatCardProps) {
  const theme = useTheme();
  const paletteColor = theme.palette[color];
  const colors = {
    bg: paletteColor?.bg ?? theme.palette.primary.bg ?? '#E6F7F5',
    icon: paletteColor?.main ?? theme.palette.primary.main,
  };
  const indicatorTextMap: Record<StatCardIndicatorType, string> = {
    positive: theme.palette.success.main,
    negative: theme.palette.error.main,
    neutral: theme.palette.text.secondary,
  };
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
