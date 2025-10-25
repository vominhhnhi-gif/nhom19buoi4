import React, { useState, useEffect } from 'react';
import api, { setAuthFromLocalStorage, clearAuth } from '../lib/api';
import { LogOut, Trash2, UploadCloud, User, Mail, Lock, Camera, Link as LinkIcon, Save, ArrowLeft } from 'lucide-react';
import DemoRefresh from './DemoRefresh';
import { Link } from 'react-router-dom';
import Button from './ui/Button';
import Input from './ui/Input';
import Card from './ui/Card';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

const Profile = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState('');
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [userId, setUserId] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const fetchProfile = async () => {
    try {
      setAuthFromLocalStorage();
      const res = await api.get(`/profile`);
      const user = res.data;
      setName(user.name || '');
      setEmail(user.email || '');
      setAvatar(user.avatar || '');
      setUserId(user._id || user.id || null);
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể tải profile');
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      try {
        if (previewUrl) URL.revokeObjectURL(previewUrl);
      } catch (e) {}
    };
  }, [previewUrl]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const body = { name, email };
      if (password) body.password = password;
  setAuthFromLocalStorage();
  const res = await api.put(`/profile`, body);
      setMessage(res.data.message || 'Cập nhật thông tin thành công!');
      setPassword('');
      // refresh avatar/name/email
      setName(res.data.name || name);
      setEmail(res.data.email || email);
      setAvatar(res.data.avatar || avatar);
    } catch (err) {
      setError(err.response?.data?.message || 'Cập nhật thất bại');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    // create temporary preview URL
    try {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    } catch (e) {}
    const url = URL.createObjectURL(f);
    setPreviewUrl(url);
    setFile(f);
  };

  const handleUploadFile = async () => {
    if (!file) return setError('Chưa chọn file');
    setError('');
    setIsUploading(true);
    try {
      const form = new FormData();
      form.append('avatar', file);
  setAuthFromLocalStorage();
  const res = await api.post(`/profile/upload-avatar`, form, { headers: { 'Content-Type': 'multipart/form-data' } });
      const uploaded = res.data.avatar || res.data.avatarUrl || '';
      setAvatar(uploaded);
      // clear preview (we now use server url)
      try { if (previewUrl) { URL.revokeObjectURL(previewUrl); } } catch (e) {}
      setPreviewUrl('');
      setMessage('Upload avatar thành công');
      setFile(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload thất bại');
    } finally {
      setIsUploading(false);
    }
  };

  const handleUploadUrl = async () => {
    const url = prompt('Dán URL ảnh (ví dụ một URL cloudinary):');
    if (!url) return;
    setError('');
    setIsUploading(true);
    try {
  setAuthFromLocalStorage();
  const res = await api.post(`/profile/upload-avatar`, { avatarUrl: url });
      setAvatar(res.data.avatar || '');
      setMessage('Avatar cập nhật từ URL thành công');
    } catch (err) {
      setError(err.response?.data?.message || 'Cập nhật avatar thất bại');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!userId) return setError('Không xác định user');
    if (!confirm('Bạn có chắc muốn xóa tài khoản này? Hành động không thể hoàn tác.')) return;
    try {
  setAuthFromLocalStorage();
  await api.delete(`/users/${userId}`);
  // logout after delete
  await api.post(`/auth/logout`).catch(() => { });
  clearAuth();
  window.location.href = '/login';
    } catch (err) {
      setError(err.response?.data?.message || 'Xóa tài khoản thất bại');
    }
  };

  const handleLogout = async () => {
    try {
      setAuthFromLocalStorage();
      await api.post(`/auth/logout`);
    } catch (err) {
      // ignore
    }
    clearAuth();
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Quay lại
          </Link>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Thông tin cá nhân</h1>
            <p className="text-gray-600">Quản lý thông tin cá nhân của bạn</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Avatar Section */}
          <div className="lg:col-span-1">
            <Card>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Ảnh đại diện</h2>

              <div className="flex justify-center mb-6">
                <div className="relative">
                    <div className="w-48 h-48 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl overflow-hidden shadow-xl">
                      {previewUrl ? (
                        <img src={previewUrl} alt="preview" className="w-full h-full object-cover" />
                      ) : avatar ? (
                        <img src={avatar} alt={name ? `${name} avatar` : 'avatar'} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User className="w-24 h-24 text-white/80" />
                        </div>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      onClick={() => document.getElementById('avatar-input').click()}
                      aria-label="Upload avatar"
                      className="absolute bottom-2 right-2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors p-0"
                    >
                      <Camera className="w-6 h-6 text-gray-600" />
                    </Button>
                </div>
              </div>

              <input id="avatar-input" className="hidden" type="file" accept="image/*" onChange={handleFileChange} aria-label="Choose avatar file" tabIndex="-1" />

              <div className="space-y-3">
                <Button onClick={handleUploadFile} disabled={!file || isUploading} className="w-full">
                  {isUploading ? 'Đang upload...' : (<><UploadCloud className="w-5 h-5" /> Upload file</>)}
                </Button>

                <Button variant="secondary" onClick={handleUploadUrl} disabled={isUploading} className="w-full">
                  <LinkIcon className="w-5 h-5" /> Upload từ URL
                </Button>
              </div>
            </Card>
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2">
            <Card>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Thông tin cá nhân</h2>

              <form onSubmit={handleUpdate} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Họ và tên
                    </label>
                    <Input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Nhập họ và tên" required />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email
                    </label>
                    <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Nhập email" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Mật khẩu mới (để trống nếu không đổi)
                  </label>
                  <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Nhập mật khẩu mới" />
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-xl" role="status" aria-live="polite">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-700">{error}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Success Message */}
                {message && (
                  <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-xl" role="status" aria-live="polite">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-green-700">{message}</p>
                      </div>
                    </div>
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Đang cập nhật...' : (<><Save className="w-5 h-5" /> Cập nhật thông tin</>)}
                </Button>
              </form>

              {/* Action Buttons */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button variant="secondary" onClick={handleLogout} className="flex-1">
                    <div className="flex items-center justify-center gap-2"><LogOut className="w-5 h-5" /> Đăng xuất</div>
                  </Button>

                  <Button variant="danger" onClick={handleDeleteAccount} className="flex-1">
                    <div className="flex items-center justify-center gap-2"><Trash2 className="w-5 h-5" /> Xóa tài khoản</div>
                  </Button>
                </div>
                <div className="mt-6">
                  <DemoRefresh />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
