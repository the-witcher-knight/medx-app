import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import withSuspense from 'components/withSuspense';

import DeletePatient from './DeletePatient';
import PatientEdit from './PatientEdit';
import PatientManagement from './PatientManagement';
import PatientUpdate from './PatientUpdate';

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
          <Route path="/edit/:id" element={<PatientUpdate />} />
          <Route path="/delete/:id" element={<DeletePatient />} />
        </Routes>
      )}
    </>
  );
}

export default withSuspense(PatientMgmt, 'Quản lý bệnh nhân');
