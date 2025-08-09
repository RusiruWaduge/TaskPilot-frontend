import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Dashboard from './Dashboard';
import AddTask from './AddTask';
import EditTask from './EditTask';
import Login from './Login';
import Register from './Register';
import './App.css'; 

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/add" element={<AddTask />} />
      <Route path="/edit/:id" element={<EditTask />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default App;

