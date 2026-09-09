import { useState } from 'react';
import { Box } from '@mui/material';
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';

import Dashboard from './pages/Dashboard';
import Meetings from './pages/Meetings';
import NewMeeting from './pages/NewMeeting';
import MeetingDetails from './pages/MeetingDetails';
import Settings from './pages/Settings';

import Sidebar from './components/layout/Sidebar';
import TopBar from './components/layout/TopBar';

function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleMenuClick = () => {
    setMobileOpen(true);
  };

  const handleDrawerClose = () => {
    setMobileOpen(false);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        width: '100%',
      }}
    >
      <Sidebar
        mobileOpen={mobileOpen}
        onClose={handleDrawerClose}
      />

      <TopBar onMenuClick={handleMenuClick} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: {
            xs: '100%',
            md: 'calc(100% - 240px)',
          },
          p: {
            xs: 2,
            sm: 3,
            md: 4,
          },
          mt: 8,
          minWidth: 0,
        }}
      >
        <Routes>
          <Route
            path="/"
            element={<Dashboard />}
          />

          <Route path="/meetings" element={<Meetings />} />

          <Route
            path="/new-meeting"
            element={<NewMeeting />}
          />

          <Route
            path="/meetings/:id"
            element={<MeetingDetails />}
          />

          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Box>
    </Box>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;