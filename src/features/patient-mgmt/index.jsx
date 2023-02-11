import React from 'react';
import { Route, Routes } from 'react-router-dom';

import withSuspense from 'components/withSuspense';

import PatientManagement from './PatientManagement';

function PatientMgmt() {
  return (
    <Routes>
      <Route index element={<PatientManagement />} />
    </Routes>
  );
}

export default withSuspense(PatientMgmt, 'Quản lý bệnh nhân');
