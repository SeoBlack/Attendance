import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
} from '@mui/material';
import DisplayPanel from '../../components/common/DisplayPanel';
import { student } from '../../api';

type HistoryRecord = {
  lectureId: number;
  courseName: string;
  lectureDescription: string;
  lectureStartDate: string;
  lectureEndDate: string;
  present: boolean;
  scannedAt: string | null;
};

function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })
    + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function AttendanceHistoryPage() {
  const theme = useTheme();
  const [records, setRecords] = useState<HistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const response = await student.getHistory();
        if (response.ok) {
          const data = await response.json();
          setRecords(data.records);
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 1, sm: 3 } }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        Attendance History
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Your complete attendance record across all enrolled courses.
      </Typography>

      {records.length === 0 ? (
        <DisplayPanel>
          <Typography variant="body2" color="text.secondary">
            No attendance records yet.
          </Typography>
        </DisplayPanel>
      ) : (
        <DisplayPanel padding={0}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Course</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Lecture</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Time</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Marked At</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {records.map((record) => (
                  <TableRow
                    key={record.lectureId}
                    sx={{
                      '&:last-child td': { borderBottom: 0 },
                      backgroundColor: record.present
                        ? `${theme.palette.success.main}06`
                        : `${theme.palette.error.main}06`,
                    }}
                  >
                    <TableCell>
                      {new Date(record.lectureStartDate).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {record.courseName}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {record.lectureDescription || '-'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {formatTime(record.lectureStartDate)} - {formatTime(record.lectureEndDate)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={record.present ? 'Present' : 'Absent'}
                        color={record.present ? 'success' : 'error'}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {record.scannedAt ? formatDateTime(record.scannedAt) : '-'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DisplayPanel>
      )}
    </Box>
  );
}

export default AttendanceHistoryPage;
