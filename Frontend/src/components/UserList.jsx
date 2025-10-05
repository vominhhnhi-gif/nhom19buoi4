import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserList = ({ onEditUser, refreshTrigger }) => {
  const [users, setUsers] = useState([]);

  const fetchUsers = () => {
    axios.get('http://localhost:3000/users')
      .then(response => setUsers(response.data))
      .catch(error => console.log(error));
  };

  useEffect(() => {
    fetchUsers();
  }, [refreshTrigger]);

  const handleDelete = (userId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa user này?')) {
      axios.delete(`http://localhost:3000/users/${userId}`)
        .then(() => {
          alert('Xóa user thành công!');
          fetchUsers(); // Refresh danh sách sau khi xóa
        })
        .catch(error => {
          console.log(error);
          alert('Có lỗi khi xóa user!');
        });
    }
  };

  return (
    <div>
      <h2>Danh Sách User</h2>
      <ul>
        {users.map(user => (
          <li key={user.id} style={{ marginBottom: '10px', padding: '10px', border: '1px solid #ccc' }}>
            <div>
              <strong>{user.name}</strong> - {user.email}
            </div>
            <div style={{ marginTop: '5px' }}>
              <button 
                onClick={() => onEditUser(user)}
                style={{ marginRight: '10px', padding: '5px 10px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}
              >
                Sửa
              </button>
              <button 
                onClick={() => handleDelete(user.id)}
                style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', cursor: 'pointer' }}
              >
                Xóa
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;