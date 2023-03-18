import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import DoctorDeleteDialog from './DoctorDeleteDialog';
import DoctorEdit from './DoctorEdit';
import DoctorManagement from './DoctorManagement';

function DoctorMgmt() {
  const location = useLocation();

  return (
    <>
      <Routes location={location.state?.background || location}>
        <Route index element={<DoctorManagement />} />
      </Routes>

      {location.state?.background && (
        <Routes>
          <Route path="/new" element={<DoctorEdit />} />
          <Route path="/:id/edit" element={<DoctorEdit />} />
          <Route path="/:id/delete" element={<DoctorDeleteDialog />} />
        </Routes>
      )}
    </>
  );
}

export default DoctorMgmt;
