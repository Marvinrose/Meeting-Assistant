import { useRef, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';

import { createMeeting } from '../api/meetings';


function NewMeeting({ onBack, onCreated }) {
  const [title, setTitle] = useState('');
  const [audioFile, setAudioFile] = useState(null);
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  function handleFileChange(event) {
    const file = event.target.files?.[0];

    if (file) {
      setAudioFile(file);
      setError('');
    }
  }

  async function startRecording() {
    try {
      setError('');

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      const recorder = new MediaRecorder(stream);

      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(
          chunksRef.current,
          { type: 'audio/webm' },
        );

        const file = new File(
          [blob],
          `meeting-${Date.now()}.webm`,
          { type: 'audio/webm' },
        );

        setAudioFile(file);

        stream.getTracks().forEach(
          (track) => track.stop(),
        );
      };

      recorder.start();

      setRecording(true);
    } catch (err) {
      console.error(err);

      setError(
        'Microphone access was denied or is unavailable.',
      );
    }
  }

  function stopRecording() {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!title.trim()) {
      setError('Please enter a meeting title.');
      return;
    }

    if (!audioFile) {
      setError('Please upload or record the meeting audio.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const meeting = await createMeeting(
        title.trim(),
        audioFile,
      );

      onCreated(meeting);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.detail ||
        'Unable to create the meeting.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 900,
        mx: 'auto',
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        mb={3}
      >
        <IconButton onClick={onBack}>
          <ArrowBackIcon />
        </IconButton>

        <Box>
          <Typography variant="h5" fontWeight={700}>
            New Meeting
          </Typography>

          <Typography color="text.secondary">
            Upload or record a meeting to get started.
          </Typography>
        </Box>
      </Stack>

      <Card
        elevation={0}
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 3,
        }}
      >
        <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
          <Box
            component="form"
            onSubmit={handleSubmit}
          >
            <TextField
              fullWidth
              label="Meeting title"
              placeholder="e.g. Weekly Operations Meeting"
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
              sx={{ mb: 4 }}
            />

            <Typography
              variant="h6"
              fontWeight={600}
              mb={1}
            >
              Meeting recording
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              mb={3}
            >
              Upload an existing recording or record
              directly from your device.
            </Typography>

            <Stack
              spacing={2}
              alignItems="center"
              justifyContent="center"
              sx={{
                p: { xs: 3, sm: 6 },
                border: '2px dashed',
                borderColor: 'divider',
                borderRadius: 3,
                textAlign: 'center',
              }}
            >
              {recording ? (
                <>
                  <CircularProgress />

                  <Typography fontWeight={600}>
                    Recording in progress...
                  </Typography>

                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<StopIcon />}
                    onClick={stopRecording}
                  >
                    Stop Recording
                  </Button>
                </>
              ) : (
                <>
                  <MicIcon
                    sx={{
                      fontSize: 48,
                      color: 'primary.main',
                    }}
                  />

                  <Typography fontWeight={600}>
                    Record your meeting
                  </Typography>

                  <Button
                    variant="contained"
                    startIcon={<MicIcon />}
                    onClick={startRecording}
                  >
                    Start Recording
                  </Button>

                  <Divider
                    flexItem
                    sx={{ my: 1 }}
                  />

                  <Button
                    component="label"
                    variant="outlined"
                    startIcon={<CloudUploadIcon />}
                  >
                    Upload Recording

                    <input
                      hidden
                      type="file"
                      accept="audio/*,video/*"
                      onChange={handleFileChange}
                    />
                  </Button>
                </>
              )}

              {audioFile && !recording && (
                <Alert
                  severity="success"
                  sx={{ width: '100%' }}
                >
                  Selected: {audioFile.name}
                </Alert>
              )}
            </Stack>

            {error && (
              <Alert
                severity="error"
                sx={{ mt: 3 }}
              >
                {error}
              </Alert>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading || recording}
              sx={{
                mt: 4,
                py: 1.5,
                backgroundColor: '#AA3BFF',
                '&:hover': {
                  backgroundColor: '#9225E6',
                },
              }}
            >
              {loading
                ? 'Creating Meeting...'
                : 'Create Meeting'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default NewMeeting;