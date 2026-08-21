import {
  Box,
  Chip,
  ListItemButton,
  Typography,
} from '@mui/material';

import ChevronRightIcon from '@mui/icons-material/ChevronRight';

function MeetingCard({
  title,
  date,
  time,
  status,
  onClick,
}) {
  const normalizedStatus =
    status?.toLowerCase();

  let statusColor = 'default';

  if (
    normalizedStatus === 'completed'
  ) {
    statusColor = 'success';
  } else if (
    normalizedStatus === 'processing'
  ) {
    statusColor = 'warning';
  } else if (
    normalizedStatus === 'uploaded'
  ) {
    statusColor = 'info';
  }

  return (
    <ListItemButton
      onClick={onClick}
      sx={{
        px: {
          xs: 2,
          sm: 3,
        },
        py: 2,
        gap: 2,
        alignItems: 'center',

        '&:hover': {
          backgroundColor:
            'action.hover',
        },
      }}
    >
      {/* Meeting information */}
      <Box
        sx={{
          flexGrow: 1,
          minWidth: 0,
        }}
      >
        <Typography
          fontWeight={600}
          noWrap
        >
          {title}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 0.5 }}
        >
          {date}
          {date && time ? ' • ' : ''}
          {time}
        </Typography>
      </Box>

      {/* Status */}
      <Chip
        label={status}
        color={statusColor}
        size="small"
        sx={{
          display: {
            xs: 'none',
            sm: 'inline-flex',
          },
        }}
      />

      <ChevronRightIcon
        color="action"
      />
    </ListItemButton>
  );
}

export default MeetingCard;