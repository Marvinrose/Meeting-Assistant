import {
  Box,
  Chip,
  ListItemButton,
  ListItemText,
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
        px: { xs: 1.5, sm: 2 },
        py: 2,
        borderRadius: 2,
        alignItems: {
          xs: 'flex-start',
          sm: 'center',
        },

        '&:hover': {
          backgroundColor: 'action.hover',
        },
      }}
    >
      {/* Meeting information */}
      <ListItemText
        primary={title}
        secondary={`${date} • ${time}`}
        primaryTypographyProps={{
          fontWeight: 600,
          noWrap: true,
        }}
        secondaryTypographyProps={{
          color: 'text.secondary',
          noWrap: true,
        }}
        sx={{
          minWidth: 0,
          mr: 2,
        }}
      />

      {/* Status + arrow */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          flexShrink: 0,
        }}
      >
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

        <ChevronRightIcon color="action" />
      </Box>
    </ListItemButton>
  );
}

export default MeetingCard;