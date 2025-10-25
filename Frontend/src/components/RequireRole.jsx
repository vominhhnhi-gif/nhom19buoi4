import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * RequireRole component
 * Props:
 * - allowedRoles: array of role strings allowed (e.g. ['admin','moderator'])
 * - currentUser: user object with `role` property (may be null while loading)
 * - children: element to render when allowed
 */
const RequireRole = ({ allowedRoles = [], currentUser, children }) => {
  // If not logged in (no currentUser), redirect to login
  if (!currentUser) return <Navigate to="/login" replace />;

  // If currentUser exists but role not allowed, show simple Forbidden message
  if (!allowedRoles.includes(currentUser.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-lg w-full text-center">
          <h3 className="text-xl font-semibold mb-2">Truy cập bị từ chối</h3>
          <p className="text-gray-600 mb-4">Bạn không có quyền truy cập vào trang này.</p>
        </div>
      </div>
    );
  }

  return children;
};

export default RequireRole;
