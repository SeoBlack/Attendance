import {
  Paper,
  type PaperProps,
  type SxProps,
  type Theme,
  useTheme,
} from '@mui/material';

export interface DisplayPanelProps extends Omit<PaperProps, 'sx'> {
  children?: React.ReactNode;
  sx?: SxProps<Theme>;
  padding?: number;
  bordered?: boolean;
  borderColor?: string;
}

export default function DisplayPanel({
  children,
  sx,
  padding = 3,
  bordered = false,
  borderColor,
  ...props
}: DisplayPanelProps) {
  const theme = useTheme();
  return (
    <Paper
      elevation={0}
      sx={{
        backgroundColor: theme.palette.background.paper,
        borderRadius: 2,
        p: padding,
        border: bordered ? `1px solid ${theme.palette.divider}` : 'none',
        borderLeft: borderColor ? `4px solid ${borderColor}` : undefined,
        ...sx,
      }}
      {...props}
    >
      {children}
    </Paper>
  );
}
