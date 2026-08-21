import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';

import StatCard from '../components/dashboard/StatCard';
import MeetingCard from '../components/dashboard/MeetingCard';

import { getMeetings } from '../api/meetings';

function Dashboard() {
  const navigate = useNavigate();

  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadMeetings() {
    try {
      setLoading(true);
      setError('');

      const data = await getMeetings();

      setMeetings(data);
    } catch (err) {
      console.error(
        'LOAD MEETINGS ERROR:',
        err
      );

      setError(
        'Unable to load your meetings.'
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMeetings();
  }, []);

  const totalMeetings = meetings.length;

  const processingMeetings =
    meetings.filter(
      (meeting) =>
        meeting.status === 'processing'
    ).length;

  const completedMeetings =
    meetings.filter(
      (meeting) =>
        meeting.status === 'completed'
    ).length;

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
              fontSize: {
                xs: '1.7rem',
                sm: '2.125rem',
              },
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
          onClick={() =>
            navigate('/new-meeting')
          }
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
          value={totalMeetings}
          description="All recorded meetings"
          icon={
            <CalendarMonthOutlinedIcon
              fontSize="small"
            />
          }
        />

        <StatCard
          label="Processing"
          value={processingMeetings}
          description="Being processed"
          icon={
            <AutoAwesomeOutlinedIcon
              fontSize="small"
            />
          }
        />

        <StatCard
          label="Completed"
          value={completedMeetings}
          description="Ready to review"
          icon={
            <CheckCircleOutlineOutlinedIcon
              fontSize="small"
            />
          }
        />
      </Box>

      {/* Meetings */}
      <Box
        sx={{
          backgroundColor:
            'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 3,
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            px: {
              xs: 2,
              sm: 3,
            },
            py: 2.5,
            display: 'flex',
            alignItems: {
              xs: 'flex-start',
              sm: 'center',
            },
            justifyContent: 'space-between',
            gap: 2,
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
            onClick={loadMeetings}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              color: 'primary.main',
            }}
          >
            Refresh
          </Button>
        </Box>

        <Divider />

        {error && (
          <Alert
            severity="error"
            sx={{ m: 2 }}
          >
            {error}
          </Alert>
        )}

        {loading ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              py: 8,
            }}
          >
            <CircularProgress />
          </Box>
        ) : meetings.length === 0 ? (
          <Box
            sx={{
              textAlign: 'center',
              py: 8,
              px: 3,
            }}
          >
            <Typography
              variant="h6"
              fontWeight={600}
              mb={1}
            >
              No meetings yet
            </Typography>

            <Typography
              color="text.secondary"
              mb={3}
            >
              Create your first meeting by uploading
              or recording an audio file.
            </Typography>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() =>
                navigate('/new-meeting')
              }
            >
              Create First Meeting
            </Button>
          </Box>
        ) : (
          <Stack>
            {meetings.map((meeting) => (
              <MeetingCard
                key={meeting.id}
                title={meeting.title}
                date={
                  meeting.created_at
                    ? new Date(
                        meeting.created_at
                      ).toLocaleDateString()
                    : ''
                }
                time={
                  meeting.created_at
                    ? new Date(
                        meeting.created_at
                      ).toLocaleTimeString(
                        [],
                        {
                          hour: '2-digit',
                          minute: '2-digit',
                        }
                      )
                    : ''
                }
                status={
                  meeting.status
                    ?.charAt(0)
                    .toUpperCase() +
                    meeting.status?.slice(1)
                }
                onClick={() =>
                  navigate(
                    `/meeting/${meeting.id}`
                  )
                }
              />
            ))}
          </Stack>
        )}
      </Box>
    </Box>
  );
}

export default Dashboard;