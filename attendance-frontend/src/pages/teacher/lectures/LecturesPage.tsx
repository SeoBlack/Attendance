import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Stack,
  Alert,
  Chip,
  Tooltip,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import { api } from '../../../api';
import type { Lecture } from '../../../entities/lecture';

function LecturesPage() {
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const loadLectures = () => {
    setLoading(true);
    setError('');
    api.lectures.getLectures()
      .then(async (resp) => {
        if (!resp.ok) {
          const body = (await resp.text()).trim();
          throw new Error(body || t('teacher.lectures.errors.loadFailed'));
        }
        const data = await resp.json();
        setLectures(data as Lecture[]);
      })
      .catch((e: any) => setError(e?.message || t('teacher.lectures.errors.loadFailed')))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadLectures();
  }, [t]);

  const handleDelete = (id: number) => {
    if (!confirm(t('teacher.lectures.confirmDelete'))) return;
    api.lectures.deleteLecture(id)
      .then(async (resp) => {
        if (!resp.ok) {
          const body = (await resp.text()).trim();
          throw new Error(body || t('teacher.lectures.errors.deleteFailed'));
        }
        loadLectures();
      })
      .catch((e: any) => setError(e?.message || t('teacher.lectures.errors.deleteFailed')));
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleString(i18n.language);
  };

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Typography variant="h5" component="h1">{t('teacher.lectures.title')}</Typography>
      </Stack>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('teacher.lectures.table.id')}</TableCell>
              <TableCell>{t('teacher.lectures.table.description')}</TableCell>
              <TableCell>{t('teacher.lectures.table.joinCode')}</TableCell>
              <TableCell>{t('teacher.lectures.table.start')}</TableCell>
              <TableCell>{t('teacher.lectures.table.end')}</TableCell>
              <TableCell align="right">{t('teacher.lectures.table.actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6}>{t('teacher.lectures.loading')}</TableCell>
              </TableRow>
            ) : lectures.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6}>{t('teacher.lectures.empty')}</TableCell>
              </TableRow>
            ) : (
              lectures.map((lecture) => (
                <TableRow key={lecture.id} hover>
                  <TableCell>{lecture.id}</TableCell>
                  <TableCell>{lecture.description}</TableCell>
                  <TableCell>
                    <Chip
                      label={lecture.joinCode || '—'}
                      size="small"
                      color="primary"
                      variant="outlined"
                      sx={{ fontFamily: 'monospace', fontWeight: 600, letterSpacing: 1 }}
                    />
                  </TableCell>
                  <TableCell>{formatDate(lecture.startDate)}</TableCell>
                  <TableCell>{formatDate(lecture.endDate)}</TableCell>
                  <TableCell align="right">
                    <Tooltip title={t('teacher.lectures.tooltips.viewDashboard')}>
                      <IconButton
                        aria-label={t('teacher.lectures.aria.viewDashboard')}
                        color="primary"
                        onClick={() => navigate(`/teacher/lectures/${lecture.id}`)}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                    <IconButton
                      aria-label={t('teacher.lectures.aria.delete')}
                      color="error"
                      onClick={() => handleDelete(lecture.id!)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default LecturesPage;
