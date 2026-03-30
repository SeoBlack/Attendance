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
  Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import GroupIcon from '@mui/icons-material/Group';

import { api } from '../../../api';
import type { Course } from '../../../entities/course';
import type { Lecture } from '../../../entities/lecture';
import { ActionButton } from '../../../components/common';
import CreateLectureDialog from '../../../components/lectures/CreateLectureDialog';

function CoursesPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [lectureDialogOpen, setLectureDialogOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  // upload state moved into UploadEnrollmentsButton component

  const loadCourses = () => {
    setLoading(true);
    setError('');
    api.courses.getCourses()
      .then(async (resp) => {
        if (!resp.ok) {
          const body = (await resp.text()).trim();
          throw new Error(body || t('teacher.courses.errors.loadFailed'));
        }
        const data = await resp.json();
        setCourses(data as Course[]);
      })
      .catch((e: any) =>
        setError(e?.message || t('teacher.courses.errors.loadFailed')),
      )
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadCourses();
  }, []);

  const handleCreate = () => navigate('/teacher/courses/create');
  const handleEdit = (id: number) => navigate(`/teacher/courses/update/${id}`);
  const handleViewEnrollments = (id: number) => navigate(`/teacher/courses/${id}/enrollments`);
  const handleStartLecture = (courseId: number) => {
    setSelectedCourseId(courseId);
    setLectureDialogOpen(true);
  };
  const handleLectureCreated = (lecture: Lecture) => {
    setLectureDialogOpen(false);
    setSelectedCourseId(null);
    navigate(`/teacher/lectures/${lecture.id}`);
  };
  const handleDelete = (id: number) => {
    if (!confirm(t('teacher.courses.confirmDelete'))) return;
    api.courses.deleteCourse(id)
      .then(async (resp) => {
        if (!resp.ok) {
          const body = (await resp.text()).trim();
          throw new Error(body || t('teacher.courses.errors.deleteFailed'));
        }
        loadCourses();
      })
      .catch((e: any) =>
        setError(e?.message || t('teacher.courses.errors.deleteFailed')),
      )
  }


  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{mb: 2}}>
        <Typography variant="h5" component="h1">
          {t('teacher.courses.title')}
        </Typography>
        <ActionButton
          startIcon={<AddIcon />}
          color="brand"
          onClick={handleCreate}
        >
          {t('teacher.courses.createCourse')}
        </ActionButton>
      </Stack>

      {error && <Alert severity="error" sx={{mb: 2}}>{error}</Alert>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('teacher.courses.table.id')}</TableCell>
              <TableCell>{t('teacher.courses.table.name')}</TableCell>
              <TableCell>{t('teacher.courses.table.description')}</TableCell>
              <TableCell align="right">{t('teacher.courses.table.actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4}>{t('teacher.courses.loading')}</TableCell>
              </TableRow>
            ) : courses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4}>{t('teacher.courses.empty')}</TableCell>
              </TableRow>
            ) : (
              courses.map((course) => (
                <TableRow key={course.id} hover>
                  <TableCell>{course.id}</TableCell>
                  <TableCell>{course.courseName}</TableCell>
                  <TableCell>{course.description}</TableCell>
                  <TableCell align="right">
                    <Tooltip title={t('teacher.courses.tooltips.startLecture')}>
                      <IconButton
                        aria-label={t('teacher.courses.aria.startLecture')}
                        color="primary"
                        onClick={() => handleStartLecture(course.id!)}
                      >
                        <PlayArrowIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={t('teacher.courses.tooltips.enrollments')}>
                      <IconButton
                        aria-label={t('teacher.courses.aria.enrollments')}
                        onClick={() => handleViewEnrollments(course.id!)}
                      >
                        <GroupIcon />
                      </IconButton>
                    </Tooltip>
                    <IconButton
                      aria-label={t('teacher.courses.aria.edit')}
                      onClick={() => handleEdit(course.id!)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      aria-label={t('teacher.courses.aria.delete')}
                      color="error"
                      onClick={() => handleDelete(course.id!)}
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

      {selectedCourseId != null && (
        <CreateLectureDialog
          open={lectureDialogOpen}
          courseId={selectedCourseId}
          onClose={() => {
            setLectureDialogOpen(false);
            setSelectedCourseId(null);
          }}
          onCreated={handleLectureCreated}
        />
      )}
    </Box>
  )
}

export default CoursesPage;
