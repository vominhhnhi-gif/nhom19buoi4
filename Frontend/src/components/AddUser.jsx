import React, { useState } from 'react';
import axios from 'axios';

const AddUser = ({ onSuccess }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      alert('Vui lòng nhập đầy đủ thông tin!');
      return;
    }
    e.preventDefault(); 
  if (!/\S+@\S+\.\S+/.test(email)) { 
      alert("Email không hợp lệ"); 
      return; 
    } 

    axios.post('http://localhost:3000/users', { name, email })
      .then(() => {
        setName('');
        setEmail('');
        alert('Thêm user thành công!');
        if (onSuccess) {
          onSuccess(); // Gọi callback để refresh danh sách
        }
      })
      .catch(error => {
        console.log(error);
        alert('Có lỗi khi thêm user!');
      });
  };

  return (
    <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '5px' }}>
      <h3>Thêm User Mới</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="Tên"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ padding: '8px', marginRight: '10px', width: '200px' }}
            required
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: '8px', marginRight: '10px', width: '200px' }}
            required
          />
        </div>
        <button 
          type="submit"
          style={{ 
            padding: '8px 15px', 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none', 
            cursor: 'pointer',
            borderRadius: '3px'
          }}
        >
          Thêm User
        </button>
      </form>
    </div>
  );
};

export default AddUser;