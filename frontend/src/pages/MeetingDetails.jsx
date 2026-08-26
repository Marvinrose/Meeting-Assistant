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
  LinearProgress,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import RefreshIcon from '@mui/icons-material/Refresh';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import MicIcon from '@mui/icons-material/Mic';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

import {
  getMeeting,
  deleteMeeting,
  processMeeting,
} from '../api/meetings';


function MeetingDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [meeting, setMeeting] = useState(null);

  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [copied, setCopied] = useState(false);


  async function loadMeeting() {
    try {
      setLoading(true);
      setError('');

      const data = await getMeeting(id);

      setMeeting(data);
    } catch (err) {
      console.error('LOAD MEETING ERROR:', err);

      setError(
        err.response?.data?.detail ||
        'Unable to load this meeting.'
      );
    } finally {
      setLoading(false);
    }
  }


  useEffect(() => {
    loadMeeting();
  }, [id]);


  async function handleProcess() {
    try {
      setProcessing(true);
      setError('');
      setSuccess('');

      const updatedMeeting = await processMeeting(id);

      setMeeting(updatedMeeting);

      setSuccess(
        'Meeting successfully transcribed and minutes generated.'
      );
    } catch (err) {
      console.error('PROCESS MEETING ERROR:', err);

      setError(
        err.response?.data?.detail ||
        'Unable to process this meeting.'
      );
    } finally {
      setProcessing(false);
    }
  }


  async function handleDelete() {
    const confirmed = window.confirm(
      'Are you sure you want to delete this meeting?'
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
      console.error('DELETE MEETING ERROR:', err);

      setError(
        err.response?.data?.detail ||
        'Unable to delete this meeting.'
      );

      setDeleting(false);
    }
  }


  function handleDownloadPdf() {
    const apiUrl =
      import.meta.env.VITE_API_URL ||
      'http://127.0.0.1:8000/api';

    window.open(
      `${apiUrl}/meetings/${id}/document/pdf`,
      '_blank'
    );
  }


  async function handleCopyTranscript() {
    if (!meeting?.transcript) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        meeting.transcript
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error(
        'COPY TRANSCRIPT ERROR:',
        err
      );
    }
  }


  if (loading) {
    return (
      <Box
        sx={{
          maxWidth: 1000,
          mx: 'auto',
          width: '100%',
        }}
      >
        <Stack spacing={2}>
          <Box
            sx={{
              width: 120,
              height: 16,
              bgcolor: 'action.hover',
              borderRadius: 1,
            }}
          />

          <Box
            sx={{
              width: '60%',
              height: 36,
              bgcolor: 'action.hover',
              borderRadius: 1,
            }}
          />

          <Card
            elevation={0}
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 3,
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <CircularProgress />
            </CardContent>
          </Card>
        </Stack>
      </Box>
    );
  }


  if (error && !meeting) {
    return (
      <Box
        sx={{
          maxWidth: 1000,
          mx: 'auto',
        }}
      >
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          sx={{
            mb: 3,
            textTransform: 'none',
          }}
        >
          Back to meetings
        </Button>

        <Alert severity="error">
          {error}
        </Alert>
      </Box>
    );
  }


  if (!meeting) {
    return null;
  }


  const status =
    meeting.status || 'uploaded';

  const isCompleted =
    status === 'completed';

  const hasTranscript =
    Boolean(meeting.transcript);

  const hasMinutes =
    Boolean(meeting.minutes);


  return (
    <Box
      sx={{
        maxWidth: 1000,
        mx: 'auto',
        width: '100%',
        pb: 6,
      }}
    >

      {/* Back */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/')}
        sx={{
          mb: 3,
          textTransform: 'none',
          color: 'text.secondary',
          '&:hover': {
            color: 'text.primary',
            backgroundColor: 'transparent',
          },
        }}
      >
        Back to meetings
      </Button>


      {/* Header */}
      <Stack
        direction={{
          xs: 'column',
          sm: 'row',
        }}
        spacing={2}
        justifyContent="space-between"
        alignItems={{
          xs: 'flex-start',
          sm: 'center',
        }}
        mb={3}
      >

        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant="h4"
            fontWeight={800}
            sx={{
              fontSize: {
                xs: '1.75rem',
                sm: '2.25rem',
              },
              wordBreak: 'break-word',
              letterSpacing: '-0.02em',
            }}
          >
            {meeting.title}
          </Typography>

          <Typography
            color="text.secondary"
            sx={{ mt: 0.75 }}
          >
            {meeting.created_at
              ? new Date(
                  meeting.created_at
                ).toLocaleString()
              : ''}
          </Typography>
        </Box>


        <Chip
          icon={
            isCompleted
              ? <CheckCircleIcon />
              : undefined
          }
          label={status}
          color={
            isCompleted
              ? 'success'
              : status === 'processing'
              ? 'warning'
              : 'default'
          }
          sx={{
            textTransform: 'capitalize',
            fontWeight: 600,
            px: 0.5,
          }}
        />

      </Stack>


      {/* Alerts */}
      {error && (
        <Alert
          severity="error"
          sx={{ mb: 2 }}
          onClose={() => setError('')}
        >
          {error}
        </Alert>
      )}

      {success && (
        <Alert
          severity="success"
          sx={{ mb: 2 }}
          onClose={() => setSuccess('')}
        >
          {success}
        </Alert>
      )}


      {/* Main action card */}
      <Card
        elevation={0}
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 3,
          mb: 3,
          overflow: 'hidden',
        }}
      >

        {processing && (
          <LinearProgress />
        )}

        <CardContent
          sx={{
            p: {
              xs: 2.5,
              sm: 3,
            },
          }}
        >

          <Stack
            direction={{
              xs: 'column',
              sm: 'row',
            }}
            spacing={2}
            alignItems={{
              xs: 'stretch',
              sm: 'center',
            }}
            justifyContent="space-between"
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
                  backgroundColor: 'rgba(170, 59, 255, 0.10)',
                  color: '#AA3BFF',
                  flexShrink: 0,
                }}
              >
                <MicIcon />
              </Box>

              <Box>
                <Typography
                  fontWeight={700}
                >
                  Meeting recording
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    wordBreak: 'break-word',
                  }}
                >
                  {meeting.audio_filename ||
                    'No recording attached'}
                </Typography>
              </Box>

            </Stack>


            <Stack
              direction={{
                xs: 'column',
                sm: 'row',
              }}
              spacing={1}
            >

              {!isCompleted && (
                <Button
                  variant="contained"
                  startIcon={
                    processing
                      ? (
                        <CircularProgress
                          size={18}
                          color="inherit"
                        />
                      )
                      : (
                        <AutoAwesomeIcon />
                      )
                  }
                  onClick={handleProcess}
                  disabled={
                    processing ||
                    !meeting.audio_filename
                  }
                  sx={{
                    textTransform: 'none',
                    fontWeight: 700,
                    px: 2.5,
                    backgroundColor: '#AA3BFF',
                    '&:hover': {
                      backgroundColor: '#9225E6',
                    },
                  }}
                >
                  {processing
                    ? 'Processing...'
                    : 'Transcribe & Generate Minutes'}
                </Button>
              )}


              {isCompleted && (
                <Button
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={handleProcess}
                  disabled={processing}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                >
                  Re-process
                </Button>
              )}

            </Stack>

          </Stack>

        </CardContent>
      </Card>


      {/* Audio player */}
      {meeting.audio_filename && (
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
                xs: 2.5,
                sm: 3,
              },
            }}
          >

            <Typography
              variant="h6"
              fontWeight={700}
              mb={2}
            >
              Recording
            </Typography>

            <audio
              controls
              style={{
                width: '100%',
                display: 'block',
              }}
            >
              <source
                src={meeting.audio_url}
              />
              Your browser does not support
              audio playback.
            </audio>

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                display: 'block',
                mt: 1.5,
              }}
            >
              {meeting.audio_filename}
            </Typography>

          </CardContent>

        </Card>
      )}


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
              xs: 2.5,
              sm: 3,
            },
          }}
        >

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >

            <Stack
              direction="row"
              spacing={1.5}
              alignItems="center"
            >

              <DescriptionIcon
                sx={{
                  color: '#AA3BFF',
                }}
              />

              <Typography
                variant="h6"
                fontWeight={700}
              >
                Meeting Minutes
              </Typography>

            </Stack>


            {hasMinutes && (
              <Button
                variant="outlined"
                size="small"
                startIcon={
                  <PictureAsPdfIcon />
                }
                onClick={handleDownloadPdf}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                Download PDF
              </Button>
            )}

          </Stack>


          <Divider sx={{ mb: 3 }} />


          {hasMinutes ? (
            <Box
              sx={{
                backgroundColor: 'background.default',
                borderRadius: 2,
                p: {
                  xs: 2,
                  sm: 3,
                },
              }}
            >
              <Typography
                sx={{
                  whiteSpace: 'pre-wrap',
                  lineHeight: 1.85,
                  color: 'text.primary',
                }}
              >
                {meeting.minutes}
              </Typography>
            </Box>
          ) : (
            <Box
              sx={{
                py: 5,
                textAlign: 'center',
              }}
            >

              <AutoAwesomeIcon
                sx={{
                  fontSize: 42,
                  color: 'text.disabled',
                  mb: 1,
                }}
              />

              <Typography
                fontWeight={600}
                mb={0.75}
              >
                No minutes yet
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  maxWidth: 420,
                  mx: 'auto',
                }}
              >
                Process this meeting to generate
                a transcript and professional
                meeting minutes.
              </Typography>

            </Box>
          )}

        </CardContent>
      </Card>


      {/* Transcript */}
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
              xs: 2.5,
              sm: 3,
            },
          }}
        >

          <Stack
            direction={{
              xs: 'column',
              sm: 'row',
            }}
            spacing={1}
            justifyContent="space-between"
            alignItems={{
              xs: 'flex-start',
              sm: 'center',
            }}
            mb={2}
          >

            <Typography
              variant="h6"
              fontWeight={700}
            >
              Transcript
            </Typography>


            {hasTranscript && (
              <Tooltip
                title={
                  copied
                    ? 'Copied'
                    : 'Copy transcript'
                }
              >
                <IconButton
                  onClick={
                    handleCopyTranscript
                  }
                  size="small"
                >
                  {copied ? (
                    <CheckCircleIcon
                      color="success"
                    />
                  ) : (
                    <ContentCopyIcon />
                  )}
                </IconButton>
              </Tooltip>
            )}

          </Stack>


          <Divider sx={{ mb: 3 }} />


          {hasTranscript ? (
            <Box
              sx={{
                maxHeight: 500,
                overflowY: 'auto',
                backgroundColor: 'background.default',
                borderRadius: 2,
                p: {
                  xs: 2,
                  sm: 3,
                },
              }}
            >

              <Typography
                sx={{
                  whiteSpace: 'pre-wrap',
                  lineHeight: 1.8,
                }}
              >
                {meeting.transcript}
              </Typography>

            </Box>
          ) : (
            <Box
              sx={{
                py: 4,
                textAlign: 'center',
              }}
            >

              <Typography
                fontWeight={600}
                mb={0.75}
              >
                No transcript available
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Process the meeting recording
                to generate the transcript.
              </Typography>

            </Box>
          )}

        </CardContent>
      </Card>


      {/* Bottom actions */}
      <Stack
        direction={{
          xs: 'column',
          sm: 'row',
        }}
        spacing={1.5}
        justifyContent="space-between"
      >

        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
          }}
        >
          Back to Meetings
        </Button>


        <Stack
          direction={{
            xs: 'column',
            sm: 'row',
          }}
          spacing={1.5}
        >

          {hasMinutes && (
            <Button
              variant="outlined"
              startIcon={
                <PictureAsPdfIcon />
              }
              onClick={handleDownloadPdf}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
              }}
            >
              Download PDF
            </Button>
          )}


          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleDelete}
            disabled={deleting}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            {deleting
              ? 'Deleting...'
              : 'Delete Meeting'}
          </Button>

        </Stack>

      </Stack>

    </Box>
  );
}


export default MeetingDetails;