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
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import UploadEnrollmentsButton from '../../../components/enrollments/UploadEnrollmentsButton';

import { api } from '../../../api';
import type { Course } from '../../../entities/course';
import type { Enrollment } from '../../../entities/enrollment';

function EnrollmentsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const courseId = Number(id);

  const [course, setCourse] = useState<Course | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

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
          <UploadEnrollmentsButton
            courseId={courseId}
            onUploaded={loadData}
            onError={(msg) => setError(msg)}
            title="Upload enrollments"
          />
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
    </Box>
  );
}

export default EnrollmentsPage;
