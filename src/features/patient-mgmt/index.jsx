import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import withSuspense from 'components/withSuspense';

import PatientEdit from './PatientEdit';
import PatientManagement from './PatientManagement';

function PatientMgmt() {
  const location = useLocation();

  return (
    <>
      <Routes location={location.state?.background || location}>
        <Route index element={<PatientManagement />} />
      </Routes>

      {location.state?.background && (
        <Routes>
          <Route path="/new" element={<PatientEdit />} />
        </Routes>
      )}
    </>
  );
}

export default withSuspense(PatientMgmt, 'Quản lý bệnh nhân');
