import React, { useState } from 'react';
import UserList from './components/UserList';
import AddUser from './components/AddUser';
import EditUser from './components/EditUser';
// import './App.css';

function App() {
  const [editingUser, setEditingUser] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleEditUser = (user) => {
    setEditingUser(user);
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
  };

  const handleEditSuccess = () => {
    setEditingUser(null);
    setRefreshTrigger(prev => prev + 1); // Trigger refresh cho UserList
  };

  const handleAddSuccess = () => {
    setRefreshTrigger(prev => prev + 1); // Trigger refresh cho UserList
  };

  return (
    <div className="App">
      <h1>Quản Lý User</h1>
      <AddUser onSuccess={handleAddSuccess} />
      <UserList 
        onEditUser={handleEditUser}
        refreshTrigger={refreshTrigger}
      />
      {editingUser && (
        <EditUser 
          user={editingUser}
          onCancel={handleCancelEdit}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  );
}

export default App;