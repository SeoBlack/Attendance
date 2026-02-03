import {
  Button,
  type ButtonProps,
  type SxProps,
  type Theme,
} from '@mui/material';

export type ActionButtonVariant = 'contained' | 'outlined' | 'text';
export type ActionButtonColor =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'brand';
export type ActionButtonSize = 'small' | 'medium' | 'large';

export interface ActionButtonProps extends Omit<ButtonProps, 'variant' | 'color' | 'size' | 'sx'> {
  children?: React.ReactNode;
  variant?: ActionButtonVariant;
  color?: ActionButtonColor;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  fullWidth?: boolean;
  size?: ActionButtonSize;
  sx?: SxProps<Theme>;
}

const sizeStyles: Record<ActionButtonSize, object> = {
  small: { py: 0.75, px: 2, fontSize: '0.8125rem' },
  medium: { py: 1, px: 2.5, fontSize: '0.875rem' },
  large: { py: 1.5, px: 3, fontSize: '1rem' },
};

export default function ActionButton({
  children,
  variant = 'contained',
  color = 'primary',
  startIcon,
  endIcon,
  fullWidth = false,
  size = 'medium',
  sx,
  ...props
}: ActionButtonProps) {
  return (
    <Button
      variant={variant}
      color={color}
      startIcon={startIcon}
      endIcon={endIcon}
      fullWidth={fullWidth}
      sx={{
        borderRadius: 2,
        fontWeight: 500,
        textTransform: 'none',
        boxShadow: 'none',
        ...sizeStyles[size],
        '&:hover': {
          boxShadow: 'none',
        },
        ...sx,
      }}
      {...props}
    >
      {children}
    </Button>
  );
}
