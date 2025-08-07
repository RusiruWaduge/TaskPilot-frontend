import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AddTask() {
  const [form, setForm] = useState({ title: '', description: '', dueDate: '', priority: 'Medium' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    localStorage.setItem('token', res.data.token);
    await axios.post('http://localhost:5000/api/tasks', form, {
      headers: { Authorization: `Bearer ${token}` },
    });
    navigate('/');
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-lg font-bold mb-4 text-gray-800">Add Task</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="title" onChange={handleChange} value={form.title} placeholder="Title" className="w-full border p-2" required />
        <textarea name="description" onChange={handleChange} value={form.description} placeholder="Description" className="w-full border p-2" required />
        <input type="date" name="dueDate" onChange={handleChange} value={form.dueDate} className="w-full border p-2" required />
        <select name="priority" onChange={handleChange} value={form.priority} className="w-full border p-2">
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Add Task</button>
      </form>
    </div>
  );
}

export default AddTask;
