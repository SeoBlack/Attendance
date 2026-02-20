import {useEffect, useMemo, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {Box, Stack, Typography, Alert} from '@mui/material';
import {api} from '../../../api';
import type {Course} from '../../../entities/course';
import {ActionButton, FormTextField} from '../../../components/common';

function useQuery() {
    const {search} = useLocation();
    return useMemo(() => new URLSearchParams(search), [search]);
}

function CreateCoursePage() {
    const navigate = useNavigate();
    const query = useQuery();
    const idParam = query.get('id');
    const courseId = idParam ? parseInt(idParam, 10) : undefined;

    const isEdit = !!courseId;

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState<boolean>(false);
    const [saving, setSaving] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        if (!courseId) return;
        setLoading(true);
        setError('');
        api.courses.getCourse(courseId)
            .then(async (resp) => {
                if (!resp.ok) throw new Error(await resp.text() || 'Failed to load course');
                const c: Course = await resp.json();
                setName(c.courseName || '');
                setDescription(c.description || '');
            })
            .catch((e: any) => setError(e?.message || 'Failed to load course'))
            .finally(() => setLoading(false));
    }, [courseId]);

    const canSave = (name?.trim() || '').length > 0 && (description?.trim() || '').length > 0;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!canSave) return;
        setSaving(true);
        setError('');
        const payload: Course = {
            id: courseId || undefined,
            courseName: name.trim(),
            description: description.trim(),
        };
        api.courses.saveCourse(payload)
            .then(async (resp) => {
                if (!resp.ok) throw new Error(await resp.text() || 'Failed to save course');
                navigate('/teacher/courses');
            })
            .catch((e: any) => setError(e?.message || 'Failed to save course'))
            .finally(() => setSaving(false));
    };

    return (
        <Box component="form" onSubmit={handleSubmit}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{mb: 2}}>
                <Typography variant="h5" component="h1">{isEdit ? 'Edit Course' : 'Create Course'}</Typography>
            </Stack>

            {error && <Alert severity="error" sx={{mb: 2}}>{error}</Alert>}

            <Stack spacing={2} sx={{maxWidth: 600}}>
                <FormTextField
                    label="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={loading || saving}
                />
                <FormTextField
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    multiline
                    minRows={3}
                    disabled={loading || saving}
                />

                <Stack direction="row" spacing={2}>
                    <ActionButton type="submit" color="brand" disabled={!canSave || saving}>
                        {isEdit ? 'Update' : 'Create'}
                    </ActionButton>
                    <ActionButton variant="outlined" onClick={() => navigate('/teacher/courses')} disabled={saving}>
                        Cancel
                    </ActionButton>
                </Stack>
            </Stack>
        </Box>
    );
}

export default CreateCoursePage;
