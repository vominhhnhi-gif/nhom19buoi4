import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UserList from './components/UserList';
import AddUser from './components/AddUser';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import AdminUserList from './components/AdminUserList';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import './App.css';
import auth, { getUserFromToken } from './lib/auth';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

function App() {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:3000/users');
      setUsers(res.data);
    } catch (err) {
      console.error('Failed to fetch users', err);
    }
  };

  useEffect(() => {
    fetchUsers();
    // initialize current user from token
    try {
      const u = getUserFromToken();
      setCurrentUser(u);
    } catch (e) {}
    const onAuthChanged = (e) => {
      try {
        const u = getUserFromToken();
        setCurrentUser(u);
      } catch (err) {}
    };
    window.addEventListener('auth:changed', onAuthChanged);
    return () => window.removeEventListener('auth:changed', onAuthChanged);
  }, []);

  return (
    <Router>
      <div className="App container">
        <header className="app-header">
          <h1>User Manager</h1>
          <nav>
            <Link to="/">Trang chủ</Link> |{' '}
            <Link to="/login">Đăng nhập</Link> |{' '}
            <Link to="/register">Đăng ký</Link> |{' '}
            <Link to="/profile">Profile</Link> |{' '}
            <Link to="/admin">Admin</Link> |{' '}
            <Link to="/forgot-password">Quên mật khẩu</Link> |{' '}
            <Link to="/reset-password">Đổi mật khẩu</Link>
          </nav>
          <div style={{ marginTop: 8 }}>
            {currentUser ? (
              <div className="row">
                <div style={{ marginRight: 12 }}>Xin chào, <strong>{currentUser.name || currentUser.email || 'User'}</strong></div>
                <button className="btn-ghost" onClick={() => { auth.clearToken(); setCurrentUser(null); }}>Logout</button>
              </div>
            ) : null}
          </div>
        </header>
        <main className="app-main">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/admin" element={<AdminUserList />} />
            <Route path="/" element={
              <>
                <section className="left">
                  <AddUser onUserAdded={fetchUsers} />
                </section>
                <section className="right">
                  <UserList users={users} onUsersChanged={fetchUsers} />
                </section>
              </>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;