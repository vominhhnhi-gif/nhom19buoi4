import React, { useEffect, useState, useMemo } from 'react';
import api from '../lib/api';
import Button from './ui/Button';
import Card from './ui/Card';
import EmptyState from './ui/EmptyState';
import Input from './ui/Input';
import { useNavigate } from 'react-router-dom';
import { setAuthFromLocalStorage, clearAuth } from '../lib/api';
import {
  Trash2,
  Users,
  LogOut,
  Search,
  User,
  ChevronUp,
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Edit,
  Eye
} from 'lucide-react';

const AdminUserList = ({ currentUser }) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [error, setError] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [pageSize] = useState(10);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      setAuthFromLocalStorage();
      const res = await api.get('/users');
      setUsers(res.data || []);
      setFilteredUsers(res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể tải users');
    }
  };

  // Only fetch users when we know the current user is admin
  useEffect(() => {
    if (currentUser?.role === 'admin' || currentUser?.role === 'moderator') {
      // both admin and moderator can view the list; only admin can perform actions
      fetchUsers();
      setIsAdmin(currentUser?.role === 'admin');
    } else {
      setIsAdmin(false);
    }
  }, [currentUser]);

  // Filter users based on search term
  useEffect(() => {
    const filtered = users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user._id || user.id).toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  }, [searchTerm, users]);

  // Sort users
  const sortedUsers = useMemo(() => {
    const sortableUsers = [...filteredUsers];
    if (sortConfig.key) {
      sortableUsers.sort((a, b) => {
        const aValue = a[sortConfig.key] || '';
        const bValue = b[sortConfig.key] || '';

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableUsers;
  }, [filteredUsers, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(sortedUsers.length / pageSize);
  const paginatedUsers = sortedUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedUsers(paginatedUsers.map(user => user._id || user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (userId, checked) => {
    if (checked) {
      setSelectedUsers([...selectedUsers, userId]);
    } else {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Bạn có chắc muốn xóa user này?')) return;
    try {
  setAuthFromLocalStorage();
  await api.delete(`/users/${id}`);
      fetchUsers();
      setSelectedUsers(selectedUsers.filter(selectedId => selectedId !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Xóa thất bại');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedUsers.length === 0) return;
    if (!confirm(`Bạn có chắc muốn xóa ${selectedUsers.length} user đã chọn?`)) return;

    try {
  setAuthFromLocalStorage();
  await Promise.all(selectedUsers.map(id => api.delete(`/users/${id}`)));
      fetchUsers();
      setSelectedUsers([]);
    } catch (err) {
      setError(err.response?.data?.message || 'Xóa thất bại');
    }
  };

  const handleLogout = async () => {
    try {
  await api.post('/auth/logout');
    } catch (err) {
      // ignore server errors
    }
    clearAuth();
    navigate('/login');
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return <ChevronUp className="w-4 h-4 text-gray-400" />;
    }
    return sortConfig.direction === 'asc'
      ? <ChevronUp className="w-4 h-4 text-indigo-600" />
      : <ChevronDown className="w-4 h-4 text-indigo-600" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">

            {/* Search */}
            <div className="flex-1 max-w-md">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3"><Users className="w-6 h-6 text-indigo-600" /> Quản lý người dùng</h1>
            <p className="text-sm text-gray-600">Xem, tìm kiếm và quản lý người dùng trong hệ thống</p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Tìm kiếm người dùng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3"
                aria-label="Tìm kiếm người dùng"
              />
            </div>

            <div className="flex items-center gap-2">
              {isAdmin ? (
                selectedUsers.length > 0 ? (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Đã chọn {selectedUsers.length}</span>
                    <Button variant="danger" onClick={handleBulkDelete}><Trash2 className="w-4 h-4" /> Xóa</Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Button onClick={() => navigate('/admin/logs')} className="hidden md:inline-flex">Xem nhật ký</Button>
                    <Button onClick={fetchUsers} className="hidden md:inline-flex">Làm mới</Button>
                  </div>
                )
              ) : (
                <Button onClick={fetchUsers} className="hidden md:inline-flex">Làm mới</Button>
              )}
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6">
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-xl" role="status" aria-live="polite">
              <div className="flex items-start gap-3">
                <svg className="h-5 w-5 text-red-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-sm text-red-700 font-medium">{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Responsive list for mobile */}
        <div className="space-y-4 md:hidden">
          {paginatedUsers.map((user) => (
            <Card key={user._id || user.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-r from-indigo-400 to-purple-500 flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    <div className="text-xs text-gray-500">{user.email}</div>
                    <div className="text-xs text-gray-400">ID: {user._id || user.id}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {isAdmin && (
                    <Button variant="ghost" onClick={() => handleDelete(user._id || user.id)} aria-label={`Delete ${user.name}`}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Desktop table */}
        <div className="hidden md:block bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {isAdmin && (
                    <th className="px-4 py-3 text-left w-12">
                      <input
                        type="checkbox"
                        checked={paginatedUsers.length > 0 && selectedUsers.length === paginatedUsers.length}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </th>
                  )}
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('name')}>
                    <div className="flex items-center gap-2"><User className="w-4 h-4" /> Tên {getSortIcon('name')}</div>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('email')}>Email {getSortIcon('email')}</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Vai trò</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Ngày tạo</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedUsers.map((user, index) => (
                  <tr key={user._id || user.id} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                      {isAdmin && (
                        <td className="px-4 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(user._id || user.id)}
                            onChange={(e) => handleSelectUser(user._id || user.id, e.target.checked)}
                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                        </td>
                      )}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-400 to-purple-500 flex items-center justify-center">
                            <User className="h-5 w-5 text-white" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">ID: {user._id || user.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                        {user.role || 'user'}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : 'N/A'}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        {isAdmin && (
                          <>
                            <Button variant="ghost" onClick={() => handleDelete(user._id || user.id)} aria-label={`Delete ${user.name}`} className="px-2 py-1 text-sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" onClick={() => navigate(`/users/${user._id || user.id}`)} aria-label={`View ${user.name}`} className="px-2 py-1 text-sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {paginatedUsers.length === 0 && !error && (
            <div className="p-8">
              <EmptyState
                icon={<Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />}
                title="Không có người dùng nào"
                description={searchTerm ? 'Không tìm thấy người dùng phù hợp với tìm kiếm của bạn.' : 'Chưa có người dùng nào trong hệ thống.'}
              />
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white rounded-2xl shadow-xl p-4 mt-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-700">Hiển thị {((currentPage - 1) * pageSize) + 1} đến {Math.min(currentPage * pageSize, sortedUsers.length)} của {sortedUsers.length} kết quả</div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className="p-2">
                  <ChevronsLeft className="w-4 h-4" />
                </Button>
                <Button variant="ghost" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} className="p-2">
                  <ChevronLeft className="w-4 h-4" />
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                    if (page > totalPages) return null;
                    return (
                      <Button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentPage === page ? 'bg-indigo-600 text-white' : 'border border-gray-300 hover:bg-gray-50'}`}
                        variant={currentPage === page ? 'primary' : 'ghost'}
                      >
                        {page}
                      </Button>
                    );
                  })}
                </div>

                <Button variant="ghost" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} className="p-2">
                  <ChevronRight className="w-4 h-4" />
                </Button>
                <Button variant="ghost" onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} className="p-2">
                  <ChevronsRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUserList;
