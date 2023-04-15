import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ loggedIn, redirectPath = '/auth/signin', children }) {
  if (!loggedIn) {
    return <Navigate to={redirectPath} replace />;
  }

  return children;
}

export default ProtectedRoute;
