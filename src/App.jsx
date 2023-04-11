import React, { useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import StorageAPI from 'common/storageAPI';
import { AuthLoginKey } from 'constants';
import { SignIn } from 'pages/auth';
import DoctorMgmt from 'pages/doctor-mgmt';
import IndicationMgmt from 'pages/indication-mgmt';
import MedicalTestMgmt from 'pages/medical-test-mgmt';
import PatientMgmt from 'pages/patient-mgmt';
import TestCategoryMgmt from 'pages/test-category-mgmt';
import TestGroupMgmt from 'pages/test-group-mgmt';
import UnitMgmt from 'pages/unit-mgmt';
import UserMgmt from 'pages/user-mgmt';

import { AppContainer, AppSidebar, AppTopbar } from 'components';

const routes = [
  {
    name: 'Quản lý xét nghiệm',
    icon: 'house',
    path: '/',
  },
  {
    name: 'Bệnh nhân',
    icon: 'smiley-nervous',
    path: '/patient',
  },
  {
    name: 'Chỉ định xét nghiệm',
    icon: 'sticker',
    path: '/indication',
  },
  {
    name: 'Loại xét nghiệm',
    icon: 'eyedropper-sample',
    path: '/test-category',
  },
  {
    name: 'Nhóm xét nghiệm',
    icon: 'bounding-box',
    path: '/test-group-mgmt',
  },
  {
    name: 'Đơn vị',
    icon: 'percent',
    path: '/unit',
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
  const sideWidth = '3.3rem';
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!StorageAPI.local.get(AuthLoginKey)) {
      navigate('/auth/signin');
    }
  }, []);

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
        <AppContainer ml={{ base: 0, md: sideWidth }}>
          <Routes location={location}>
            <Route path="/*" element={<MedicalTestMgmt />} />
            <Route path="/home/*" element={<MedicalTestMgmt />} />
            <Route path="/patient/*" element={<PatientMgmt />} />
            <Route path="/doctor/*" element={<DoctorMgmt />} />
            <Route path="/unit/*" element={<UnitMgmt />} />
            <Route path="/test-group-mgmt/*" element={<TestGroupMgmt />} />
            <Route path="/test-category/*" element={<TestCategoryMgmt />} />
            <Route path="/indication/*" element={<IndicationMgmt />} />
            <Route path="/user/*" element={<UserMgmt />} />
            <Route path="/auth/signin" element={<SignIn />} />
            {/* Add more routes here */}
          </Routes>
        </AppContainer>
      </Box>
    </Box>
  );
}

export default App;
