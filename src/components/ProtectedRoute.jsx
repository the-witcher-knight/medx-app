import React from 'react';
import { Navigate } from 'react-router-dom';
import JwtParser from 'common/jwt';
import StorageAPI from 'common/storageAPI';
import { AuthLoginKey } from 'constants';

function ProtectedRoute({ redirectPath = '/auth/signin', children }) {
  const jwt = StorageAPI.local.get(AuthLoginKey);
  if (!jwt) {
    return <Navigate to={redirectPath} replace />;
  }

  const payload = JwtParser(jwt);
  const { exp } = payload;
  if (!exp || Date.now() >= exp * 1000) {
    return <Navigate to={redirectPath} replace />;
  }

  return children;
}

export default ProtectedRoute;
