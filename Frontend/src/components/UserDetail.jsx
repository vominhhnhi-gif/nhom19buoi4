import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { setAuthFromLocalStorage } from '../lib/api';
import Card from './ui/Card';
import Button from './ui/Button';
import { User, Mail, Trash2, ArrowLeft } from 'lucide-react';

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError('');
      try {
        setAuthFromLocalStorage();
        const res = await api.get(`/users/${id}`);
        setUser(res.data || null);
      } catch (err) {
        setError(err.response?.data?.message || 'Không thể tải người dùng');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchUser();
  }, [id]);

  const handleDelete = async () => {
    if (!confirm('Bạn có chắc muốn xóa user này?')) return;
    try {
      setAuthFromLocalStorage();
      await api.delete(`/users/${id}`);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Xóa thất bại');
    }
  };

  if (loading) return <div className="p-6">Đang tải...</div>;

  if (error) return (
    <div className="p-6">
      <Card>
        <div className="text-red-600">{error}</div>
        <div className="mt-4"><Button onClick={() => navigate(-1)}><ArrowLeft className="w-4 h-4" /> Quay lại</Button></div>
      </Card>
    </div>
  );

  if (!user) return <div className="p-6">Người dùng không tồn tại</div>;

  return (
    <div className="p-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-4">
          <Button variant="ghost" onClick={() => navigate(-1)}><ArrowLeft className="w-4 h-4" /> Quay lại</Button>
        </div>

        <Card>
          <div className="flex items-center gap-6">
            <div className="h-20 w-20 rounded-full bg-gradient-to-r from-indigo-400 to-purple-500 flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-sm text-gray-600"><Mail className="w-4 h-4 inline-block mr-2" /> {user.email}</p>
              <p className="text-xs text-gray-400">ID: {user._id || user.id}</p>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <Button variant="danger" onClick={handleDelete}><Trash2 className="w-4 h-4" /> Xóa</Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default UserDetail;
