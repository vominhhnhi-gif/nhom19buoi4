import React, { useState } from 'react';
import api from '../lib/api';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import Button from './ui/Button';
import Input from './ui/Input';
import Card from './ui/Card';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
  const res = await api.post('/auth/forgot-password', { email });
  setMessage(res.data.resetToken ? `Reset token (demo): ${res.data.resetToken}` : res.data.message || 'Yêu cầu đã được gửi');
      setIsSuccess(true);
      // if we have a resetToken, store it to local state so the UI can show "Tiếp theo"
      if (res.data.resetToken) setResetToken(res.data.resetToken);
    } catch (err) {
      setError(err.response?.data?.message || 'Gửi yêu cầu thất bại');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Quay lại đăng nhập
          </Link>
        </div>

        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl shadow-lg mb-4">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quên mật khẩu</h1>
          <p className="text-gray-600">Nhập email để nhận hướng dẫn đặt lại mật khẩu</p>
        </div>

        {/* Form Card */}
        <Card>
          {!isSuccess ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </label>
                <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Nhập email của bạn" required />
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-xl">
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

              {/* Submit Button */}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Đang gửi...' : (<><Mail className="w-5 h-5" /> Gửi yêu cầu</>)}
              </Button>
            </form>
          ) : (
            /* Success State */
            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Yêu cầu đã được gửi!</h3>
                <p className="text-gray-600">{message}</p>
              </div>

              {resetToken && (
                <Button onClick={() => navigate(`/reset-password?token=${encodeURIComponent(resetToken)}`)}>
                  Tiếp theo
                  <ArrowRight className="w-5 h-5" />
                </Button>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
