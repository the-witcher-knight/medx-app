import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Box, Container } from '@chakra-ui/react';
import Home from 'features/home';
import PatientMgmt from 'features/patient-mgmt';
import AppContent from 'layout/AppContainer';
import AppFooter from 'layout/AppFooter';
import AppSidebar from 'layout/AppSidebar';
import AppTopbar from 'layout/AppTopbar';

const sideWidth = 200;

const routes = [
  {
    name: 'Trang chủ',
    icon: 'house',
    path: '/',
  },
  {
    name: 'Bệnh nhân',
    icon: 'smiley-nervous',
    path: '/patient',
  },
  {
    name: 'Xét nghiệm',
    icon: 'test-tube',
    path: '/test-manage',
  },
  {
    name: 'Báo cáo',
    icon: 'file-text',
    path: '/report',
  },
  {
    name: 'Thống kê',
    icon: 'chart-line',
    path: '/statistic',
  },
  {
    name: 'Bác sĩ',
    icon: 'first-aid-kit',
    path: '/doctor',
  },
  {
    name: 'Người dùng',
    icon: 'user',
    path: '/user',
  },
];

function App() {
  const location = useLocation();

  return (
    <Box>
      <AppTopbar />
      <AppSidebar
        display={{ base: 'none', md: 'flex' }}
        w={sideWidth}
        routes={routes}
        pos="fixed"
      />
      <AppContent ml={{ base: 0, md: sideWidth }}>
        <Routes location={location.state?.backgroundLocation || location}>
          <Route index element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/patient/*" element={<PatientMgmt />} />
          {/* Add more routes here */}
        </Routes>

        <AppFooter />
      </AppContent>
    </Box>
  );
}

export default App;
