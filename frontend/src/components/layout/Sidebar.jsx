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

export const drawerWidth = 240;

function Sidebar({ mobileOpen, onClose }) {
  const drawerContent = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box sx={{ px: 3, py: 3 }}>
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

        <ListItemButton sx={{ borderRadius: 2 }}>
          <ListItemIcon>
            <SettingsOutlinedIcon />
          </ListItemIcon>

          <ListItemText primary="Settings" />
        </ListItemButton>
      </List>
    </Box>
  );

  return (
    <>
      {/* Desktop */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
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
        {drawerContent}
      </Drawer>

      {/* Mobile */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
}

export default Sidebar;