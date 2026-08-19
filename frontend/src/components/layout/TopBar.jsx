import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';

import { drawerWidth } from './Sidebar';

function TopBar({ onMenuClick }) {
  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: {
          xs: '100%',
          md: `calc(100% - ${drawerWidth}px)`,
        },
        ml: {
          xs: 0,
          md: `${drawerWidth}px`,
        },
        backgroundColor: 'background.paper',
        color: 'text.primary',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Toolbar>
        <IconButton
          onClick={onMenuClick}
          sx={{
            display: { xs: 'inline-flex', md: 'none' },
            mr: 1,
          }}
        >
          <MenuIcon />
        </IconButton>

        <Box
          sx={{
            flexGrow: 1,
            display: { xs: 'block', md: 'none' },
          }}
        >
          <Typography
            sx={{
              fontWeight: 700,
              color: 'primary.main',
            }}
          >
            Meeting Assistant
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
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
              display: { xs: 'none', sm: 'block' },
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