import {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
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
  Alert,
  Stack,
  IconButton,
  Tooltip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import UploadEnrollmentsButton from '../../../components/enrollments/UploadEnrollmentsButton';

import { api } from '../../../api';
import type { Course } from '../../../entities/course';
import type { Enrollment } from '../../../entities/enrollment';
import DeleteEnrollmentsButton from "../../../components/enrollments/DeleteEnrollmentsButton.";

function EnrollmentsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const courseId = Number(id);

  const [course, setCourse] = useState<Course | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [addForm, setAddForm] = useState({ firstName: '', lastName: '', email: '' });
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState('');

  const loadData = () => {
    if (!courseId || Number.isNaN(courseId)) return;
    setLoading(true);
    setError('');
    Promise.all([
      api.courses.getCourse(courseId),
      api.enrollments.getEnrollments(courseId)
    ])
      .then(async ([courseResp, enrollmentsResp]) => {
        if (!courseResp.ok) {
          const body = (await courseResp.text()).trim();
          throw new Error(body || t('teacher.enrollments.errors.loadCourseFailed'));
        }
        if (!enrollmentsResp.ok) {
          const body = (await enrollmentsResp.text()).trim();
          throw new Error(body || t('teacher.enrollments.errors.loadEnrollmentsFailed'));
        }
        const courseData = await courseResp.json();
        const enrollmentsData = await enrollmentsResp.json();
        setCourse(courseData as Course);
        setEnrollments(enrollmentsData as Enrollment[]);
      })
      .catch((e: any) => setError(e?.message || t('teacher.enrollments.errors.loadDataFailed')))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [courseId, t]);

  const handleRemove = async (enrollmentId: number) => {
    if (!courseId || Number.isNaN(courseId)) return;
    if (!confirm(t('teacher.enrollments.confirmRemoveOne'))) return;
    setError('');
    try {
      const resp = await api.enrollments.deleteEnrollment(courseId, enrollmentId);
      if (!resp.ok) {
        const body = (await resp.text()).trim();
        throw new Error(body || t('teacher.enrollments.errors.removeFailed'));
      }
      // reload list
      loadData();
    } catch (e: any) {
      setError(e?.message || t('teacher.enrollments.errors.removeFailed'));
    }
  }

  const handleAddStudent = async () => {
    if (!addForm.firstName.trim() || !addForm.lastName.trim() || !addForm.email.trim()) return;
    setAddLoading(true);
    setAddError('');
    try {
      const resp = await api.enrollments.enrollOneStudent(courseId, addForm);
      if (!resp.ok) {
        const body = (await resp.text()).trim();
        throw new Error(body || t('teacher.enrollments.errors.addStudentFailed'));
      }
      setAddDialogOpen(false);
      setAddForm({ firstName: '', lastName: '', email: '' });
      loadData();
    } catch (e: any) {
      setAddError(e?.message || t('teacher.enrollments.errors.addStudentFailed'));
    } finally {
      setAddLoading(false);
    }
  };

  const handleDeleteEnrollments = async () => {
    if (!confirm(t('teacher.enrollments.confirmRemoveAll'))) return;
    try{
      const resp = await api.enrollments.deleteAllEnrollments(courseId);
      if (!resp.ok) {
        const body = (await resp.text()).trim();
        throw new Error(body || t('teacher.enrollments.errors.removeAllFailed'));
      }
      loadData();
    }catch (e: any) {
      setError(e?.message || t('teacher.enrollments.errors.removeAllFailed'));
    }
  }

  const deleteButtonDisabled = enrollments.length === 0;

  return (
    <Box>
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        sx={{ mb: 2, rowGap: 1.5, flexWrap: 'wrap' }}
        justifyContent="space-between"
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <IconButton
            aria-label={t('teacher.enrollments.aria.back')}
            onClick={() => navigate('/teacher/courses')}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5" component="h1">
            {course
              ? t('teacher.enrollments.titleWithCourse', { courseName: course.courseName })
              : t('teacher.enrollments.title')}
          </Typography>
        </Stack>
        {courseId ? (
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', rowGap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<PersonAddIcon />}
              onClick={() => setAddDialogOpen(true)}
            >
              {t('teacher.enrollments.actions.addStudent')}
            </Button>
            <UploadEnrollmentsButton
              courseId={courseId}
              onUploaded={loadData}
              onError={(msg) => setError(msg)}
              title={t('teacher.enrollments.actions.upload')}
            />
            <DeleteEnrollmentsButton onClick={handleDeleteEnrollments} disabled={deleteButtonDisabled} />
          </Stack>
        ) : null}
      </Stack>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('teacher.enrollments.table.id')}</TableCell>
              <TableCell>{t('teacher.enrollments.table.firstName')}</TableCell>
              <TableCell>{t('teacher.enrollments.table.lastName')}</TableCell>
              <TableCell>{t('teacher.enrollments.table.email')}</TableCell>
              <TableCell align="right">{t('teacher.enrollments.table.actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5}>{t('teacher.enrollments.states.loading')}</TableCell>
              </TableRow>
            ) : enrollments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5}>{t('teacher.enrollments.states.empty')}</TableCell>
              </TableRow>
            ) : (
              enrollments.map((e) => (
                <TableRow key={e.id} hover>
                  <TableCell>{e.id}</TableCell>
                  <TableCell>{e.firstName}</TableCell>
                  <TableCell>{e.lastName}</TableCell>
                  <TableCell>{e.email}</TableCell>
                  <TableCell align="right">
                    <Tooltip title={t('teacher.enrollments.tooltips.remove')}>
                      <IconButton
                        aria-label={t('teacher.enrollments.aria.remove')}
                        color="error"
                        onClick={() => handleRemove(e.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={addDialogOpen} onClose={() => { setAddDialogOpen(false); setAddError(''); }} fullWidth maxWidth="sm">
        <DialogTitle>{t('teacher.enrollments.dialogs.addStudent.title')}</DialogTitle>
        <DialogContent>
          {addError && <Alert severity="error" sx={{ mb: 2 }}>{addError}</Alert>}
          <TextField
            label={t('teacher.enrollments.dialogs.addStudent.firstName')}
            value={addForm.firstName}
            onChange={(e) => setAddForm((f) => ({ ...f, firstName: e.target.value }))}
            fullWidth
            margin="dense"
            disabled={addLoading}
          />
          <TextField
            label={t('teacher.enrollments.dialogs.addStudent.lastName')}
            value={addForm.lastName}
            onChange={(e) => setAddForm((f) => ({ ...f, lastName: e.target.value }))}
            fullWidth
            margin="dense"
            disabled={addLoading}
          />
          <TextField
            label={t('teacher.enrollments.dialogs.addStudent.email')}
            type="email"
            value={addForm.email}
            onChange={(e) => setAddForm((f) => ({ ...f, email: e.target.value }))}
            fullWidth
            margin="dense"
            disabled={addLoading}
          />
        </DialogContent>
        <DialogActions sx={{ flexWrap: 'wrap', gap: 1 }}>
          <Button onClick={() => { setAddDialogOpen(false); setAddError(''); }} disabled={addLoading}>
            {t('teacher.enrollments.dialogs.addStudent.cancel')}
          </Button>
          <Button
            variant="contained"
            onClick={handleAddStudent}
            disabled={addLoading || !addForm.firstName.trim() || !addForm.lastName.trim() || !addForm.email.trim()}
          >
            {addLoading
              ? <CircularProgress size={20} color="inherit" />
              : t('teacher.enrollments.dialogs.addStudent.submit')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default EnrollmentsPage;
