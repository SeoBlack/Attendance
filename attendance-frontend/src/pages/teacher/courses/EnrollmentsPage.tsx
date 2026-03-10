import {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
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
        if (!courseResp.ok) throw new Error(await courseResp.text() || 'Failed to load course');
        if (!enrollmentsResp.ok) throw new Error(await enrollmentsResp.text() || 'Failed to load enrollments');
        const courseData = await courseResp.json();
        const enrollmentsData = await enrollmentsResp.json();
        setCourse(courseData as Course);
        setEnrollments(enrollmentsData as Enrollment[]);
      })
      .catch((e: any) => setError(e?.message || 'Failed to load data'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [courseId]);

  const handleRemove = async (enrollmentId: number) => {
    if (!courseId || Number.isNaN(courseId)) return;
    if (!confirm('Remove this enrollment from the course?')) return;
    setError('');
    try {
      const resp = await api.enrollments.deleteEnrollment(courseId, enrollmentId);
      if (!resp.ok) throw new Error((await resp.text()) || 'Failed to remove enrollment');
      // reload list
      loadData();
    } catch (e: any) {
      setError(e?.message || 'Failed to remove enrollment');
    }
  }

  const handleAddStudent = async () => {
    if (!addForm.firstName.trim() || !addForm.lastName.trim() || !addForm.email.trim()) return;
    setAddLoading(true);
    setAddError('');
    try {
      const resp = await api.enrollments.enrollOneStudent(courseId, addForm);
      if (!resp.ok) throw new Error((await resp.text()) || 'Failed to add student');
      setAddDialogOpen(false);
      setAddForm({ firstName: '', lastName: '', email: '' });
      loadData();
    } catch (e: any) {
      setAddError(e?.message || 'Failed to add student');
    } finally {
      setAddLoading(false);
    }
  };

  const handleDeleteEnrollments = async () => {
    if (!confirm('Remove all enrollments from the course?')) return;
    try{
      const resp = await api.enrollments.deleteAllEnrollments(courseId);
      if (!resp.ok) throw new Error((await resp.text()) || 'Failed to remove enrollment');
      loadData();
    }catch (e: any) {
      setError(e?.message || 'Failed to remove enrollments');
    }
  }

  const deleteButtonDisabled = enrollments.length === 0;

  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }} justifyContent="space-between">
        <Stack direction="row" alignItems="center" spacing={1}>
          <IconButton aria-label="back" onClick={() => navigate('/teacher/courses')}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5" component="h1">
            {course ? `Enrollments · ${course.courseName}` : 'Enrollments'}
          </Typography>
        </Stack>
        {courseId ? (
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              startIcon={<PersonAddIcon />}
              onClick={() => setAddDialogOpen(true)}
            >
              Add Student
            </Button>
            <UploadEnrollmentsButton
              courseId={courseId}
              onUploaded={loadData}
              onError={(msg) => setError(msg)}
              title="Upload enrollments"
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
              <TableCell>ID</TableCell>
              <TableCell>First name</TableCell>
              <TableCell>Second name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5}>Loading...</TableCell>
              </TableRow>
            ) : enrollments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5}>No enrollments found.</TableCell>
              </TableRow>
            ) : (
              enrollments.map((e) => (
                <TableRow key={e.id} hover>
                  <TableCell>{e.id}</TableCell>
                  <TableCell>{e.firstName}</TableCell>
                  <TableCell>{e.lastName}</TableCell>
                  <TableCell>{e.email}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="Remove">
                      <IconButton aria-label="remove" color="error" onClick={() => handleRemove(e.id)}>
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
        <DialogTitle>Add Student</DialogTitle>
        <DialogContent>
          {addError && <Alert severity="error" sx={{ mb: 2 }}>{addError}</Alert>}
          <TextField
            label="First Name"
            value={addForm.firstName}
            onChange={(e) => setAddForm((f) => ({ ...f, firstName: e.target.value }))}
            fullWidth
            margin="dense"
            disabled={addLoading}
          />
          <TextField
            label="Last Name"
            value={addForm.lastName}
            onChange={(e) => setAddForm((f) => ({ ...f, lastName: e.target.value }))}
            fullWidth
            margin="dense"
            disabled={addLoading}
          />
          <TextField
            label="Email"
            type="email"
            value={addForm.email}
            onChange={(e) => setAddForm((f) => ({ ...f, email: e.target.value }))}
            fullWidth
            margin="dense"
            disabled={addLoading}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setAddDialogOpen(false); setAddError(''); }} disabled={addLoading}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleAddStudent}
            disabled={addLoading || !addForm.firstName.trim() || !addForm.lastName.trim() || !addForm.email.trim()}
          >
            {addLoading ? <CircularProgress size={20} color="inherit" /> : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default EnrollmentsPage;
