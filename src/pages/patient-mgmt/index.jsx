import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import PatientDeleteDialog from './PatientDeleteDialog';
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
          <Route path="/:id/edit" element={<PatientEdit />} />
          <Route path="/:id/delete" element={<PatientDeleteDialog />} />
        </Routes>
      )}
    </>
  );
}

export default PatientMgmt;
