import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Stack,
  Alert,
  Grid,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  useTheme,
} from '@mui/material';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import StopIcon from '@mui/icons-material/Stop';
import LaptopMacIcon from '@mui/icons-material/LaptopMac';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { api } from '../../../api';
import { useLectureContext } from '../../../context/LectureContext';
import { ActionButton, StatCard, DisplayPanel } from '../../../components/common';
import type { Lecture } from '../../../entities/lecture';
import type { Course } from '../../../entities/course';

// TODO: Replace with real data once attendance tracking API is implemented
const placeholderActivity = [
  { name: 'Michael Chen', method: 'Marked attendance via QR Code', status: 'Present', time: '2 mins ago' },
  { name: 'Sarah Johnson', method: 'Marked attendance via Numeric Code', status: 'Present', time: '5 mins ago' },
  { name: 'David Martinez', method: 'Marked attendance via QR Code', status: 'Present', time: '8 mins ago' },
  { name: 'Emma Wilson', method: 'Marked attendance via Numeric Code', status: 'Present', time: '12 mins ago' },
];

function LectureDashboardPage() {
  const theme = useTheme();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getLectureById, addLecture } = useLectureContext();

  const [lecture, setLecture] = useState<Lecture | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const lectureId = id ? parseInt(id, 10) : undefined;

  useEffect(() => {
    if (!lectureId) return;

    const cached = getLectureById(lectureId);
    if (cached) {
      setLecture(cached);
      loadRelatedData(cached);
      return;
    }

    setLoading(true);
    setError('');
    api.lectures
      .getLecture(lectureId)
      .then(async (resp) => {
        if (!resp.ok) throw new Error((await resp.text()) || 'Failed to load lecture');
        const data: Lecture = await resp.json();
        addLecture(data);
        setLecture(data);
        loadRelatedData(data);
      })
      .catch((e: any) => setError(e?.message || 'Failed to load lecture'))
      .finally(() => setLoading(false));
  }, [lectureId]);

  const loadRelatedData = (lec: Lecture) => {
    // Fetch course details for the header subtitle
    api.courses
      .getCourse(lec.courseId)
      .then(async (resp) => {
        if (!resp.ok) return;
        const data: Course = await resp.json();
        setCourse(data);
      })
      .catch(() => {});

  };

  const handleEndSession = () => {
    if (!confirm('Are you sure you want to end this session?')) return;
    navigate('/teacher/courses');
  };

  if (loading) {
    return (
      <Box>
        <Typography>Loading lecture...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        <ActionButton variant="outlined" onClick={() => navigate('/teacher/courses')}>
          Back to Courses
        </ActionButton>
      </Box>
    );
  }

  if (!lecture) {
    return (
      <Box>
        <Typography>Lecture not found.</Typography>
      </Box>
    );
  }

  const codeChars = (lecture.joinCode || '------').split('');

  return (
    <Box>
      {/* Header */}
      <Stack direction="row" alignItems="flex-start" justifyContent="space-between" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 700 }}>
            Attendance Session
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {course ? `${course.courseName} - ${lecture.description}` : lecture.description}
          </Typography>
        </Box>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <ActionButton
            variant="outlined"
            startIcon={<NotificationsNoneIcon />}
            sx={{ borderColor: 'divider', color: 'text.primary' }}
          >
            Notifications
          </ActionButton>
          <ActionButton
            color="error"
            startIcon={<StopIcon />}
            onClick={handleEndSession}
          >
            End Session
          </ActionButton>
        </Stack>
      </Stack>

      {/* Stat Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          {/* TODO: Replace with real enrollment count once enrollment API is implemented
              (I changed this from figma design as total lectures didnt make sense) */}
          <StatCard title="Total Students" value="--" icon={<LaptopMacIcon />} color="primary" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          {/* TODO: Replace with real data once attendance API is implemented */}
          <StatCard title="Present" value="--" icon={<CheckCircleIcon />} color="success" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          {/* TODO: Replace with real data once attendance API is implemented */}
          <StatCard title="Absent" value="--" icon={<CancelIcon />} color="error" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          {/* TODO: Replace with real data once attendance API is implemented */}
          <StatCard title="Attendance Rate" value="--%" icon={<TrendingUpIcon />} color="info" />
        </Grid>
      </Grid>

      {/* Numeric Code Panel */}
      <Box sx={{ mb: 3 }}>
          <DisplayPanel bordered>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
              Numeric Code
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Alternative attendance method
            </Typography>

            {/* Join code from lecture.joinCode (generated by backend) */}
            <Box
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
                borderRadius: 2,
                p: 3,
                textAlign: 'center',
                mb: 3,
                border: '2px dashed rgba(255,255,255,0.4)',
              }}
            >
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.85)', mb: 1 }}>
                Enter this code:
              </Typography>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 700,
                  color: 'common.white',
                  letterSpacing: 12,
                  fontFamily: 'monospace',
                }}
              >
                {codeChars.join(' ')}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', mt: 1, display: 'block' }}>
                Valid for this session only
              </Typography>
            </Box>

            {/* TODO: Replace with real attendance counts once attendance API is implemented */}
            <Stack spacing={2}>
              {/* Marked Present */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      bgcolor: theme.palette.success.bg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <CheckIcon sx={{ fontSize: 18, color: 'success.main' }} />
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>Marked</Typography>
                    <Typography variant="caption" color="text.secondary">Present</Typography>
                  </Box>
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>--</Typography>
              </Box>

              {/* Unmarked Pending */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      bgcolor: theme.palette.error.bg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <CloseIcon sx={{ fontSize: 18, color: 'error.main' }} />
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>Unmarked</Typography>
                    <Typography variant="caption" color="text.secondary">Pending</Typography>
                  </Box>
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>--</Typography>
              </Box>

              {/* TODO: Implement real session timer based on lecture.endDate */}
              <Box
                sx={{
                  bgcolor: theme.palette.info.bg,
                  borderRadius: 2,
                  p: 2,
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 1.5,
                }}
              >
                <InfoOutlinedIcon sx={{ color: 'info.main', fontSize: 20, mt: 0.25 }} />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>Session Timer</Typography>
                  <Typography variant="body2" color="text.secondary">
                    This session will auto-close in{' '}
                    <Box component="span" sx={{ color: 'info.main', fontWeight: 600 }}>--:--</Box>{' '}
                    minutes
                  </Typography>
                </Box>
              </Box>
            </Stack>
          </DisplayPanel>
      </Box>

      {/* Recent Activity */}
      {/* TODO: Replace with real attendance activity once attendance API is implemented */}
      <DisplayPanel bordered>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>Recent Activity</Typography>
          <Typography
            variant="body2"
            sx={{ color: 'primary.main', cursor: 'pointer', fontWeight: 500 }}
          >
            View All
          </Typography>
        </Stack>
        <List disablePadding>
          {placeholderActivity.map((item, index) => (
            <ListItem
              key={index}
              sx={{
                px: 0,
                py: 1.5,
                borderBottom: index < placeholderActivity.length - 1 ? '1px solid' : 'none',
                borderColor: 'divider',
              }}
            >
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: 'divider', color: 'text.secondary', width: 40, height: 40 }}>
                  <Typography variant="caption">
                    {item.name.split(' ').map(n => n[0]).join('')}
                  </Typography>
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {item.name}
                  </Typography>
                }
                secondary={item.method}
              />
              <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
                <Chip
                  label={item.status}
                  size="small"
                  sx={{
                    bgcolor: theme.palette.success.bg,
                    color: 'success.dark',
                    fontWeight: 600,
                    height: 24,
                  }}
                />
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                  {item.time}
                </Typography>
              </Box>
            </ListItem>
          ))}
        </List>
      </DisplayPanel>
    </Box>
  );
}

export default LectureDashboardPage;
