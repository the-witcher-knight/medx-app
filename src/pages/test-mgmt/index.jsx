import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import TestDeleteDialog from './TestDeleteDialog';
import TestDetail from './TestDetail';
import TestEdit from './TestEdit';
import TestManagement from './TestManagement';

function TestMgmt() {
  const location = useLocation();

  return (
    <>
      <Routes location={location.state?.background || location}>
        <Route index element={<TestManagement />} />
      </Routes>

      {location.state?.background && (
        <Routes>
          <Route path="/new" element={<TestEdit />} />
          <Route path="/:id/edit" element={<TestEdit />} />
          <Route path="/detail/:testID" element={<TestDetail />} />
          <Route path="/:id/delete" element={<TestDeleteDialog />} />
        </Routes>
      )}
    </>
  );
}

export default TestMgmt;
