import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Box, Flex } from '@chakra-ui/react';
import DoctorMgmt from 'features/doctor-mgmt';
import Home from 'features/home';
import PatientMgmt from 'features/patient-mgmt';
import AppContent from 'layout/AppContainer';
import AppFooter from 'layout/AppFooter';
import AppSidebar from 'layout/AppSidebar';
import AppTopbar from 'layout/AppTopbar';

const sideWidth = '3.3rem';

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
    <Box
      sx={{
        display: 'flex',
      }}
    >
      <AppSidebar
        sx={{
          display: 'flex',
          pos: 'fixed',
          w: sideWidth,
          h: 'full',
          shadow: 'md',
        }}
        routes={routes}
      />

      <Box
        sx={{
          display: 'flex',
          flexDir: 'column',
          w: 'full',
        }}
      >
        <AppTopbar
          sx={{
            display: 'flex',
            flexDir: 'row',
            ml: sideWidth,
            my: 2,
            px: 4,
            justifyContent: 'space-between',
          }}
          routes={routes}
        />
        <AppContent ml={{ base: 0, md: sideWidth }}>
          <Routes location={location}>
            <Route index element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/patient/*" element={<PatientMgmt />} />
            <Route path="/doctor/*" element={<DoctorMgmt />} />
            {/* Add more routes here */}
          </Routes>

          <AppFooter />
        </AppContent>
      </Box>
    </Box>
  );
}

export default App;
