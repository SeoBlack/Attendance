import { useState } from 'react';
import {
  Box,
  Stack,
  Typography,
  Link,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SecurityIcon from '@mui/icons-material/Security';
import { ActionButton, FormTextField } from '../components/common';

const FEATURES = [
  { icon: QrCode2Icon, label: 'QR Code Scanning' },
  { icon: TrendingUpIcon, label: 'Real-time Analytics' },
  { icon: SecurityIcon, label: 'Secure & Reliable' },
] as const;

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: integrate with auth API
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
      }}
    >
      <Box
        sx={{
          flex: { md: '1 1 50%' },
          minHeight: { xs: 'auto', md: '100vh' },
          bgcolor: 'brand.main',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 4,
          py: { xs: 4, md: 6 },
        }}
      >
        <Stack spacing={3} alignItems="center" sx={{ maxWidth: 360 }}>
          <SchoolIcon sx={{ fontSize: 64, color: 'brand.contrastText' }} />
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="h3"
              component="span"
              sx={{
                fontWeight: 700,
                color: 'brand.contrastText',
                fontFamily: 'inherit',
                letterSpacing: '-0.02em',
              }}
            >
              aTendy
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'brand.contrastText',
                mt: 1,
                opacity: 0.95,
                fontSize: '1rem',
              }}
            >
              Smart Attendance Management
            </Typography>
          </Box>
          <Stack spacing={2} sx={{ width: '100%', mt: 2 }}>
            {FEATURES.map(({ icon: Icon, label }) => (
              <Box
                key={label}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <Icon sx={{ fontSize: 24, color: 'brand.contrastText', flexShrink: 0 }} />
                <Typography sx={{ color: 'brand.contrastText', fontWeight: 500 }}>
                  {label}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Stack>
      </Box>

      <Box
        sx={{
          flex: { md: '1 1 50%' },
          minHeight: { xs: '100vh', md: 'auto' },
          bgcolor: 'background.form',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3,
        }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            width: '100%',
            maxWidth: 400,
            p: 4,
          }}
        >
          <Stack spacing={3}>
            <Box>
              <Typography
                variant="h4"
                component="h1"
                fontWeight={700}
                color="text.primary"
                sx={{ fontFamily: 'inherit' }}
              >
                Welcome Back
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 1 }}
              >
                Sign in to your account
              </Typography>
            </Box>

            <FormTextField
              label="Email"
              type="email"
              name="email"
              autoComplete="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <FormTextField
              label="Password"
              type="password"
              name="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 1,
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    name="remember"
                    color="primary"
                  />
                }
                label={
                  <Typography variant="body2" color="text.primary">
                    Remember me
                  </Typography>
                }
              />
              <Link
                href="#"
                variant="body2"
                underline="hover"
                color="link"
              >
                Forgot password?
              </Link>
            </Box>

            <ActionButton
              type="submit"
              fullWidth
              size="large"
              color="brand"
            >
              Sign In
            </ActionButton>

            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
            >
              Don&apos;t have an account?{' '}
              <Link
                href="/signup"
                underline="hover"
                color="link"
              >
                Sign up
              </Link>
            </Typography>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
