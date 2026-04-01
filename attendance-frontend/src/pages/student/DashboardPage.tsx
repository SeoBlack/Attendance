import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Chip,
  useTheme,
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import HistoryIcon from '@mui/icons-material/History';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import StatCard from '../../components/common/StatCard';
import DisplayPanel from '../../components/common/DisplayPanel';
import { attendance, student } from '../../api';
import type { Attendance } from '../../entities/attendance';
import { useNavigate } from 'react-router-dom';
import {useTranslation} from "react-i18next";

type TodayLecture = {
  lectureId: number;
  courseName: string;
  description: string;
  startDate: string;
  endDate: string;
  attended: boolean;
};

type AttendanceRecord = {
  lectureId: number;
  courseName: string;
  scannedAt: string;
  present: boolean;
};

type DashboardData = {
  firstName: string;
  lastName: string;
  totalLectures: number;
  presentCount: number;
  absentCount: number;
  attendanceRate: number;
  todayLectures: TodayLecture[];
  recentActivity: AttendanceRecord[];
};

function formatTime(dateStr: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateStr));
}

function formatRelativeDate(dateStr: string, locale: string, t: (key: string) => string): string {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return `${t("student.todayLabel")} ${formatTime(dateStr, locale)}`;
  }
  if (date.toDateString() === yesterday.toDateString()) {
    return `${t("student.yesterdayLabel")} ${formatTime(dateStr, locale)}`;
  }
  return `${new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
  }).format(date)}, ${formatTime(dateStr, locale)}`;
}

function getLectureStatus(lecture: TodayLecture): { label: string; color: 'success' | 'warning' | 'info' } {
  if (lecture.attended) return { label: 'Present', color: 'success' };
  const now = new Date();
  const start = new Date(lecture.startDate);
  const end = new Date(lecture.endDate);
  if (now >= start && now <= end) return { label: 'In Progress', color: 'info' };
  if (now < start) return { label: 'Upcoming', color: 'warning' };
  return { label: 'Missed', color: 'warning' };
}

function DashboardPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [pageLoading, setPageLoading] = useState(true);

  // Mark attendance dialog state
  const [open, setOpen] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [result, setResult] = useState<Attendance | null>(null);

  const {t, i18n} = useTranslation();

  const fetchDashboard = async () => {
    try {
      const response = await student.getDashboard();
      if (response.ok) {
        const data: DashboardData = await response.json();
        setDashboardData(data);
      }
    } catch {
      // silently fail
    } finally {
      setPageLoading(false);
    }
  };

  const localeMap: Record<string, string> = {
    en: "en-US",
    ru: "ru-RU",
    ar: "ar-EG",
  };

  const locale = localeMap[i18n.resolvedLanguage ?? i18n.language] ?? "en-US";

  useEffect(() => {
    fetchDashboard();
  }, []);

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
        fetchDashboard();
      } else {
        switch (response.status) {
          case 404: setError('Lecture not found'); break;
          case 403: setError('You are not enrolled in this course'); break;
          case 409: setError('Attendance already marked'); break;
          default: setError('Something went wrong');
        }
      }
    } catch {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const data = dashboardData;
  const today = new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date());
  return (
    <Box sx={{ p: { xs: 1, sm: 3 }, position: 'relative', minHeight: '80vh' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            {t("student.dashboardTitle")}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t("student.dashboardDescription", {firstName: data?.firstName})}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
          <NotificationsNoneIcon />
          <Typography variant="body2">{t("student.messageToday")} {today}</Typography>
        </Box>
      </Box>

      {/* Stat Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard
            title={t("student.messageTotalLecture")}
            value={data?.totalLectures ?? 0}
            icon={<SchoolIcon />}
            color="primary"
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard
            title={t("student.present")}
            value={data?.presentCount ?? 0}
            icon={<CheckCircleIcon />}
            color="success"
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard
            title={t("student.absent")}
            value={data?.absentCount ?? 0}
            icon={<CancelIcon />}
            color="error"
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard
            title={t("student.messageAttendanceRate")}
            value={`${data?.attendanceRate ?? 0}%`}
            icon={<TrendingUpIcon />}
            color="warning"
          />
        </Grid>
      </Grid>

      {/* Today's Classes & Recent Activity */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <DisplayPanel sx={{ minHeight: 300 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              {t("student.messageTodayClasses")}
            </Typography>
            {(!data?.todayLectures || data.todayLectures.length === 0) ? (
              <Typography variant="body2" color="text.secondary">
                {t("student.messageTodayNoClasses")}
              </Typography>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {data.todayLectures.map((lecture) => {
                  const status = getLectureStatus(lecture);
                  return (
                    <Box
                      key={lecture.lectureId}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        p: 2,
                        borderRadius: 2,
                        border: `1px solid ${theme.palette.divider}`,
                        backgroundColor: lecture.attended
                          ? `${theme.palette.success.main}08`
                          : 'transparent',
                      }}
                    >
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {lecture.courseName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatTime(lecture.startDate, locale)} - {formatTime(lecture.endDate, locale)}
                        </Typography>
                      </Box>
                      <Chip
                        label={status.label}
                        color={status.color}
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                  );
                })}
              </Box>
            )}
          </DisplayPanel>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <DisplayPanel sx={{ minHeight: 300 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              {t("student.messageRecentActivity")}
            </Typography>
            {(!data?.recentActivity || data.recentActivity.length === 0) ? (
              <Typography variant="body2" color="text.secondary">
                {t("student.messageNoRecentActivity")}
              </Typography>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {data.recentActivity.map((record, idx) => (
                  <Box key={idx} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        mt: 0.7,
                        flexShrink: 0,
                        backgroundColor: record.present
                          ? theme.palette.success.main
                          : theme.palette.error.main,
                      }}
                    />
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {record.present ? `${t("student.messageMarkedPresent")}` : `${t("student.messageMissed")}`} {record.courseName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatRelativeDate(record.scannedAt, locale, t)}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
          </DisplayPanel>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
        {t("student.messageQuickAction")}
      </Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <DisplayPanel
            sx={{
              cursor: 'pointer',
              '&:hover': { borderColor: theme.palette.primary.main, border: `1px solid ${theme.palette.primary.main}` },
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
            onClick={() => setOpen(true)}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: theme.palette.info.bg ?? '#E3F2FD',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: theme.palette.info.main,
              }}
            >
              <KeyboardIcon fontSize="small" />
            </Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {t("student.messageEnterCode")}
            </Typography>
          </DisplayPanel>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <DisplayPanel
            sx={{
              cursor: 'pointer',
              '&:hover': { borderColor: theme.palette.primary.main, border: `1px solid ${theme.palette.primary.main}` },
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
            onClick={() => navigate('/student/history')}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: theme.palette.warning.bg ?? '#FFF3E0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: theme.palette.warning.main,
              }}
            >
              <HistoryIcon fontSize="small" />
            </Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {t("student.messageViewHistory")}
            </Typography>
          </DisplayPanel>
        </Grid>
      </Grid>

      {/* FAB */}
      <Fab
        color="primary"
        variant="extended"
        sx={{ position: 'fixed', bottom: 32, right: 32 }}
        onClick={() => setOpen(true)}
      >
        <KeyboardIcon sx={{ mr: 1 }} />
        {t("student.messageEnterCode")}
      </Fab>

      {/* Mark Attendance Dialog */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">

        <DialogTitle>{t("student.dialogTitle")}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {t("student.dialogContent")}
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
          )}
          {success && result ? (
            <Alert severity="success">
              {t("student.messageAttendanceMarked")} {result.attendanceId.lectureId}
            </Alert>
          ) : (
            <TextField
              label={t("student.dialogTextField")}
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
            {success ? `${t("student.close")}` : `${t("student.cancel")}`}
          </Button>
          {!success && (
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading || !joinCode.trim()}
            >
              {loading ? <CircularProgress size={20} color="inherit" /> : `${t("student.dialogSubmit")}`}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default DashboardPage;
