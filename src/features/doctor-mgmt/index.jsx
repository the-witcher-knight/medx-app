import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import DoctorManagement from './DoctorManagement';
import DoctorUpdate from './DoctorUpdate';

function DoctorMgmt() {
  const location = useLocation();

  return (
    <>
      <Routes location={location.state?.background || location}>
        <Route index element={<DoctorManagement />} />
      </Routes>

      {location.state?.background && (
        <Routes>
          <Route path="/new" element={<DoctorUpdate />} />
        </Routes>
      )}
    </>
  );
}

export default DoctorMgmt;
