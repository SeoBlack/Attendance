import { Paper, type PaperProps, type SxProps, type Theme } from '@mui/material';

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
  return (
    <Paper
      elevation={0}
      sx={{
        backgroundColor: '#FFFFFF',
        borderRadius: 2,
        p: padding,
        border: bordered ? '1px solid #E5E7EB' : 'none',
        borderLeft: borderColor ? `4px solid ${borderColor}` : undefined,
        ...sx,
      }}
      {...props}
    >
      {children}
    </Paper>
  );
}
