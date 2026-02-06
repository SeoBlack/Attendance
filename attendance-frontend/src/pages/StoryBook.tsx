import { Box, Stack, Typography } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import PeopleIcon from '@mui/icons-material/People';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AddIcon from '@mui/icons-material/Add';
import {
  DisplayPanel,
  StatCard,
  ActionButton,
} from '../components/common';

export default function StoryBookPage() {
  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Common Components Test
      </Typography>

      <Stack spacing={3}>
        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>
            DisplayPanel
          </Typography>
          <DisplayPanel>
            <Typography>
              This is content inside a DisplayPanel. It provides a clean white
              background with consistent padding.
            </Typography>
          </DisplayPanel>
        </Box>

        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>
            StatCard
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <StatCard
              title="Active Classes"
              value={8}
              icon={<SchoolIcon />}
              color="info"
              indicator="+2%"
              indicatorType="positive"
            />
            <StatCard
              title="Total Students"
              value={342}
              icon={<PeopleIcon />}
              color="secondary"
              indicator="+1%"
              indicatorType="positive"
            />
            <StatCard
              title="Lectures Today"
              value={5}
              icon={<SchoolIcon />}
              color="primary"
              indicator="Today"
              indicatorType="neutral"
            />
            <StatCard
              title="Avg. Attendance"
              value="87%"
              icon={<CheckCircleIcon />}
              color="success"
              indicator="+3%"
              indicatorType="positive"
            />
          </Stack>
        </Box>

        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>
            ActionButton
          </Typography>
          <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
            <ActionButton startIcon={<AddIcon />}>Start Session</ActionButton>
            <ActionButton variant="outlined" color="primary">
              Outlined
            </ActionButton>
            <ActionButton variant="text" color="secondary">
              Text Button
            </ActionButton>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
}
