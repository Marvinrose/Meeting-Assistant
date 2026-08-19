import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';

import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';

function TopBar() {
  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        ml: '240px',
        width: 'calc(100% - 240px)',
        backgroundColor: 'background.paper',
        color: 'text.primary',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Toolbar sx={{ justifyContent: 'flex-end' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip title="Notifications">
            <IconButton>
              <NotificationsNoneOutlinedIcon />
            </IconButton>
          </Tooltip>

          <Avatar
            sx={{
              width: 36,
              height: 36,
              bgcolor: 'primary.main',
            }}
          >
            M
          </Avatar>

          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              ml: 0.5,
            }}
          >
            Marvinrose
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;