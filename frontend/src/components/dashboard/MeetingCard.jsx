import {
  Box,
  Chip,
  ListItemButton,
  Typography,
} from '@mui/material';

import ChevronRightIcon from '@mui/icons-material/ChevronRight';

function MeetingCard({ title, date, time, status }) {
  const statusColor =
    status === 'Completed'
      ? 'success'
      : status === 'Processing'
        ? 'warning'
        : 'default';

  return (
    <ListItemButton
      sx={{
        px: 2,
        py: 2,
        borderRadius: 2,
        alignItems: 'center',
        '&:hover': {
          backgroundColor: 'action.hover',
        },
      }}
    >
      <Box sx={{ flexGrow: 1 }}>
        <Typography
          variant="body1"
          sx={{
            fontWeight: 600,
            mb: 0.5,
          }}
        >
          {title}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {date} · {time}
        </Typography>
      </Box>

      <Chip
        label={status}
        color={statusColor}
        size="small"
        sx={{ mr: 1 }}
      />

      <ChevronRightIcon color="action" />
    </ListItemButton>
  );
}

export default MeetingCard;