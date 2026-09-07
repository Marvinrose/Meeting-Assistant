import {
  Box,
  Card,
  CardContent,
  Typography,
} from '@mui/material';

function Settings() {
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
        Settings
      </Typography>

      <Typography
        color="text.secondary"
        sx={{ mb: 4 }}
      >
        Manage your Meeting Assistant preferences.
      </Typography>

      <Card
        elevation={0}
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 3,
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography fontWeight={700} mb={1}>
            Settings
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            Settings and personalization options
            will be available here.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Settings;