import { Box, Typography } from '@mui/material';

function StatCard({ label, value, icon, description }) {
  return (
    <Box
      sx={{
        backgroundColor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 3,
        p: 3,
        flex: 1,
        minWidth: 0,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 3,
        }}
      >
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontWeight: 500 }}
        >
          {label}
        </Typography>

        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'primary.main',
            color: 'white',
          }}
        >
          {icon}
        </Box>
      </Box>

      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          mb: 0.5,
        }}
      >
        {value}
      </Typography>

      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
    </Box>
  );
}

export default StatCard;