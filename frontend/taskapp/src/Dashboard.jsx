import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import logo from '../src/assets/logo.jpg'; // Adjust path if needed

// Beautiful SearchBar component integrated inside the file for simplicity
const SearchBar = ({ searchQuery, setSearchQuery }) => (
  <div className="max-w-4xl mx-auto px-4 mb-6">
    <label htmlFor="task-search" className="sr-only">Search Tasks</label>
    <div className="relative text-black-600 focus-within:text-black-700 bg-white rounded-lg shadow-sm">
      <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        {/* Search Icon */}
        <svg
          className="w-5 h-5 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z"
          />
        </svg>
      </span>
      <input
        type="search"
        id="task-search"
        placeholder="Search tasks..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="block w-full pl-10 pr-8 py-3 rounded-lg border border-black-700 transition focus:border-indigo-800 focus:ring-2 focus:ring-indigo-400 focus:outline-none text-black-900 placeholder-black-800"
      />
    </div>
  </div>
);

function Dashboard() {
  // State
  const [tasks, setTasks] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    category: 'Others',
    priority: 'Low',
  });
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState({ name: '' });

  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  // Today's date string for min attribute
  const today = new Date().toISOString().split('T')[0];

  // Categories for dropdown
  const categories = [
    'Work', 'Personal', 'Health', 'Study', 'Finance',
    'Errands', 'Shopping', 'Fitness', 'Travel',
    'Project', 'Meeting', 'Others'
  ];

  // Redirect to login if no token, otherwise fetch user info
  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else {
      fetchUser();
    }
    // eslint-disable-next-line
  }, []);

  // Fetch logged-in user details
  const fetchUser = async () => {
    try {
      const res = await fetch('https://sparkling-rejoicing-production.up.railway.app/api/auth/me', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } catch (err) {
      console.error('Failed to fetch user:', err);
      navigate('/login');
    }
  };

  // Fetch all tasks
  const fetchTasks = async () => {
    try {
      const res = await axios.get('https://sparkling-rejoicing-production.up.railway.app/api/tasks', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  };

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line
  }, []);

  // Handle form changes
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Handle add/edit task
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.dueDate && formData.dueDate < today) {
      alert('Due date cannot be in the past. Please select today or a future date.');
      return;
    }

    try {
      if (editingTaskId) {
        await axios.put(
          `https://sparkling-rejoicing-production.up.railway.app/api/tasks/${editingTaskId}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setEditingTaskId(null);
      } else {
        await axios.post(
          'https://sparkling-rejoicing-production.up.railway.app/api/tasks',
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      setFormData({
        title: '',
        description: '',
        dueDate: '',
        category: 'Others',
        priority: 'Low',
      });
      fetchTasks();
    } catch (err) {
      console.error('Error submitting task:', err.response ? err.response.data : err);
    }
  };

  // Handle edit
  const handleEdit = (task) => {
    setFormData({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate ? task.dueDate.substring(0, 10) : '',
      category: task.category || 'Others',
      priority: task.priority,
    });
    setEditingTaskId(task._id);
  };

  // Handle delete
  const handleDelete = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await axios.delete(`https://sparkling-rejoicing-production.up.railway.app/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTasks();
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  // Toggle complete
  const handleToggleComplete = async (taskId, currentStatus) => {
    try {
      await axios.patch(
        `https://sparkling-rejoicing-production.up.railway.app/api/tasks/${taskId}/toggle`,
        { completed: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchTasks();
    } catch (err) {
      console.error('Error toggling task status:', err);
    }
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Badge colors
  const badgeColors = {
    Low: 'bg-green-100 text-green-800',
    Medium: 'bg-yellow-100 text-yellow-800',
    High: 'bg-red-100 text-red-700',
  };

  // Category colors
  const categoryColors = {
    Work: 'bg-blue-100 text-blue-800',
    Personal: 'bg-pink-100 text-pink-700',
    Health: 'bg-red-100 text-red-700',
    Study: 'bg-purple-100 text-purple-800',
    Finance: 'bg-yellow-100 text-yellow-800',
    Errands: 'bg-gray-200 text-gray-800',
    Shopping: 'bg-indigo-100 text-indigo-800',
    Fitness: 'bg-green-100 text-green-800',
    Travel: 'bg-teal-100 text-teal-800',
    Project: 'bg-orange-100 text-orange-800',
    Meeting: 'bg-cyan-100 text-cyan-700',
    Others: 'bg-slate-100 text-slate-700',
  };

  // Filter tasks based on searchQuery
  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const completedTasks = filteredTasks.filter((task) => task.completed);
  const pendingTasks = filteredTasks.filter((task) => !task.completed);

  // Render tasks helper
  const renderTasks = (taskList) => (
    <>
      {taskList.length === 0 ? (
        <p className="text-center text-gray-400 mt-10">No tasks found.</p>
      ) : (
        <ul className="space-y-4">
          {taskList.map((task) => (
            <li
              key={task._id}
              className="bg-gradient-to-br from-white via-blue-50 to-slate-50 shadow rounded-xl p-4 border border-blue-100 flex justify-between items-start group"
            >
              <div>
                <h4
                  className={`text-lg font-bold flex flex-wrap items-center gap-2 ${
                    task.completed ? 'text-green-700 line-through' : 'text-indigo-700'
                  }`}
                >
                  {task.title}
                  <span
                    className={`ml-2 px-2 py-0.5 text-xs rounded-full font-semibold shadow-sm ${badgeColors[task.priority]}`}
                  >
                    {task.priority}
                  </span>
                  <span
                    className={`ml-2 px-2 py-0.5 text-xs rounded-full font-semibold shadow-sm ${categoryColors[task.category || 'Others']}`}
                  >
                    {task.category || 'Others'}
                  </span>
                </h4>
                <p className="text-gray-700 text-sm mt-1">{task.description}</p>
                <p
                  className={`text-xs mt-2 ${
                    new Date(task.dueDate) < new Date().setHours(0, 0, 0, 0)
                      ? 'text-red-600 font-semibold'
                      : 'text-gray-400'
                  }`}
                >
                  Due: {task.dueDate ? task.dueDate.substring(0, 10) : 'N/A'}
                  {new Date(task.dueDate) < new Date().setHours(0, 0, 0, 0) && ' (Past Due)'}
                </p>
              </div>
              <div className="flex flex-col gap-2 mt-1 sm:flex-row sm:items-center">
                <button
                  onClick={() => handleEdit(task)}
                  className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-lg text-xs font-semibold transition shadow"
                  aria-label={`Edit task ${task.title}`}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(task._id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-xs font-semibold transition shadow"
                  aria-label={`Delete task ${task.title}`}
                >
                  Delete
                </button>
                <button
                  onClick={() => handleToggleComplete(task._id, task.completed)}
                  className={`${
                    task.completed
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-gray-400 hover:bg-gray-500'
                  } text-white px-3 py-1 rounded-lg text-xs font-semibold transition shadow`}
                  aria-label={`Mark task ${task.title} as ${
                    task.completed ? 'Pending' : 'Completed'
                  }`}
                >
                  {task.completed ? 'Mark as Pending' : 'Mark as Completed'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );

  return (
    <div
      className="min-h-screen bg-gradient-to-tr from-blue-50 via-slate-100 to-indigo-50 flex flex-col"
      style={{
        backgroundImage:
          "url('https://wallpaperbat.com/img/918872-project-manager-wallpaper.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Header */}
      <header
        className="w-full shadow-md py-8 mb-2 height-24"
        style={{ backgroundColor: 'grey' }}
      >
        <div className="max-w-4xl mx-auto flex justify-between items-center px-4">
          {/* Logo and Title */}
          <div className="flex items-center gap-3">
            <img src={logo} alt="Logo" className="h-20 w-23 object-cover" />
            <h1 className="text-5xl font-extrabold" style={{ color: 'black' }}>
              TaskPilot
            </h1>
          </div>
          {/* User Info + Logout */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <img
                src={
                  user.avatarUrl ||
                  'https://randomuser.me/api/portraits/lego/1.jpg'
                }
                alt="User Profile"
                className="h-12 w-12 rounded-full object-cover border-2 border-indigo-600"
              />
              <span className="font-semibold text-black text-lg">
                {user.name || 'Guest User'}
              </span>
            </div>
            <button
              className="bg-gradient-to-r from-gray-700 to-gray-700 text-white font-semibold py-2 px-4 rounded-lg shadow hover:from-gray-800 hover:to-gray-600 transition-all duration-200"
              onClick={handleLogout}
              type="button"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Search Bar */}
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {/* Main content */}
      <main className="flex-grow max-w-6xl mx-auto px-4 flex flex-col gap-8 mb-12">
        {/* Add/Update Task Form at top */}
        <section className="w-full bg-white bg-opacity-95 rounded-2xl shadow-xl p-6">
          <h2 className="text-2xl font-bold mb-4 text-center text-indigo-700">
            {editingTaskId ? 'Update Task' : 'Add New Task'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Title"
              required
              className="w-full px-3 py-2 border border-blue-200 rounded-lg"
              autoComplete="off"
            />
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description"
              rows="3"
              required
              className="w-full px-3 py-2 border border-blue-200 rounded-lg"
            />
            <div className="flex flex-col gap-4 md:flex-row">
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                min={today}
                onChange={handleChange}
                className="flex-1 px-3 py-2 border border-blue-200 rounded-lg"
              />
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="flex-1 px-3 py-2 border border-blue-200 rounded-lg"
                required
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="flex-1 px-3 py-2 border border-blue-200 rounded-lg"
                required
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-2 px-4 rounded-lg"
            >
              {editingTaskId ? 'Update Task' : 'Add Task'}
            </button>
          </form>
        </section>

        {/* Pending Tasks container */}
        <section className="w-full bg-white bg-opacity-95 rounded-2xl shadow-lg p-6 min-h-[340px]">
          <h3 className="text-xl font-bold mb-4 text-indigo-700 flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-yellow-400 inline-block"></span>
            Pending Tasks
          </h3>
          {renderTasks(pendingTasks)}
        </section>

        {/* Completed Tasks container */}
        <section className="w-full bg-white bg-opacity-95 rounded-2xl shadow-lg p-6 min-h-[340px]">
          <h3 className="text-xl font-bold mb-4 text-green-700 flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-green-400 inline-block"></span>
            Completed Tasks
          </h3>
          {renderTasks(completedTasks)}
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
