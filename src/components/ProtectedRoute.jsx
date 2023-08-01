import React from 'react';
import { Navigate } from 'react-router-dom';
import CheckUserLogin from 'common/auth';

function ProtectedRoute({ redirectPath = '/auth/signin', children }) {
  const isUserLoggedIn = CheckUserLogin();
  if (isUserLoggedIn) {
    return children;
  }

  return <Navigate to={redirectPath} replace />;
}

export default ProtectedRoute;
