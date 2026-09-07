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

import MeetingCard from '../components/dashboard/MeetingCard';

import { getMeetings } from '../api/meetings';

function Meetings() {
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
        err.response?.data?.detail ||
        'Unable to load your meetings.'
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMeetings();
  }, []);

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
            Meetings
          </Typography>

          <Typography color="text.secondary">
            View and manage all your meetings.
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

      {/* Meetings list */}
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
              All Meetings
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              {meetings.length}{' '}
              {meetings.length === 1
                ? 'meeting'
                : 'meetings'}
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
              Create your first meeting by
              uploading or recording an audio
              file.
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

export default Meetings;