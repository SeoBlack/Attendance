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
import { useTranslation } from "react-i18next";

type HistoryRecord = {
  lectureId: number;
  courseName: string;
  lectureDescription: string;
  lectureStartDate: string;
  lectureEndDate: string;
  present: boolean;
  scannedAt: string | null;
};

function formatDateTime(dateStr: string, locale: string): string {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat(locale, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date) + ' ' + new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function formatTime(dateStr: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateStr));
}

function AttendanceHistoryPage() {
  const theme = useTheme();
  const [records, setRecords] = useState<HistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const { t, i18n } = useTranslation();

  const localeMap: Record<string, string> = {
    en: "en-US",
    ru: "ru-RU",
    ar: "ar-EG",
  }

  const locale = localeMap[i18n.resolvedLanguage ?? i18n.language] ?? "en-US";


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
        {t("student.historyTitle")}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        {t("student.historyDescription")}
      </Typography>

      {records.length === 0 ? (
        <DisplayPanel>
          <Typography variant="body2" color="text.secondary">
            {t("student.historyNoRec")}
          </Typography>
        </DisplayPanel>
      ) : (
        <DisplayPanel padding={0}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>{t("student.date")}</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{t("student.course")}</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{t("student.lecture")}</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{t("student.time")}</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{t("student.status")}</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{t("student.markedAt")}</TableCell>
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
                      {new Intl.DateTimeFormat(locale, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        }).format(new Date(record.lectureStartDate))}
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
                        {formatTime(record.lectureStartDate, locale)} - {formatTime(record.lectureEndDate, locale)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={record.present ? `${t("student.present")}` : `${t("student.absent")}`}
                        color={record.present ? 'success' : 'error'}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {record.scannedAt ? formatDateTime(record.scannedAt, locale) : '-'}
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
