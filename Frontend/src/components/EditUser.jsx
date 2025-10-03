import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EditUser = ({ user, onCancel, onSuccess }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      alert('Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    axios.put(`http://localhost:3000/users/${user.id}`, { name, email })
      .then(() => {
        alert('Cập nhật user thành công!');
        onSuccess(); // Callback để refresh danh sách và đóng form
      })
      .catch(error => {
        console.log(error);
        alert('Có lỗi khi cập nhật user!');
      });
  };

  if (!user) return null;

  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      width: '100%', 
      height: '100%', 
      backgroundColor: 'rgba(0,0,0,0.5)', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center' 
    }}>
      <div style={{ 
        backgroundColor: 'white', 
        padding: '20px', 
        borderRadius: '5px', 
        minWidth: '300px' 
      }}>
        <h3>Sửa Thông Tin User</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '10px' }}>
            <label>Tên:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: '100%', padding: '5px', marginTop: '5px' }}
              required
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '5px', marginTop: '5px' }}
              required
            />
          </div>
          <div>
            <button 
              type="submit"
              style={{ 
                marginRight: '10px', 
                padding: '8px 15px', 
                backgroundColor: '#28a745', 
                color: 'white', 
                border: 'none', 
                cursor: 'pointer' 
              }}
            >
              Cập Nhật
            </button>
            <button 
              type="button" 
              onClick={onCancel}
              style={{ 
                padding: '8px 15px', 
                backgroundColor: '#6c757d', 
                color: 'white', 
                border: 'none', 
                cursor: 'pointer' 
              }}
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUser;