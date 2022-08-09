import React from 'react';


import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Login } from 'scenes/Login';
import { Root } from 'scenes/Root';

import { useAuth } from 'components/AuthProvider';

const RequireAuth = (props) => {
  const { children } = props;
  const { isAuthenticated } = useAuth();
  let location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

interface Props {
  isAuthenticated: boolean;
  setAuthentication: (state: boolean) => void;
}

export const Router: React.FC<Props> = (props) => {
  const { isAuthenticated } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={isAuthenticated
            ? <Navigate to="/" replace />
            : <Login/>
          }
        />
        <Route path="/playlist/:playlistId" element={
            <RequireAuth>
              <Root/>
            </RequireAuth>
          }
        />
        <Route path="/" element={
            <RequireAuth>
              <Root/>
            </RequireAuth>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}