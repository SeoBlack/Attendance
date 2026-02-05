import {useEffect, useState} from 'react';
import {
  Alert,
  Box,
  Stack,
  Typography,

} from '@mui/material';

import { ActionButton, FormTextField } from '../components/common';
import {requestSignup, USER_ROLE} from "../api/auth";

function PasswordMismatchAlert({isMismatch}: {isMismatch: boolean}) {
  if(isMismatch)
    return <Alert severity="error">
            Passwords do not match!
          </Alert>
}
export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState('');
  const [studentId, setStudentId] = useState('');

  const [passwordsMismatch, setPasswordsMismatch] = useState(false);

  useEffect(()=>{
    console.log(password, passwordConfirm);
    setPasswordsMismatch(password !== passwordConfirm);
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    requestSignup({
      email, password,
      firstName, lastName,
      role: role as USER_ROLE,
      studentId
    }).then(res => {
      // TODO: Handle failures
      // TODO: Redirect to login with message on success
    }).catch(e => {
      // TODO: add toast
      console.error(e)
    })
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
          minHeight: { xs: '100vh', md: 'auto' },
          bgcolor: 'background.form',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3,
        }}
      >
        <Box
          component="form" onSubmit={handleSubmit}
          sx={{
            width: '100%',
            maxWidth: 400,
            p: 4,
          }}
        >
          <Stack spacing={3}>
            <Box>
              <Typography variant="h4" component="h1" fontWeight={700} color="text.primary" sx={{ fontFamily: 'inherit' }}>
                Sign up
              </Typography>
            </Box>

            <FormTextField
              label="First name" type="text" name="firstName" placeholder="Your first name" value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <FormTextField
              label="Last name" type="text" name="lastName" placeholder="Your last name" value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
            <FormTextField
              label="Student ID" type="text" name="studentId" placeholder="Enter your student ID" value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              required
            />

            <FormTextField
              label="Email" type="email" name="email" autoComplete="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <PasswordMismatchAlert isMismatch={passwordsMismatch}/>
            <FormTextField
              label="Password" type="password" name="password" autoComplete="current-password" placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <FormTextField
              label="Confirm password" type="password" name="password"  placeholder="Enter your password again"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              required
            />

            <ActionButton type="submit" fullWidth size="large" color="brand">
              Create account
            </ActionButton>

          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
