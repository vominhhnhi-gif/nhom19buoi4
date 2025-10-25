import React, { useEffect, useState } from 'react';
import api, { setAuthFromLocalStorage } from '../lib/api';
import Card from './ui/Card';
import Input from './ui/Input';
import Button from './ui/Button';
import EmptyState from './ui/EmptyState';
import { Logs, Search } from 'lucide-react';

const AdminLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [action, setAction] = useState('');

  const fetchLogs = async (opts = {}) => {
    setLoading(true);
    setError('');
    try {
      setAuthFromLocalStorage();
      const q = {};
      if (opts.email || email) q.email = opts.email || email;
      if (opts.action || action) q.action = opts.action || action;
      q.limit = 200;
      const params = new URLSearchParams(q).toString();
      const res = await api.get(`/admin/logs?${params}`);
      setLogs(res.data || []);
    } catch (e) {
      setError(e.response?.data?.message || e.message || 'Không thể tải logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3"><Logs className="w-6 h-6 text-indigo-600" /> Nhật ký hoạt động</h1>
          <p className="text-sm text-gray-600">Xem hoạt động người dùng: login success/failure, uploads, account changes, và các sự kiện bị chặn do rate limit.</p>
        </div>

        <Card>
          <div className="flex gap-3 items-center mb-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input placeholder="Lọc theo email" value={email} onChange={e => setEmail(e.target.value)} className="pl-12" />
            </div>
            <Input placeholder="Action (e.g. login_failure)" value={action} onChange={e => setAction(e.target.value)} />
            <Button onClick={() => fetchLogs()} disabled={loading}>Tìm</Button>
            <Button variant="ghost" onClick={() => { setEmail(''); setAction(''); fetchLogs({ email: '', action: '' }); }}>Reset</Button>
          </div>

          {error && <div className="mb-4 text-red-700">{error}</div>}

          {loading ? (
            <div>Đang tải…</div>
          ) : logs.length === 0 ? (
            <EmptyState title="Không có log nào" description="Không tìm thấy sự kiện phù hợp." />
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm text-gray-500">Thời gian</th>
                    <th className="px-4 py-2 text-left text-sm text-gray-500">Email / User</th>
                    <th className="px-4 py-2 text-left text-sm text-gray-500">Action</th>
                    <th className="px-4 py-2 text-left text-sm text-gray-500">IP</th>
                    <th className="px-4 py-2 text-left text-sm text-gray-500">User-Agent</th>
                    <th className="px-4 py-2 text-left text-sm text-gray-500">Kết quả</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {logs.map((l) => (
                    <tr key={l._id}>
                      <td className="px-4 py-2 text-sm text-gray-700">{new Date(l.createdAt).toLocaleString('vi-VN')}</td>
                      <td className="px-4 py-2 text-sm text-gray-700">{l.email || l.userId || '—'}</td>
                      <td className="px-4 py-2 text-sm text-gray-700">{l.action}</td>
                      <td className="px-4 py-2 text-sm text-gray-700">{l.ip || '—'}</td>
                      <td className="px-4 py-2 text-sm text-gray-700">{l.userAgent ? String(l.userAgent).slice(0, 80) : '—'}</td>
                      <td className="px-4 py-2 text-sm">{l.success ? <span className="text-green-600">Success</span> : <span className="text-red-600">Fail</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        <div className="mt-6 text-sm text-gray-500">
          <p>Demo rate-limit: để gây ra <strong>login_failure</strong> và sau đó event <strong>login_blocked</strong>, thử đăng nhập nhiều lần với mật khẩu sai (tùy theo cấu hình server, mặc định 5 lần trong 15 phút).</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogs;
