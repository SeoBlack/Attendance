import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const loadLectures = () => {
    setLoading(true);
    setError('');
    api.lectures.getLectures()
      .then(async (resp) => {
        if (!resp.ok) throw new Error(await resp.text() || 'Failed to load lectures');
        const data = await resp.json();
        setLectures(data as Lecture[]);
      })
      .catch((e: any) => setError(e?.message || 'Failed to load lectures'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadLectures();
  }, []);

  const handleDelete = (id: number) => {
    if (!confirm('Are you sure you want to delete this lecture?')) return;
    api.lectures.deleteLecture(id)
      .then(async (resp) => {
        if (!resp.ok) throw new Error(await resp.text() || 'Failed to delete lecture');
        loadLectures();
      })
      .catch((e: any) => setError(e?.message || 'Failed to delete lecture'));
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleString();
  };

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Typography variant="h5" component="h1">Lectures</Typography>
      </Stack>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Join Code</TableCell>
              <TableCell>Start</TableCell>
              <TableCell>End</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6}>Loading...</TableCell>
              </TableRow>
            ) : lectures.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6}>No lectures found. Start a lecture from the Courses page.</TableCell>
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
                    <Tooltip title="View Dashboard">
                      <IconButton aria-label="view" color="primary" onClick={() => navigate(`/teacher/lectures/${lecture.id}`)}>
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                    <IconButton aria-label="delete" color="error" onClick={() => handleDelete(lecture.id!)}>
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
