import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import UploadIcon from '@mui/icons-material/Upload';

import {api} from '../../../api';
import type {Course} from '../../../entities/course';
import {ActionButton} from '../../../components/common';

function CoursesPage() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [uploadingCourseId, setUploadingCourseId] = useState<number | null>(null);

  const loadCourses = () => {
    setLoading(true);
    setError('');
    api.courses.getCourses()
      .then(async (resp) => {
        if (!resp.ok) throw new Error(await resp.text() || 'Failed to load courses');
        const data = await resp.json();
        setCourses(data as Course[]);
      })
      .catch((e: any) => setError(e?.message || 'Failed to load courses'))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadCourses();
  }, []);

  const handleCreate = () => navigate('/teacher/courses/create');
  const handleEdit = (id: number) => navigate(`/teacher/courses/create?id=${id}`);
  const handleDelete = (id: number) => {
    if (!confirm('Are you sure you want to delete this course?')) return;
    api.courses.deleteCourse(id)
      .then(async (resp) => {
        if (!resp.ok) throw new Error(await resp.text() || 'Failed to delete course');
        loadCourses();
      })
      .catch((e: any) => setError(e?.message || 'Failed to delete course'))
  }

  const triggerFileDialog = (courseId: number) => {
    const el = document.getElementById(`enrollments-file-${courseId}`) as HTMLInputElement | null;
    el?.click();
  }

  const handleFileSelected = async (courseId: number, ev: React.ChangeEvent<HTMLInputElement>) => {
    const file = ev.target.files?.[0];
    ev.target.value = '';
    if (!file) return;
    setError('');
    setUploadingCourseId(courseId);
    try {
      const resp = await api.courses.uploadEnrollments(courseId, file);
      if (!resp.ok) throw new Error(await resp.text() || 'Failed to upload enrollments');
    } catch (e: any) {
      setError(e?.message || 'Failed to upload enrollments');
    } finally {
      setUploadingCourseId(null);
    }
  }

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{mb: 2}}>
        <Typography variant="h5" component="h1">Courses</Typography>
        <ActionButton startIcon={<AddIcon/>} color="brand" onClick={handleCreate}>Create Course</ActionButton>
      </Stack>

      {error && <Alert severity="error" sx={{mb: 2}}>{error}</Alert>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4}>Loading...</TableCell>
              </TableRow>
            ) : courses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4}>No courses found.</TableCell>
              </TableRow>
            ) : (
              courses.map((course) => (
                <TableRow key={course.id} hover>
                  <TableCell>{course.id}</TableCell>
                  <TableCell>{course.courseName}</TableCell>
                  <TableCell>{course.description}</TableCell>
                  <TableCell align="right">
                    <Box component="form" sx={{display: 'inline'}}>
                      <input
                        id={`enrollments-file-${course.id}`}
                        type="file"
                        accept=".xml, application/xml"
                        style={{ display: 'none' }}
                        onChange={(ev) => handleFileSelected(course.id!, ev)}
                      />
                      <IconButton
                        aria-label="upload-enrollments"
                        onClick={() => triggerFileDialog(course.id!)}
                        disabled={uploadingCourseId === course.id}
                        title="Upload enrollments"
                      >
                        <UploadIcon/>
                      </IconButton>
                    </Box>
                    <IconButton aria-label="edit" onClick={() => handleEdit(course.id!)}>
                      <EditIcon/>
                    </IconButton>
                    <IconButton aria-label="delete" color="error" onClick={() => handleDelete(course.id!)}>
                      <DeleteIcon/>
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default CoursesPage;
