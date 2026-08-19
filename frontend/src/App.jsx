import { useState } from 'react';
import { Box } from '@mui/material';

import Sidebar from './components/layout/Sidebar';
import TopBar from './components/layout/TopBar';
import Dashboard from './pages/Dashboard';

function App() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleMenuClick = () => {
    setMobileOpen(true);
  };

  const handleDrawerClose = () => {
    setMobileOpen(false);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
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
            md: `calc(100% - 240px)`,
          },
          p: {
            xs: 2,
            sm: 3,
            md: 4,
          },
          mt: 8,
        }}
      >
        <Dashboard />
      </Box>
    </Box>
  );
}

export default App;