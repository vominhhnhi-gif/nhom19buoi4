import React, { useState } from 'react';
import axios from 'axios';
import auth from '../lib/auth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:3000/auth/login', { email, password });
      if (res.data && res.data.token) {
        auth.setToken(res.data.token);
        alert('Đăng nhập thành công');
      } else {
        alert('Đăng nhập: không nhận token từ server');
      }
    } catch (err) {
      console.error('Login error', err.response || err);
      const msg = err?.response?.data?.message || 'Login failed';
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container card">
      <h2>Đăng nhập</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <label>Email:</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div className="form-row">
          <label>Mật khẩu:</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <div className="auth-actions">
          <button className="btn" type="submit" disabled={loading}>{loading ? 'Đang...' : 'Đăng nhập'}</button>
        </div>
      </form>
    </div>
  );
};

export default Login;