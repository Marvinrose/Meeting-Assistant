import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

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
import DeleteIcon from '@mui/icons-material/Delete';

import {
  getMeeting,
  deleteMeeting,
} from '../api/meetings';

function MeetingDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [meeting, setMeeting] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [deleting, setDeleting] =
    useState(false);

  const [error, setError] =
    useState('');

  useEffect(() => {
    async function loadMeeting() {
      try {
        setLoading(true);
        setError('');

        const data = await getMeeting(id);

        setMeeting(data);
      } catch (err) {
        console.error(
          'LOAD MEETING ERROR:',
          err
        );

        setError(
          err.response?.data?.detail ||
            'Unable to load this meeting.'
        );
      } finally {
        setLoading(false);
      }
    }

    loadMeeting();
  }, [id]);

  async function handleDelete() {
    const confirmed =
      window.confirm(
        'Are you sure you want to delete this meeting?'
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);

      await deleteMeeting(id);

      navigate('/');
    } catch (err) {
      console.error(
        'DELETE MEETING ERROR:',
        err
      );

      setError(
        'Unable to delete this meeting.'
      );

      setDeleting(false);
    }
  }

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
      <Stack spacing={2}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          sx={{
            alignSelf: 'flex-start',
          }}
        >
          Back to meetings
        </Button>

        <Alert severity="error">
          {error}
        </Alert>
      </Stack>
    );
  }

  if (!meeting) {
    return null;
  }

  const status =
    meeting.status || 'uploaded';

  return (
    <Box
      sx={{
        maxWidth: 1000,
        mx: 'auto',
        width: '100%',
      }}
    >
      {/* Header */}
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        mb={3}
      >
        <IconButton
          onClick={() => navigate('/')}
        >
          <ArrowBackIcon />
        </IconButton>

        <Box
          sx={{
            flexGrow: 1,
            minWidth: 0,
          }}
        >
          <Typography
            variant="h5"
            fontWeight={700}
            sx={{
              wordBreak: 'break-word',
            }}
          >
            {meeting.title}
          </Typography>

          <Typography
            color="text.secondary"
          >
            {meeting.created_at
              ? new Date(
                  meeting.created_at
                ).toLocaleString()
              : ''}
          </Typography>
        </Box>
      </Stack>

      {/* Meeting information */}
      <Card
        elevation={0}
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 3,
          mb: 3,
        }}
      >
        <CardContent
          sx={{
            p: {
              xs: 2,
              sm: 3,
            },
          }}
        >
          <Stack
            direction={{
              xs: 'column',
              sm: 'row',
            }}
            justifyContent="space-between"
            spacing={3}
          >
            <Box>
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Status
              </Typography>

              <Chip
                label={status}
                color={
                  status === 'completed'
                    ? 'success'
                    : status === 'processing'
                    ? 'warning'
                    : 'info'
                }
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

              <Typography
                mt={1}
                sx={{
                  wordBreak: 'break-word',
                }}
              >
                {meeting.audio_filename ||
                  'No recording'}
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Minutes */}
      <Card
        elevation={0}
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 3,
          mb: 3,
        }}
      >
        <CardContent
          sx={{
            p: {
              xs: 2,
              sm: 3,
            },
          }}
        >
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
                lineHeight: 1.8,
              }}
            >
              {meeting.minutes}
            </Typography>
          ) : (
            <Box
              sx={{
                py: 4,
                textAlign: 'center',
              }}
            >
              <Typography
                color="text.secondary"
                mb={1}
              >
                No meeting minutes have been
                generated yet.
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                AI transcription and minutes
                generation will be added next.
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <Stack
        direction={{
          xs: 'column',
          sm: 'row',
        }}
        spacing={2}
      >
        <Button
          variant="outlined"
          startIcon={
            <ArrowBackIcon />
          }
          onClick={() => navigate('/')}
        >
          Back to Meetings
        </Button>

        <Button
          variant="outlined"
          color="error"
          startIcon={
            <DeleteIcon />
          }
          onClick={handleDelete}
          disabled={deleting}
        >
          {deleting
            ? 'Deleting...'
            : 'Delete Meeting'}
        </Button>
      </Stack>
    </Box>
  );
}

export default MeetingDetails;