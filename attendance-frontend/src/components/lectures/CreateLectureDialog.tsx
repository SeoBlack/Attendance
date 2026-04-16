import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  Alert,
} from '@mui/material';
import { ActionButton } from '../common';
import { api } from '../../api';
import { useLectureContext } from '../../context/LectureContext';
import type { Lecture } from '../../entities/lecture';

interface CreateLectureDialogProps {
  open: boolean;
  courseId: number;
  onClose: () => void;
  onCreated: (lecture: Lecture) => void;
}

export default function CreateLectureDialog({
  open,
  courseId,
  onClose,
  onCreated,
}: CreateLectureDialogProps) {
  const { t } = useTranslation();
  const { addLecture } = useLectureContext();

  const toDatetimeLocal = (date: Date) => {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };

  const [description, setDescription] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  useEffect(() => {
    if (open) {
      const now = new Date();
      const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
      setStartDate(toDatetimeLocal(now));
      setEndDate(toDatetimeLocal(oneHourLater));
    }
  }, [open]);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const canSave =
    description.trim().length > 0 &&
    startDate.length > 0 &&
    endDate.length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSave) return;

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end <= start) {
      setError(t('teacher.lectures.errors.invalidDateRange'));
      return;
    }

    setSaving(true);
    setError('');

    api.lectures
      .createLecture({
        courseId,
        description: description.trim(),
        startDate: start.getTime(),
        endDate: end.getTime(),
      })
      .then(async (resp) => {
        if (!resp.ok) {
          const body = (await resp.text()).trim();
          throw new Error(body || t('teacher.lectures.errors.createFailed'));
        }
        const lecture: Lecture = await resp.json();
        addLecture(lecture);
        onCreated(lecture);
        resetForm();
      })
      .catch((e: any) => setError(e?.message || t('teacher.lectures.errors.createFailed')))
      .finally(() => setSaving(false));
  };

  const resetForm = () => {
    setDescription('');
    setStartDate('');
    setEndDate('');
    setError('');
  };

  const handleClose = () => {
    if (saving) return;
    resetForm();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{t('teacher.lectures.dialog.title')}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            {error && <Alert severity="error">{error}</Alert>}
            <TextField
              label={t('teacher.lectures.dialog.fields.description')}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              multiline
              minRows={2}
              fullWidth
              disabled={saving}
            />
            <TextField
              label={t('teacher.lectures.dialog.fields.startDate')}
              type="datetime-local"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              fullWidth
              disabled={saving}
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <TextField
              label={t('teacher.lectures.dialog.fields.endDate')}
              type="datetime-local"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
              fullWidth
              disabled={saving}
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, flexWrap: 'wrap', gap: 1 }}>
          <ActionButton variant="outlined" onClick={handleClose} disabled={saving}>
            {t('teacher.lectures.dialog.actions.cancel')}
          </ActionButton>
          <ActionButton type="submit" color="brand" disabled={!canSave || saving}>
            {saving
              ? t('teacher.lectures.dialog.actions.creating')
              : t('teacher.lectures.dialog.actions.create')}
          </ActionButton>
        </DialogActions>
      </form>
    </Dialog>
  );
}
