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

import { useLocation, useNavigate } from 'react-router-dom';

export const drawerWidth = 240;

function Sidebar({ mobileOpen, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path) => {
    navigate(path);

    // Close mobile drawer after navigation
    if (onClose) {
      onClose();
    }
  };

  const menuItems = [
    {
      label: 'Dashboard',
      path: '/',
      icon: <DashboardOutlinedIcon />,
    },
    {
      label: 'Meetings',
      path: '/meetings',
      icon: <EventNoteOutlinedIcon />,
    },
    {
      label: 'Settings',
      path: '/settings',
      icon: <SettingsOutlinedIcon />,
    },
  ];

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
            cursor: 'pointer',
          }}
          onClick={() => handleNavigation('/')}
        >
          Meeting Assistant
        </Typography>
      </Box>

      <List sx={{ px: 2 }}>
        {menuItems.map((item) => {
          const isActive =
            item.path === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(item.path);

          return (
            <ListItemButton
              key={item.path}
              selected={isActive}
              onClick={() => handleNavigation(item.path)}
              sx={{
                borderRadius: 2,
                mb: 1,
              }}
            >
              <ListItemIcon>
                {item.icon}
              </ListItemIcon>

              <ListItemText primary={item.label} />
            </ListItemButton>
          );
        })}
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