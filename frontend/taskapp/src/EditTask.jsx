import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function EditTask() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', dueDate: '', priority: 'Medium' });

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('https://sparkling-rejoicing-production.up.railway.app/api/tasks', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      const task = res.data.find(t => t._id === id);
      if (task) setForm({ ...task, dueDate: task.dueDate.slice(0, 10) });
    });
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    await axios.put(`https://sparkling-rejoicing-production.up.railway.app/api/tasks/${id}`, form, {
      headers: { Authorization: `Bearer ${token}` },
    });
    navigate('/');
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-6 text-gray-800">Edit Task</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <input name="title" onChange={handleChange} value={form.title} placeholder="Title" className="w-full border border-gray-300 p-2 rounded" required />
        <textarea name="description" onChange={handleChange} value={form.description} placeholder="Description" className="w-full border border-gray-300 p-2 rounded" required />
        <input type="date" name="dueDate" onChange={handleChange} value={form.dueDate} className="w-full border border-gray-300 p-2 rounded" required />
        <select name="priority" onChange={handleChange} value={form.priority} className="w-full border border-gray-300 p-2 rounded">
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <button type="submit" className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded w-full transition">Update Task</button>
      </form>
    </div>
  );
}

export default EditTask;
