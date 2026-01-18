import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { DataContext } from '../context/DataContext';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user } = useContext(DataContext);
  if (user?.role !== 'admin') return <Navigate to="/" />;
  return <>{children}</>;
}
