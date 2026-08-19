import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';

import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import EventNoteOutlinedIcon from '@mui/icons-material/EventNoteOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';

const drawerWidth = 240;

function Sidebar() {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,

        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          borderRight: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'background.paper',
        },
      }}
    >
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Logo / Brand */}
        <Box
          sx={{
            px: 3,
            py: 3,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: 'primary.main',
            }}
          >
            Meeting Assistant
          </Typography>
        </Box>

        {/* Navigation */}
        <List sx={{ px: 2 }}>
          <ListItemButton
            selected
            sx={{
              borderRadius: 2,
              mb: 1,
            }}
          >
            <ListItemIcon>
              <DashboardOutlinedIcon color="primary" />
            </ListItemIcon>

            <ListItemText primary="Dashboard" />
          </ListItemButton>

          <ListItemButton
            sx={{
              borderRadius: 2,
              mb: 1,
            }}
          >
            <ListItemIcon>
              <EventNoteOutlinedIcon />
            </ListItemIcon>

            <ListItemText primary="Meetings" />
          </ListItemButton>

          <ListItemButton
            sx={{
              borderRadius: 2,
            }}
          >
            <ListItemIcon>
              <SettingsOutlinedIcon />
            </ListItemIcon>

            <ListItemText primary="Settings" />
          </ListItemButton>
        </List>
      </Box>
    </Drawer>
  );
}

export default Sidebar;