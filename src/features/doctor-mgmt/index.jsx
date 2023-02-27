import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

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
        </Routes>
      )}
    </>
  );
}

export default DoctorMgmt;
