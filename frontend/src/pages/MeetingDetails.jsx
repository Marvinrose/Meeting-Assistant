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
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import MicIcon from '@mui/icons-material/Mic';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RefreshIcon from '@mui/icons-material/Refresh';

import {
  getMeeting,
  deleteMeeting,
  processMeeting,
  getMeetingPdfUrl,
} from '../api/meetings';

function MeetingDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [meeting, setMeeting] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [processing, setProcessing] =
    useState(false);

  const [deleting, setDeleting] =
    useState(false);

  const [error, setError] =
    useState('');

  /*
   * Load the meeting.
   */
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

  /*
   * Load meeting when the page opens.
   */
  useEffect(() => {
    loadMeeting();
  }, [id]);

  /*
   * Process meeting.
   *
   * Backend endpoint:
   * POST /api/meetings/{id}/process
   */
  async function handleProcess() {
    try {
      setProcessing(true);
      setError('');

      /*
       * Immediately show processing status
       * in the UI.
       */
      setMeeting((previous) => {
        if (!previous) {
          return previous;
        }

        return {
          ...previous,
          status: 'processing',
        };
      });

      const updatedMeeting =
        await processMeeting(id);

      /*
       * Replace the old meeting with the
       * processed meeting returned by FastAPI.
       */
      setMeeting(updatedMeeting);
    } catch (err) {
      console.error(
        'PROCESS MEETING ERROR:',
        err
      );

      /*
       * Reload the original meeting in case
       * the backend changed its status.
       */
      try {
        const currentMeeting =
          await getMeeting(id);

        setMeeting(currentMeeting);
      } catch {
        // Keep the existing meeting state.
      }

      setError(
        err.response?.data?.detail ||
          'Unable to process this meeting. Please try again.'
      );
    } finally {
      setProcessing(false);
    }
  }

  /*
   * Delete meeting.
   */
  async function handleDelete() {
    const confirmed =
      window.confirm(
        'Are you sure you want to delete this meeting? This action cannot be undone.'
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);
      setError('');

      await deleteMeeting(id);

      navigate('/');
    } catch (err) {
      console.error(
        'DELETE MEETING ERROR:',
        err
      );

      setError(
        err.response?.data?.detail ||
          'Unable to delete this meeting.'
      );

      setDeleting(false);
    }
  }

  /*
   * Download PDF.
   */
  function handleDownloadPdf() {
    const pdfUrl =
      getMeetingPdfUrl(id);

    window.open(
      pdfUrl,
      '_blank',
      'noopener,noreferrer'
    );
  }

  /*
   * Loading state.
   */
  if (loading) {
    return (
      <Box
        sx={{
          minHeight: 400,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Stack
          spacing={2}
          alignItems="center"
        >
          <CircularProgress />

          <Typography
            color="text.secondary"
          >
            Loading meeting...
          </Typography>
        </Stack>
      </Box>
    );
  }

  /*
   * Error state when meeting could not load.
   */
  if (error && !meeting) {
    return (
      <Stack spacing={2}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          sx={{
            alignSelf: 'flex-start',
          }}
        >
          Back to Meetings
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

  const isCompleted =
    status === 'completed';

  const isProcessing =
    status === 'processing' ||
    processing;

  const hasTranscript =
    Boolean(meeting.transcript);

  const hasMinutes =
    Boolean(meeting.minutes);

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 1000,
        mx: 'auto',
        pb: 5,
      }}
    >
      {/* =====================================================
          HEADER
      ====================================================== */}

      <Stack
        direction="row"
        spacing={1}
        alignItems="flex-start"
        mb={4}
      >
        <IconButton
          onClick={() => navigate('/')}
          aria-label="Back to meetings"
          sx={{
            mt: 0.5,
          }}
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
            variant="h4"
            fontWeight={700}
            sx={{
              fontSize: {
                xs: '1.6rem',
                sm: '2rem',
              },
              wordBreak: 'break-word',
            }}
          >
            {meeting.title}
          </Typography>

          <Typography
            color="text.secondary"
            mt={0.5}
          >
            {meeting.created_at
              ? new Date(
                  meeting.created_at
                ).toLocaleString()
              : ''}
          </Typography>
        </Box>

        <Chip
          label={status}
          color={
            isCompleted
              ? 'success'
              : status === 'processing'
              ? 'warning'
              : 'info'
          }
          icon={
            isCompleted ? (
              <CheckCircleIcon />
            ) : undefined
          }
          sx={{
            textTransform: 'capitalize',
            fontWeight: 600,
          }}
        />
      </Stack>

      {/* =====================================================
          PROCESSING MESSAGE
      ====================================================== */}

      {isProcessing && (
        <Alert
          severity="info"
          sx={{
            mb: 3,
            borderRadius: 3,
          }}
        >
          <Typography
            fontWeight={700}
            mb={0.5}
          >
            Processing your meeting
          </Typography>

          <Typography variant="body2">
            Your recording is being transcribed
            and the meeting minutes are being
            generated. Please wait...
          </Typography>
        </Alert>
      )}

      {/* =====================================================
          ERROR MESSAGE
      ====================================================== */}

      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 3,
            borderRadius: 3,
          }}
        >
          {error}
        </Alert>
      )}

      {/* =====================================================
          RECORDING / PROCESSING CARD
      ====================================================== */}

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
            alignItems={{
              xs: 'stretch',
              sm: 'center',
            }}
            spacing={3}
          >
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
            >
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor:
                    'primary.lighter',
                  background:
                    'rgba(170, 59, 255, 0.10)',
                }}
              >
                <MicIcon
                  color="primary"
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
                  fontWeight={600}
                  sx={{
                    wordBreak:
                      'break-word',
                  }}
                >
                  {meeting.audio_filename ||
                    'No recording'}
                </Typography>
              </Box>
            </Stack>

            {/* PROCESS BUTTON */}

            {!isCompleted && (
              <Button
                variant="contained"
                size="large"
                startIcon={
                  isProcessing ? (
                    <CircularProgress
                      size={20}
                      color="inherit"
                    />
                  ) : (
                    <PlayCircleOutlineIcon />
                  )
                }
                onClick={handleProcess}
                disabled={isProcessing}
                sx={{
                  minWidth: {
                    xs: '100%',
                    sm: 280,
                  },
                  py: 1.4,
                  backgroundColor:
                    '#AA3BFF',
                  '&:hover': {
                    backgroundColor:
                      '#9225E6',
                  },
                }}
              >
                {isProcessing
                  ? 'Processing...'
                  : 'Transcribe & Generate Minutes'}
              </Button>
            )}

            {/* REPROCESS */}

            {isCompleted && (
              <Button
                variant="outlined"
                size="large"
                startIcon={
                  isProcessing ? (
                    <CircularProgress
                      size={20}
                    />
                  ) : (
                    <RefreshIcon />
                  )
                }
                onClick={handleProcess}
                disabled={isProcessing}
                sx={{
                  minWidth: {
                    xs: '100%',
                    sm: 180,
                  },
                }}
              >
                {isProcessing
                  ? 'Processing...'
                  : 'Reprocess'}
              </Button>
            )}
          </Stack>
        </CardContent>
      </Card>

      {/* =====================================================
          MEETING MINUTES
      ====================================================== */}

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
              sm: 4,
            },
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            spacing={1.5}
            mb={2}
          >
            <DescriptionIcon
              color="primary"
            />

            <Typography
              variant="h6"
              fontWeight={700}
            >
              Meeting Minutes
            </Typography>
          </Stack>

          <Divider sx={{ mb: 3 }} />

          {hasMinutes ? (
            <Box
              sx={{
                '& p': {
                  lineHeight: 1.8,
                },
              }}
            >
              <Typography
                sx={{
                  whiteSpace: 'pre-wrap',
                  lineHeight: 1.8,
                  fontSize: '1rem',
                }}
              >
                {meeting.minutes}
              </Typography>
            </Box>
          ) : (
            <Box
              sx={{
                py: 6,
                px: 2,
                textAlign: 'center',
              }}
            >
              <DescriptionIcon
                sx={{
                  fontSize: 52,
                  color: 'text.disabled',
                  mb: 1,
                }}
              />

              <Typography
                fontWeight={700}
                mb={1}
              >
                No meeting minutes yet
              </Typography>

              <Typography
                color="text.secondary"
                mb={3}
                sx={{
                  maxWidth: 500,
                  mx: 'auto',
                }}
              >
                Process this recording to
                transcribe the audio and generate
                meeting minutes automatically.
              </Typography>

              <Button
                variant="contained"
                startIcon={
                  isProcessing ? (
                    <CircularProgress
                      size={20}
                      color="inherit"
                    />
                  ) : (
                    <PlayCircleOutlineIcon />
                  )
                }
                onClick={handleProcess}
                disabled={isProcessing}
                sx={{
                  backgroundColor:
                    '#AA3BFF',
                  '&:hover': {
                    backgroundColor:
                      '#9225E6',
                  },
                }}
              >
                {isProcessing
                  ? 'Processing...'
                  : 'Transcribe & Generate Minutes'}
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* =====================================================
          TRANSCRIPT
      ====================================================== */}

      {hasTranscript && (
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
                sm: 4,
              },
            }}
          >
            <Typography
              variant="h6"
              fontWeight={700}
              mb={2}
            >
              Full Transcript
            </Typography>

            <Divider sx={{ mb: 3 }} />

            <Box
              sx={{
                backgroundColor:
                  'rgba(0, 0, 0, 0.025)',
                borderRadius: 2,
                p: {
                  xs: 2,
                  sm: 3,
                },
                maxHeight: 600,
                overflowY: 'auto',
              }}
            >
              <Typography
                sx={{
                  whiteSpace: 'pre-wrap',
                  lineHeight: 1.8,
                  color: 'text.primary',
                }}
              >
                {meeting.transcript}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* =====================================================
          ACTIONS
      ====================================================== */}

      <Stack
        direction={{
          xs: 'column',
          sm: 'row',
        }}
        spacing={2}
      >
        {hasMinutes && (
          <Button
            variant="contained"
            startIcon={
              <PictureAsPdfIcon />
            }
            onClick={handleDownloadPdf}
            sx={{
              backgroundColor: '#AA3BFF',
              '&:hover': {
                backgroundColor:
                  '#9225E6',
              },
            }}
          >
            Download PDF
          </Button>
        )}

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