import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material';

import { getMeetings } from '../api/meetings';
import MeetingCard from '../components/dashboard/MeetingCard';

function Meetings() {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadMeetings() {
      try {
        setLoading(true);
        setError('');

        const data = await getMeetings();
        setMeetings(data);
      } catch (err) {
        console.error('LOAD MEETINGS ERROR:', err);

        setError(
          err.response?.data?.detail ||
          'Unable to load meetings.'
        );
      } finally {
        setLoading(false);
      }
    }

    loadMeetings();
  }, []);

  return (
    <Box
      sx={{
        maxWidth: 1000,
        mx: 'auto',
        width: '100%',
        pb: 6,
      }}
    >
      <Typography
        variant="h4"
        fontWeight={800}
        sx={{
          mb: 1,
          fontSize: {
            xs: '1.75rem',
            sm: '2.25rem',
          },
        }}
      >
        Meetings
      </Typography>

      <Typography
        color="text.secondary"
        sx={{ mb: 4 }}
      >
        View and manage all your recorded meetings.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
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
        <Typography color="text.secondary">
          No meetings yet.
        </Typography>
      ) : (
        <Stack spacing={2}>
          {meetings.map((meeting) => (
            <MeetingCard
              key={meeting.id}
              meeting={meeting}
            />
          ))}
        </Stack>
      )}
    </Box>
  );
}

export default Meetings;