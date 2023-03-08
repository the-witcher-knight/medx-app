import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import CreateTest from './CreateTest';
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
          <Route path="/new" element={<CreateTest />} />
        </Routes>
      )}
    </>
  );
}

export default TestMgmt;
