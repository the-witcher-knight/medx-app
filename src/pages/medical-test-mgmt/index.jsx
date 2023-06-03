import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import MedicalTestDeleteDialog from './MedicalTestDeleteDialog';
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
          <Route path="/:testID/delete" element={<MedicalTestDeleteDialog />} />
        </Routes>
      )}
    </>
  );
}

export default MedicalTestMgmt;
