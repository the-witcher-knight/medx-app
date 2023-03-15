import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import UnitDeleteDialog from './UnitDeleteDialog';
import UnitEdit from './UnitEdit';
import UnitManagement from './UnitManagement';

function UnitMgmt() {
  const location = useLocation();

  return (
    <>
      <Routes location={location.state?.background || location}>
        <Route index element={<UnitManagement />} />
      </Routes>

      {location.state?.background && (
        <Routes>
          <Route path="/new" element={<UnitEdit />} />
          <Route path="/:id/edit" element={<UnitEdit />} />
          <Route path="/:id/delete" element={<UnitDeleteDialog />} />
        </Routes>
      )}
    </>
  );
}

export default UnitMgmt;
