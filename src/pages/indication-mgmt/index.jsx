import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import IndicationDeleteDialog from './IndicationDeleteDialog';
import IndicationEdit from './IndicationEdit';
import IndicationManagement from './IndicationManagement';

function IndicationMgmt() {
  const location = useLocation();

  return (
    <>
      <Routes location={location.state?.background || location}>
        <Route index element={<IndicationManagement />} />
      </Routes>

      {location.state?.background && (
        <Routes>
          <Route path="/new" element={<IndicationEdit />} />
          <Route path="/:id/edit" element={<IndicationEdit />} />
          <Route path="/:id/delete" element={<IndicationDeleteDialog />} />
        </Routes>
      )}
    </>
  );
}

export default IndicationMgmt;
