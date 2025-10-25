import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile, logout as logoutThunk } from './features/authSlice';
import { setAuthFromLocalStorage, clearAuth } from './lib/api';
import { useNavigate } from 'react-router-dom';
// UserList and AddUser were removed from the root route in favor of the Profile page
import AuthForm from './components/AuthForm';
import Register from './components/Register';
import Profile from './components/Profile';
import AdminUserList from './components/AdminUserList';
import AdminLogs from './components/AdminLogs';
import UserDetail from './components/UserDetail';
import RequireRole from './components/RequireRole';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import Navbar from './components/Navbar';
import { Routes, Route } from 'react-router-dom';

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((s) => s.auth.token);
  const currentUser = useSelector((s) => s.auth.user);

  useEffect(() => {
    // ensure axios header is set from localStorage (if token present)
    setAuthFromLocalStorage();
    if (token && !currentUser) {
      // attempt to load profile into redux
      dispatch(fetchProfile()).catch(() => {
        // if fetch fails, clear auth and redirect
        clearAuth();
        navigate('/login');
      });
    }
  }, [dispatch, token, currentUser, navigate]);

  const handleLogout = async () => {
    // dispatch logout thunk which will remove token/localStorage
    try {
      await dispatch(logoutThunk()).unwrap();
    } catch (e) {
      // ignore errors
    }
    clearAuth();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
  {/* Show Navbar only after we have a valid token AND the current user profile is loaded */}
  {token && currentUser && <Navbar currentUser={currentUser} onLogout={handleLogout} />}

      <main className={token ? 'app-main p-6' : 'flex items-center justify-center min-h-screen p-6'}>
        <div className={token ? 'w-full' : 'w-full max-w-md'}>
          <Routes>
            <Route path="/login" element={<AuthForm />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={token ? <Profile /> : <AuthForm />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route
              path="/admin"
              element={
                token ? (
                  <RequireRole allowedRoles={[ 'admin', 'moderator' ]} currentUser={currentUser}>
                    <AdminUserList currentUser={currentUser} />
                  </RequireRole>
                ) : (
                  <AuthForm />
                )
              }
            />
            <Route
              path="/admin/logs"
              element={
                token ? (
                  <RequireRole allowedRoles={[ 'admin', 'moderator' ]} currentUser={currentUser}>
                    <AdminLogs />
                  </RequireRole>
                ) : (
                  <AuthForm />
                )
              }
            />
            <Route path="/users/:id" element={token ? <RequireRole allowedRoles={[ 'admin' ]} currentUser={currentUser}><UserDetail /></RequireRole> : <AuthForm />} />
              <Route path="/" element={token ? <Profile /> : <AuthForm />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;