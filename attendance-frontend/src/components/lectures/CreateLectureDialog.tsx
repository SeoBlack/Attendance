import { useState } from 'react';
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
  const { addLecture } = useLectureContext();
  const [description, setDescription] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
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
      setError('End date must be after start date');
      return;
    }

    setSaving(true);
    setError('');

    api.lectures
      .createLecture({
        courseId,
        description: description.trim(),
        startDate: start.toISOString(),
        endDate: end.toISOString(),
      })
      .then(async (resp) => {
        if (!resp.ok) throw new Error((await resp.text()) || 'Failed to create lecture');
        const lecture: Lecture = await resp.json();
        addLecture(lecture);
        onCreated(lecture);
        resetForm();
      })
      .catch((e: any) => setError(e?.message || 'Failed to create lecture'))
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
        <DialogTitle>Create Lecture</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            {error && <Alert severity="error">{error}</Alert>}
            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              multiline
              minRows={2}
              fullWidth
              disabled={saving}
            />
            <TextField
              label="Start Date & Time"
              type="datetime-local"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              fullWidth
              disabled={saving}
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <TextField
              label="End Date & Time"
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
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <ActionButton variant="outlined" onClick={handleClose} disabled={saving}>
            Cancel
          </ActionButton>
          <ActionButton type="submit" color="brand" disabled={!canSave || saving}>
            {saving ? 'Creating...' : 'Create'}
          </ActionButton>
        </DialogActions>
      </form>
    </Dialog>
  );
}
