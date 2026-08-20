import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { getMeeting } from '../api/meetings';


function MeetingDetails({ meetingId, onBack }) {
  const [meeting, setMeeting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadMeeting() {
      try {
        const data = await getMeeting(meetingId);

        setMeeting(data);
      } catch (err) {
        console.error(err);

        setError(
          'Unable to load this meeting.',
        );
      } finally {
        setLoading(false);
      }
    }

    loadMeeting();
  }, [meetingId]);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          py: 10,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        {error}
      </Alert>
    );
  }

  if (!meeting) {
    return null;
  }

  return (
    <Box
      sx={{
        maxWidth: 1000,
        mx: 'auto',
      }}
    >
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        mb={3}
      >
        <IconButton onClick={onBack}>
          <ArrowBackIcon />
        </IconButton>

        <Box>
          <Typography variant="h5" fontWeight={700}>
            {meeting.title}
          </Typography>

          <Typography
            color="text.secondary"
          >
            {new Date(
              meeting.created_at
            ).toLocaleString()}
          </Typography>
        </Box>
      </Stack>

      <Card
        elevation={0}
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 3,
          mb: 3,
        }}
      >
        <CardContent>
          <Stack
            direction={{
              xs: 'column',
              sm: 'row',
            }}
            justifyContent="space-between"
            spacing={2}
          >
            <Box>
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Status
              </Typography>

              <Chip
                label={meeting.status}
                color="primary"
                sx={{ mt: 1 }}
              />
            </Box>

            <Box>
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Recording
              </Typography>

              <Typography mt={1}>
                {meeting.audio_filename ||
                  'No recording'}
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      <Card
        elevation={0}
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 3,
        }}
      >
        <CardContent>
          <Typography
            variant="h6"
            fontWeight={700}
            mb={2}
          >
            Meeting Minutes
          </Typography>

          <Divider sx={{ mb: 3 }} />

          {meeting.minutes ? (
            <Typography
              sx={{
                whiteSpace: 'pre-wrap',
              }}
            >
              {meeting.minutes}
            </Typography>
          ) : (
            <Typography color="text.secondary">
              Meeting minutes will appear here
              after transcription and AI processing.
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

export default MeetingDetails;