import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import MedicalTestManagement from './MedicalTestManagement';

function MedicalTestMgmt() {
  const location = useLocation();

  return (
    <>
      <Routes location={location.state?.background || location}>
        <Route index element={<MedicalTestManagement />} />
      </Routes>

      {location.state?.background && (
        <Routes>
          <Route path="/:testID/delete" element={<div>Delete modal</div>} />
        </Routes>
      )}
    </>
  );
}

export default MedicalTestMgmt;
