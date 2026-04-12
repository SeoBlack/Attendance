import {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {Box, Stack, Typography, Alert} from '@mui/material';
import {api} from '../../../api';
import type {Course} from '../../../entities/course';
import {ActionButton, FormTextField} from '../../../components/common';
import i18n from '../../../i18n';

function CreateCoursePage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { id: idParam } = useParams<{ id: string }>();
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
                if (!resp.ok) {
                    const body = (await resp.text()).trim();
                    throw new Error(body || t('teacher.courseForm.errors.loadFailed'));
                }
                const c: Course = await resp.json();
                setName(c.courseName || '');
                setDescription(c.description || '');
            })
            .catch((e: any) => setError(e?.message || t('teacher.courseForm.errors.loadFailed')))
            .finally(() => setLoading(false));
    }, [courseId, t]);

    const canSave = (name?.trim() || '').length > 0 && (description?.trim() || '').length > 0;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!canSave) return;
        setSaving(true);
        setError('');
        const primary = (i18n.language || 'en').split('-')[0] || 'en';
        const payload: Course = {
            id: courseId || undefined,
            courseName: name.trim(),
            description: description.trim(),
            // Tells the API which translation row to write; keeps ar/en/ru rows separate when you switch UI language.
            defaultLocale: primary,
        };
        api.courses.saveCourse(payload)
            .then(async (resp) => {
                if (!resp.ok) {
                    const body = (await resp.text()).trim();
                    throw new Error(body || t('teacher.courseForm.errors.saveFailed'));
                }
                navigate('/teacher/courses');
            })
            .catch((e: any) => setError(e?.message || t('teacher.courseForm.errors.saveFailed')))
            .finally(() => setSaving(false));
    };

    return (
        <Box component="form" onSubmit={handleSubmit}>
            <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{mb: 2, rowGap: 1.5, flexWrap: 'wrap'}}
            >
                <Typography variant="h5" component="h1">
                    {t(isEdit ? 'teacher.courseForm.editTitle' : 'teacher.courseForm.createTitle')}
                </Typography>
            </Stack>

            {error && <Alert severity="error" sx={{mb: 2}}>{error}</Alert>}

            <Stack spacing={2} sx={{maxWidth: 600}}>
                <FormTextField
                    label={t('teacher.courseForm.fields.name')}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={loading || saving}
                />
                <FormTextField
                    label={t('teacher.courseForm.fields.description')}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    multiline
                    minRows={3}
                    disabled={loading || saving}
                />

                <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', rowGap: 1 }}>
                    <ActionButton type="submit" color="brand" disabled={!canSave || saving}>
                        {t(isEdit ? 'teacher.courseForm.actions.update' : 'teacher.courseForm.actions.create')}
                    </ActionButton>
                    <ActionButton variant="outlined" onClick={() => navigate('/teacher/courses')} disabled={saving}>
                        {t('teacher.courseForm.actions.cancel')}
                    </ActionButton>
                </Stack>
            </Stack>
        </Box>
    );
}

export default CreateCoursePage;
