import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import TestGroupDeleteDialog from './TestGroupDeleteDialog';
import TestGroupEdit from './TestGroupEdit';
import TestGroupManagement from './TestGroupManagement';

function TestGroupMgmt() {
  const location = useLocation();

  return (
    <>
      <Routes location={location.state?.background || location}>
        <Route index element={<TestGroupManagement />} />
      </Routes>

      {location.state?.background && (
        <Routes>
          <Route path="/new" element={<TestGroupEdit />} />
          <Route path="/:id/edit" element={<TestGroupEdit />} />
          <Route path="/:id/delete" element={<TestGroupDeleteDialog />} />
        </Routes>
      )}
    </>
  );
}

export default TestGroupMgmt;
