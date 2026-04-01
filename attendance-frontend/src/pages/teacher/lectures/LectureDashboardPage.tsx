import {useEffect, useState, useRef, useCallback} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    Box,
    Typography,
    Stack,
    Alert,
    Grid,
    useTheme, Divider,
} from '@mui/material';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import StopIcon from '@mui/icons-material/Stop';
import LaptopMacIcon from '@mui/icons-material/LaptopMac';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import {api} from '../../../api';
import {useLectureContext} from '../../../context/LectureContext';
import {ActionButton, StatCard, DisplayPanel} from '../../../components/common';
import type {Lecture} from '../../../entities/lecture';
import type {Course} from '../../../entities/course';
import PresentUser from "../../../entities/PresentUser";
import {PresentUserItem} from "./PresentUserItem";


function LectureDashboardPage() {
    const theme = useTheme();
    const { t } = useTranslation();
    const {id} = useParams<{ id: string }>();
    const navigate = useNavigate();
    const {getLectureById, addLecture} = useLectureContext();

    const [lecture, setLecture] = useState<Lecture | null>(null);
    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [totalStudents, setTotalStudents] = useState<number | null>(null);
    const [attendances, setAttendances] = useState<PresentUser[] | null>(null);
    const [timeLeft, setTimeLeft] = useState<string>(() =>
        t('common.placeholder.timeUnset'),
    );
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const lectureId = id ? parseInt(id, 10) : undefined;

    useEffect(() => {
        if (!lectureId) return;

        const cached = getLectureById(lectureId);
        if (cached) {
            setLecture(cached);
            loadRelatedData(cached);
            return;
        }

        setLoading(true);
        setError('');
        api.lectures
            .getLecture(lectureId)
            .then(async (resp) => {
                if (!resp.ok) {
                    const body = (await resp.text()).trim();
                    throw new Error(body || t('teacher.lectureDashboard.errors.loadFailed'));
                }
                const data: Lecture = await resp.json();
                addLecture(data);
                setLecture(data);
                loadRelatedData(data);
                loadAttendances(lectureId);
            })
            .catch((e: any) => setError(e?.message || t('teacher.lectureDashboard.errors.loadFailed')))
            .finally(() => setLoading(false));
    }, [lectureId, getLectureById, addLecture, t]);

    const startTimer = useCallback((endDate: string) => {
        if (timerRef.current) clearInterval(timerRef.current);

        const tick = () => {
            const end = new Date(endDate).getTime();
            const now = Date.now();
            const diff = end - now;
            if (diff <= 0) {
                setTimeLeft('00:00');
                if (timerRef.current) clearInterval(timerRef.current);
                return;
            }
            const mins = Math.floor(diff / 60000);
            const secs = Math.floor((diff % 60000) / 1000);
            setTimeLeft(`${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`);
        };

        tick();
        timerRef.current = setInterval(tick, 1000);
    }, []);

    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    const loadRelatedData = (lec: Lecture) => {
        // Fetch course details for the header subtitle
        api.courses
            .getCourse(lec.courseId)
            .then(async (resp) => {
                if (!resp.ok) return;
                const data: Course = await resp.json();
                setCourse(data);
            })
            .catch(() => {
            });

        // Fetch enrollment count for total students stat
        api.enrollments
            .getEnrollments(lec.courseId)
            .then(async (resp) => {
                if (!resp.ok) return;
                const data = await resp.json();
                setTotalStudents(Array.isArray(data) ? data.length : 0);
            })
            .catch(() => {
            });

        // Start countdown timer from lecture end date
        if (lec.endDate) {
            startTimer(lec.endDate);
        }
    };

    const loadAttendances = async (lectureId: number) => {
        api.attendance.getAttendances(lectureId).then(async (resp) => {
            if (!resp.ok) return;
            const data: PresentUser[] = await resp.json();
            setAttendances(data)
        }).catch(() => {
        });
    }

    const totalPresent = attendances?.length
    let totalAbsent = null;
    let attendanceRate = null;
    if (totalPresent && totalStudents !== null) {
        totalAbsent = totalStudents - totalPresent;
        attendanceRate = totalPresent * 100 / totalStudents;
    }

    const handleEndSession = () => {
        if (!confirm(t('teacher.lectureDashboard.confirmEndSession'))) return;
        navigate('/teacher/courses');
    };

    if (loading) {
        return (
            <Box>
                <Typography>{t('teacher.lectureDashboard.loading')}</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box>
                <Alert severity="error" sx={{mb: 2}}>{error}</Alert>
                <ActionButton variant="outlined" onClick={() => navigate('/teacher/courses')}>
                    {t('teacher.lectureDashboard.backToCourses')}
                </ActionButton>
            </Box>
        );
    }

    if (!lecture) {
        return (
            <Box>
                <Typography>{t('teacher.lectureDashboard.notFound')}</Typography>
            </Box>
        );
    }

    const codeChars = (lecture.joinCode || t('common.placeholder.joinCodeMask')).split('');

    return (
        <Box>
            {/* Header */}
            <Stack
                direction="row"
                alignItems="flex-start"
                justifyContent="space-between"
                sx={{mb: 3, rowGap: 1.5, flexWrap: 'wrap'}}
            >
                <Box>
                    <Typography variant="h5" component="h1" sx={{fontWeight: 700}}>
                        {t('teacher.lectureDashboard.sessionTitle')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{mt: 0.5}}>
                        {course ? `${course.courseName} - ${lecture.description}` : lecture.description}
                    </Typography>
                </Box>
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flexWrap: 'wrap', rowGap: 1 }}>
                    <ActionButton
                        variant="outlined"
                        startIcon={<NotificationsNoneIcon/>}
                        sx={{borderColor: 'divider', color: 'text.primary'}}
                    >
                        {t('teacher.lectureDashboard.actions.notifications')}
                    </ActionButton>
                    <ActionButton
                        color="error"
                        startIcon={<StopIcon/>}
                        onClick={handleEndSession}
                    >
                        {t('teacher.lectureDashboard.actions.endSession')}
                    </ActionButton>
                </Stack>
            </Stack>

            {/* Stat Cards */}
            <Grid container spacing={2} sx={{mb: 3}}>
                <Grid size={{xs: 12, sm: 6, md: 3}}>
                    <StatCard title={t('teacher.lectureDashboard.stats.totalStudents')} value={totalStudents !== null ? String(totalStudents) : t('common.placeholder.empty')}
                              icon={<LaptopMacIcon/>} color="primary"/>
                </Grid>
                <Grid size={{xs: 12, sm: 6, md: 3}}>
                    {/* Requires GET /attendance?lecture_id endpoint */}
                    <StatCard title={t('teacher.lectureDashboard.stats.present')} value={totalPresent ?? t('common.placeholder.empty')} icon={<CheckCircleIcon/>} color="success"/>
                </Grid>
                <Grid size={{xs: 12, sm: 6, md: 3}}>
                    {/* Requires GET /attendance?lecture_id endpoint */}
                    <StatCard title={t('teacher.lectureDashboard.stats.absent')} value={totalAbsent ?? t('common.placeholder.empty')} icon={<CancelIcon/>} color="error"/>
                </Grid>
                <Grid size={{xs: 12, sm: 6, md: 3}}>
                    {/* Requires GET /attendance?lecture_id endpoint */}
                    <StatCard title={t('teacher.lectureDashboard.stats.attendanceRate')} value={attendanceRate ? `${Math.round(attendanceRate)} %` : t('common.placeholder.emptyPercent')}
                              icon={<TrendingUpIcon/>} color="info"/>
                </Grid>
            </Grid>

            {/* Numeric Code Panel */}
            <Box sx={{mb: 3}}>
                <DisplayPanel bordered>
                    <Typography variant="h6" sx={{fontWeight: 600, mb: 0.5}}>
                        {t('teacher.lectureDashboard.numericCode.title')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{mb: 2}}>
                        {t('teacher.lectureDashboard.numericCode.subtitle')}
                    </Typography>

                    {/* Join code from lecture.joinCode (generated by backend) */}
                    <Box
                        sx={{
                            background: `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
                            borderRadius: 2,
                            p: 3,
                            textAlign: 'center',
                            mb: 3,
                            border: '2px dashed rgba(255,255,255,0.4)',
                        }}
                    >
                        <Typography variant="body2" sx={{color: 'rgba(255,255,255,0.85)', mb: 1}}>
                            {t('teacher.lectureDashboard.numericCode.enterCode')}
                        </Typography>
                        <Typography
                            variant="h2"
                            sx={{
                                fontWeight: 700,
                                color: 'common.white',
                                letterSpacing: 12,
                                fontFamily: 'monospace',
                            }}
                        >
                            {codeChars.join(' ')}
                        </Typography>
                        <Typography variant="caption" sx={{color: 'rgba(255,255,255,0.7)', mt: 1, display: 'block'}}>
                            {t('teacher.lectureDashboard.numericCode.validForSession')}
                        </Typography>
                    </Box>

                    {/* Marked/Unmarked counts require GET /attendance?lecture_id endpoint */}
                    <Stack spacing={2}>
                        {/* Marked Present */}
                        <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                            <Box sx={{display: 'flex', alignItems: 'center', gap: 1.5}}>
                                <Box
                                    sx={{
                                        width: 36,
                                        height: 36,
                                        borderRadius: '50%',
                                        bgcolor: theme.palette.success.bg,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <CheckIcon sx={{fontSize: 18, color: 'success.main'}}/>
                                </Box>
                                <Box>
                                    <Typography variant="body2" sx={{fontWeight: 600}}>
                                        {t('teacher.lectureDashboard.attendanceSummary.marked')}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {t('teacher.lectureDashboard.attendanceSummary.present')}
                                    </Typography>
                                </Box>
                            </Box>
                            <Typography variant="h5" sx={{fontWeight: 700}}>{t('common.placeholder.empty')}</Typography>
                        </Box>

                        {/* Unmarked Pending */}
                        <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                            <Box sx={{display: 'flex', alignItems: 'center', gap: 1.5}}>
                                <Box
                                    sx={{
                                        width: 36,
                                        height: 36,
                                        borderRadius: '50%',
                                        bgcolor: theme.palette.error.bg,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <CloseIcon sx={{fontSize: 18, color: 'error.main'}}/>
                                </Box>
                                <Box>
                                    <Typography variant="body2" sx={{fontWeight: 600}}>
                                        {t('teacher.lectureDashboard.attendanceSummary.unmarked')}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {t('teacher.lectureDashboard.attendanceSummary.pending')}
                                    </Typography>
                                </Box>
                            </Box>
                            <Typography variant="h5" sx={{fontWeight: 700}}>{t('common.placeholder.empty')}</Typography>
                        </Box>

                        <Box
                            sx={{
                                bgcolor: theme.palette.info.bg,
                                borderRadius: 2,
                                p: 2,
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: 1.5,
                            }}
                        >
                            <InfoOutlinedIcon sx={{color: 'info.main', fontSize: 20, mt: 0.25}}/>
                            <Box>
                                <Typography variant="body2" sx={{fontWeight: 600}}>
                                    {t('teacher.lectureDashboard.timer.title')}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {timeLeft === '00:00' ? (
                                        t('teacher.lectureDashboard.timer.ended')
                                    ) : (
                                        t('teacher.lectureDashboard.timer.autoCloseIn', { timeLeft })
                                    )}
                                </Typography>
                            </Box>
                        </Box>
                    </Stack>
                </DisplayPanel>
            </Box>

            {/* Recent Activity — requires GET /attendance?lecture_id endpoint */}
            <DisplayPanel bordered>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{mb: 2}}>
                    <Typography variant="h6" sx={{fontWeight: 600}}>
                        {t('teacher.lectureDashboard.presentStudents')}
                    </Typography>
                </Stack>
                <Stack direction="column" spacing={2} divider={<Divider />}>
                {attendances?.map(a => <PresentUserItem key={a.id} name={`${a.firstName} ${a.lastName}`} email={a.email}/>)}
                </Stack>
            </DisplayPanel>
        </Box>
    );
}

export default LectureDashboardPage;
