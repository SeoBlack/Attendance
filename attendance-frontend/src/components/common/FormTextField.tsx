import {
  TextField,
  type TextFieldProps,
  type SxProps,
  type Theme,
} from '@mui/material';

export interface FormTextFieldProps extends Omit<TextFieldProps, 'sx'> {
  sx?: SxProps<Theme>;
}

export default function FormTextField({
  sx,
  ...props
}: FormTextFieldProps) {
  return (
    <TextField
      fullWidth
      variant="outlined"
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: 2,
          backgroundColor: 'background.paper',
        },
        ...sx,
      }}
      {...props}
    />
  );
}
