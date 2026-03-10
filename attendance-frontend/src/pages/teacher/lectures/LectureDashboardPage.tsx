import {useEffect, useState, useRef, useCallback} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {
    Box,
    Typography,
    Stack,
    Alert,
    Grid,
    useTheme,
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
import Attendance from "../../../entities/attendance";


function LectureDashboardPage() {
    const theme = useTheme();
    const {id} = useParams<{ id: string }>();
    const navigate = useNavigate();
    const {getLectureById, addLecture} = useLectureContext();

    const [lecture, setLecture] = useState<Lecture | null>(null);
    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [totalStudents, setTotalStudents] = useState<number | null>(null);
    const [attendances, setAttendances] = useState<Attendance[] | null>(null);
    const [timeLeft, setTimeLeft] = useState<string>('--:--');
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
                if (!resp.ok) throw new Error((await resp.text()) || 'Failed to load lecture');
                const data: Lecture = await resp.json();
                addLecture(data);
                setLecture(data);
                loadRelatedData(data);
                loadAttendances(lectureId);
            })
            .catch((e: any) => setError(e?.message || 'Failed to load lecture'))
            .finally(() => setLoading(false));
    }, [lectureId]);

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
        // api.attendance.getAttendances(lectureId).then(async (resp) => {
        //     if (!resp.ok) return;
        //     const data: Attendance[] = await resp.json();
        //     setAttendances(data)
        // }).catch(() => {});

        const attendances: Attendance[] = [
            {
                attendanceId: {
                    userId: 5,
                    lectureId: lectureId
                },
                scannedAt: "2026-03-10 13:07:03.490000"
            },
            {
                attendanceId: {
                    userId: 3,
                    lectureId: lectureId
                },
                scannedAt: "2026-03-10 13:07:03.490000"
            }
        ]

        setAttendances(attendances);
    }

    const totalPresent = attendances?.length
    let totalAbsent = null;
    let attendanceRate = null;
    if (totalPresent && totalStudents!== null) {
        totalAbsent = totalStudents  - totalPresent;
        attendanceRate = totalPresent*100/totalStudents;
    }

    const handleEndSession = () => {
        if (!confirm('Are you sure you want to end this session?')) return;
        navigate('/teacher/courses');
    };

    if (loading) {
        return (
            <Box>
                <Typography>Loading lecture...</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box>
                <Alert severity="error" sx={{mb: 2}}>{error}</Alert>
                <ActionButton variant="outlined" onClick={() => navigate('/teacher/courses')}>
                    Back to Courses
                </ActionButton>
            </Box>
        );
    }

    if (!lecture) {
        return (
            <Box>
                <Typography>Lecture not found.</Typography>
            </Box>
        );
    }

    const codeChars = (lecture.joinCode || '------').split('');

    return (
        <Box>
            {/* Header */}
            <Stack direction="row" alignItems="flex-start" justifyContent="space-between" sx={{mb: 3}}>
                <Box>
                    <Typography variant="h5" component="h1" sx={{fontWeight: 700}}>
                        Attendance Session
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{mt: 0.5}}>
                        {course ? `${course.courseName} - ${lecture.description}` : lecture.description}
                    </Typography>
                </Box>
                <Stack direction="row" spacing={1.5} alignItems="center">
                    <ActionButton
                        variant="outlined"
                        startIcon={<NotificationsNoneIcon/>}
                        sx={{borderColor: 'divider', color: 'text.primary'}}
                    >
                        Notifications
                    </ActionButton>
                    <ActionButton
                        color="error"
                        startIcon={<StopIcon/>}
                        onClick={handleEndSession}
                    >
                        End Session
                    </ActionButton>
                </Stack>
            </Stack>

            {/* Stat Cards */}
            <Grid container spacing={2} sx={{mb: 3}}>
                <Grid size={{xs: 12, sm: 6, md: 3}}>
                    <StatCard title="Total Students" value={totalStudents !== null ? String(totalStudents) : '--'}
                              icon={<LaptopMacIcon/>} color="primary"/>
                </Grid>
                <Grid size={{xs: 12, sm: 6, md: 3}}>
                    {/* Requires GET /attendance?lecture_id endpoint */}
                    <StatCard title="Present" value={totalPresent ?? "--"} icon={<CheckCircleIcon/>} color="success"/>
                </Grid>
                <Grid size={{xs: 12, sm: 6, md: 3}}>
                    {/* Requires GET /attendance?lecture_id endpoint */}
                    <StatCard title="Absent" value={totalAbsent ?? "--"} icon={<CancelIcon/>} color="error"/>
                </Grid>
                <Grid size={{xs: 12, sm: 6, md: 3}}>
                    {/* Requires GET /attendance?lecture_id endpoint */}
                    <StatCard title="Attendance Rate" value={attendanceRate ? `${Math.round(attendanceRate)} %` : "--%"} icon={<TrendingUpIcon/>} color="info"/>
                </Grid>
            </Grid>

            {/* Numeric Code Panel */}
            <Box sx={{mb: 3}}>
                <DisplayPanel bordered>
                    <Typography variant="h6" sx={{fontWeight: 600, mb: 0.5}}>
                        Numeric Code
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{mb: 2}}>
                        Alternative attendance method
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
                            Enter this code:
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
                            Valid for this session only
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
                                    <Typography variant="body2" sx={{fontWeight: 600}}>Marked</Typography>
                                    <Typography variant="caption" color="text.secondary">Present</Typography>
                                </Box>
                            </Box>
                            <Typography variant="h5" sx={{fontWeight: 700}}>--</Typography>
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
                                    <Typography variant="body2" sx={{fontWeight: 600}}>Unmarked</Typography>
                                    <Typography variant="caption" color="text.secondary">Pending</Typography>
                                </Box>
                            </Box>
                            <Typography variant="h5" sx={{fontWeight: 700}}>--</Typography>
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
                                <Typography variant="body2" sx={{fontWeight: 600}}>Session Timer</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {timeLeft === '00:00' ? (
                                        'Session has ended'
                                    ) : (
                                        <>
                                            This session will auto-close in{' '}
                                            <Box component="span"
                                                 sx={{color: 'info.main', fontWeight: 600}}>{timeLeft}</Box>{' '}
                                            minutes
                                        </>
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
                    <Typography variant="h6" sx={{fontWeight: 600}}>Recent Activity</Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary">
                    {/* TODO: Add a backend endpoint to fetch attendance records by lecture */}
                    No attendance data available yet. A backend endpoint to fetch attendance records by lecture is
                    needed.
                </Typography>
            </DisplayPanel>
        </Box>
    );
}

export default LectureDashboardPage;
