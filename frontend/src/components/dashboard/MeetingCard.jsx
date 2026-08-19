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
      </Box>

      <ChevronRightIcon color="action" />
    </ListItemButton>
  );
}

export default MeetingCard;