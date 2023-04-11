import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import UserDeleteDialog from './UserDeleteDialog';
import UserEdit from './UserEdit';
import UserManagement from './UserManagement';

function UserMgmt() {
  const location = useLocation();

  return (
    <>
      <Routes location={location.state?.background || location}>
        <Route index element={<UserManagement />} />
      </Routes>

      {location.state?.background && (
        <Routes>
          <Route path="/new" element={<UserEdit />} />
          <Route path="/:id/edit" element={<UserEdit />} />
          <Route path="/:id/delete" element={<UserDeleteDialog />} />
        </Routes>
      )}
    </>
  );
}

export default UserMgmt;
