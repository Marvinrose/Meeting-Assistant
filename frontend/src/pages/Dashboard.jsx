import {
  Box,
  Button,
  Divider,
  Typography,
} from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';

import StatCard from '../components/dashboard/StatCard';
import MeetingCard from '../components/dashboard/MeetingCard';

function Dashboard() {
  return (
    <Box>
      {/* Page heading */}
      <Box
  sx={{
    display: 'flex',
    flexDirection: {
      xs: 'column',
      sm: 'row',
    },
    alignItems: {
      xs: 'stretch',
      sm: 'center',
    },
    justifyContent: 'space-between',
    gap: 2,
    mb: 4,
  }}
>
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: 0.5,
            }}
          >
            Good morning, Marvinrose 👋
          </Typography>

          <Typography color="text.secondary">
            Here's what's happening with your meetings.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            px: 2.5,
            py: 1.25,
            borderRadius: 2,
            alignSelf: {
                xs: 'stretch',
                sm: 'auto',
            },
          }}
        >
          New Meeting
        </Button>
      </Box>

      {/* Statistics */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            lg: 'repeat(3, 1fr)',
         },
         gap: 2,
         mb: 4,
      }}
      >
        <StatCard
          label="Total Meetings"
          value="12"
          description="All recorded meetings"
          icon={<CalendarMonthOutlinedIcon fontSize="small" />}
        />

        <StatCard
          label="Processing"
          value="3"
          description="Being transcribed"
          icon={<AutoAwesomeOutlinedIcon fontSize="small" />}
        />

        <StatCard
          label="Completed"
          value="9"
          description="Ready to review"
          icon={<CheckCircleOutlineOutlinedIcon fontSize="small" />}
        />
      </Box>

      {/* Recent meetings */}
      <Box
        sx={{
          backgroundColor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 3,
        }}
      >
        <Box
          sx={{
            px: 3,
            py: 2.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box>
            <Typography
              variant="h6"
              sx={{ fontWeight: 700 }}
            >
              Recent Meetings
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              Your latest meeting activity
            </Typography>
          </Box>

          <Button
            variant="text"
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              color: 'primary.main',
            }}
          >
            View all
          </Button>
        </Box>

        <Divider />

        <MeetingCard
          title="Weekly Operations Meeting"
          date="Today"
          time="10:00 AM"
          status="Completed"
        />

        <MeetingCard
          title="Project Planning Meeting"
          date="Yesterday"
          time="2:00 PM"
          status="Processing"
        />

        <MeetingCard
          title="Team Check-in"
          date="Monday"
          time="9:30 AM"
          status="Completed"
        />
      </Box>
    </Box>
  );
}

export default Dashboard;