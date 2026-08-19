import { Box, Typography } from '@mui/material';

function Dashboard() {
  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        Good morning, Marvinrose 👋
      </Typography>

      <Typography color="text.secondary">
        Here's what's happening with your meetings.
      </Typography>
    </Box>
  );
}

export default Dashboard;