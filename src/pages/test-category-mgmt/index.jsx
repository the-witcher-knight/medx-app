import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import TestCategoryDeleteDialog from './TestCategoryDeleteDialog';
import TestCategoryEdit from './TestCategoryEdit';
import TestCategoryManagement from './TestCategoryManagement';

function TestCategoryMgmt() {
  const location = useLocation();

  return (
    <>
      <Routes location={location.state?.background || location}>
        <Route index element={<TestCategoryManagement />} />
      </Routes>

      {location.state?.background && (
        <Routes>
          <Route path="/new" element={<TestCategoryEdit />} />
          <Route path="/:id/edit" element={<TestCategoryEdit />} />
          <Route path="/:id/delete" element={<TestCategoryDeleteDialog />} />
        </Routes>
      )}
    </>
  );
}

export default TestCategoryMgmt;
