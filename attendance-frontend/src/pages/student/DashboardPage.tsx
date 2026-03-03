import { useState } from 'react';
import {
  Box,
  Typography,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import QrCodeIcon from '@mui/icons-material/QrCode';
import { attendance } from '../../api';
import type { Attendance } from '../../entities/attendance';

function DashboardPage() {
  const [open, setOpen] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [result, setResult] = useState<Attendance | null>(null);

  const handleClose = () => {
    if (loading) return;
    setOpen(false);
    setJoinCode('');
    setError(null);
    setSuccess(false);
    setResult(null);
  };

  const handleSubmit = async () => {
    if (!joinCode.trim()) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await attendance.markAttendance(joinCode.trim().toUpperCase());

      if (response.ok) {
        const data: Attendance = await response.json();
        setResult(data);
        setSuccess(true);
      } else {
        switch (response.status) {
          case 404:
            setError('Lecture not found');
            break;
          case 403:
            setError('You are not enrolled in this course');
            break;
          case 409:
            setError('Attendance already marked');
            break;
          default:
            setError('Something went wrong');
        }
      }
    } catch {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3, position: 'relative', minHeight: '80vh' }}>
      <Typography variant="h4" gutterBottom>
        Student Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Place holder going to implement in sprint 4
      </Typography>

      <Fab
        color="primary"
        variant="extended"
        sx={{ position: 'fixed', bottom: 32, right: 32 }}
        onClick={() => setOpen(true)}
      >
        <QrCodeIcon sx={{ mr: 1 }} />
        Enter Code
      </Fab>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
        <DialogTitle>Mark Attendance</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Enter the lecture join code provided by your instructor.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && result ? (
            <Alert severity="success">
              Attendance marked! Lecture ID: {result.attendanceId.lectureId}
            </Alert>
          ) : (
            <TextField
              label="Join Code"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              fullWidth
              autoFocus
              slotProps={{ input: { style: { textTransform: 'uppercase' } } }}
              disabled={loading}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            {success ? 'Close' : 'Cancel'}
          </Button>
          {!success && (
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading || !joinCode.trim()}
            >
              {loading ? <CircularProgress size={20} color="inherit" /> : 'Submit'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default DashboardPage;
