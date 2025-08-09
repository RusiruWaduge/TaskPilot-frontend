import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "../src/assets/logo.jpg"; 


const backgroundOverlayStyle = {
  position: "absolute",
  content: "''",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundImage:
    "url('https://wallpaperbat.com/img/918872-project-manager-wallpaper.jpg')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  filter: "blur(4px)",
  opacity: 0.95,

};


const SearchBar = ({ searchQuery, setSearchQuery }) => (
  <div className="max-w-3xl mx-auto px-4 mb-6 relative z-10">
    <label htmlFor="task-search" className="sr-only">
      Search Tasks
    </label>
    <div className="relative text-black bg-white rounded-lg shadow-sm">
      <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
       
        <svg
          className="w-5 h-5 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16"
          />
        </svg>
      </span>
      <input
        type="search"
        id="task-search"
        placeholder="Search tasks..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="block w-full pl-10 pr-8 py-3 rounded-lg border border-gray-300 transition focus:border-indigo-800 focus:ring-2 focus:ring-indigo-400 focus:outline-none text-black placeholder-gray-800"
      />
    </div>
  </div>
);


const Footer = () => (
  <footer className="w-full bg-gray-100 bg-opacity-90 py-6 mt-auto border-t border-gray-200 z-10">
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between px-4">
      <div className="flex items-center gap-3 mb-3 md:mb-0">
        <img
          src={logo}
          alt="Logo"
          className="h-8 w-8 object-cover rounded-lg"
          draggable={false}
        />
        <span className="font-bold text-gray-900 text-lg tracking-wide">
          TaskPilot 
         
        </span>
        <span className=" text-gray-900  tracking-wide text-sm">
           "Master Your Tasks, Master Your Day"
          
        </span>
      </div>
      <div className="text-gray-700 text-sm text-center md:text-right">
        &copy; {new Date().getFullYear()} TaskPilot. All rights reserved.
        
      </div>
    </div>
  </footer>
);

function Dashboard() {

  const [tasks, setTasks] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    category: "Others",
    priority: "Low",
  });
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState({ name: "" });

  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];

  const categories = [
    "Work",
    "Personal",
    "Health",
    "Study",
    "Finance",
    "Errands",
    "Shopping",
    "Fitness",
    "Travel",
    "Project",
    "Meeting",
    "Others",
  ];

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      fetchUser();
    }
  
  }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch(
        "https://sparkling-rejoicing-production.up.railway.app/api/auth/me",
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } catch {
      navigate("/login");
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await axios.get(
        "https://sparkling-rejoicing-production.up.railway.app/api/tasks",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks(res.data);
    } catch {}
  };

  useEffect(() => {
    fetchTasks();
   
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.dueDate && formData.dueDate < today) {
      alert("Due date cannot be in the past.");
      return;
    }
    try {
      if (editingId) {
        await axios.put(
          `https://sparkling-rejoicing-production.up.railway.app/api/tasks/${editingId}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setEditingId(null);
      } else {
        await axios.post(
          "https://sparkling-rejoicing-production.up.railway.app/api/tasks",
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      setFormData({
        title: "",
        description: "",
        dueDate: "",
        category: "Others",
        priority: "Low",
      });
      fetchTasks();
    } catch {}
  };

  const handleEdit = (task) => {
    setFormData({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate ? task.dueDate.substring(0, 10) : "",
      category: task.category || "Others",
      priority: task.priority,
    });
    setEditingId(task._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete?")) return;
    try {
      await axios.delete(
        `https://sparkling-rejoicing-production.up.railway.app/api/tasks/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchTasks();
    } catch {}
  };

  const handleToggleComplete = async (id, completed) => {
    try {
      await axios.patch(
        `https://sparkling-rejoicing-production.up.railway.app/api/tasks/${id}/toggle`,
        { completed: !completed },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchTasks();
    } catch {}
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const badgeColors = {
    Low: "bg-green-100 text-green-800",
    Medium: "bg-yellow-100 text-yellow-800",
    High: "bg-red-100 text-red-700",
  };

  const categoryColors = {
    Work: "bg-blue-100 text-blue-800",
    Personal: "bg-pink-100 text-pink-700",
    Health: "bg-red-100 text-red-700",
    Study: "bg-purple-100 text-purple-800",
    Finance: "bg-yellow-100 text-yellow-800",
    Errands: "bg-gray-200 text-gray-800",
    Shopping: "bg-indigo-100 text-indigo-800",
    Fitness: "bg-green-100 text-green-800",
    Travel: "bg-teal-100 text-teal-800",
    Project: "bg-orange-100 text-orange-800",
    Meeting: "bg-cyan-100 text-cyan-700",
    Others: "bg-slate-100 text-slate-700",
  };

  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const completedTasks = filteredTasks.filter((t) => t.completed);
  const pendingTasks = filteredTasks.filter((t) => !t.completed);

  const renderTasks = (tasks) => {
    if (tasks.length === 0)
      return <p className="text-center text-gray-400 mt-10">No tasks found.</p>;

    return (
      
      <ul className="space-y-4">
        {tasks.map((task) => {
          const isCompleted = task.completed;
          return (
            
            <li
              key={task._id}
              className="bg-gradient-to-br from-white via-blue-50 to-slate-50 shadow rounded-xl p-4 border border-blue-100 flex justify-between items-start group"
            >
              <div>
                <h4
                  className={`text-lg font-bold flex flex-wrap items-center gap-2 ${
                    isCompleted ? "text-green-700 line-through" : "text-indigo-700"
                  }`}
                >
                  {task.title}
                  <span
                    className={`ml-2 px-2 py-0.5 text-xs rounded-full font-semibold shadow-sm ${
                      badgeColors[task.priority]
                    }`}
                  >
                    {task.priority}
                  </span>
                  <span
                    className={`ml-2 px-2 py-0.5 text-xs rounded-full font-semibold shadow-sm ${
                      categoryColors[task.category || "Others"]
                    }`}
                  >
                    {task.category || "Others"}
                  </span>
                  <br/>
                </h4>
                <p className="text-gray-700 text-sm mt-1">{task.description}</p>
                <p
                  className={`text-xs mt-2 ${
                    new Date(task.dueDate) < new Date().setHours(0, 0, 0, 0)
                      ? "text-red-600 font-semibold"
                      : "text-gray-400"
                  }`}
                  
                >
                  Due: {task.dueDate ? task.dueDate.substring(0, 10) : "N/A"}
                  {new Date(task.dueDate) < new Date().setHours(0, 0, 0, 0) &&
                    " (Past Due)"}
                </p>
              </div>
              <div className="flex flex-col gap-2 mt-1 sm:flex-row sm:items-center">
                <button
                  onClick={() => handleEdit(task)}
                  className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-lg text-xs font-semibold transition shadow flex items-center gap-1"
                  aria-label={`Edit task ${task.title}`}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.232 5.232l3.536 3.536M9 13l6.768-6.768a2 2 0 012.832 2.832L11.832 15.832A2 2 0 019 13"
                    />
                  </svg>
                  
                </button>
                <button
                  onClick={() => handleDelete(task._id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-xs font-semibold transition shadow flex items-center gap-1"
                  aria-label={`Delete task ${task.title}`}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  
                </button>
                <button
                  onClick={() => handleToggleComplete(task._id, task.completed)}
                  className={`flex items-center gap-1 ${
                    isCompleted
                      ? "bg-yellow-400 hover:bg-yellow-500"
                      : "bg-green-600 hover:bg-green-700"
                  } text-white px-3 py-1 rounded-lg text-xs font-semibold transition shadow`}
                  aria-label={`Mark task ${task.title} as ${
                    isCompleted ? "Pending" : "Completed"
                  }`}
                >
                  {isCompleted ? (
                    <>
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 7l-7 7-4-4"
                        />
                      </svg>
                    
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      
                    </>
                  )}
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div
      className="dashboard-bg bg-gradient-to-tr from-blue-50 via-slate-100 to-indigo-50 flex flex-col min-h-screen relative"
      style={{ minHeight: "100vh" }}
    >
      <div style={backgroundOverlayStyle} />
      
  
      <header className="w-full shadow-md bg-gray-300 bg-opacity-80 z-10 py-4 md:py-6 mb-6">
     <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center md:justify-between gap-4 md:gap-0">
     
     <div className="flex flex-col items-center md:flex-row md:items-center gap-2 md:gap-4 w-full md:w-auto">
      <img
        src={logo}
        alt="Logo"
        className="h-16 w-16 object-cover rounded-lg"
        draggable={false}
      />
      <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-wide text-center md:text-left">
        TaskPilot
        
      </h1>
      
    </div>

   
    <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto text-center md:text-left">
      <div className="flex items-center gap-3 justify-center md:justify-start w-full md:w-auto">
        <img
          src={user.avatarUrl || "https://randomuser.me/api/portraits/lego/1.jpg"}
          alt="Profile"
          className="h-12 w-12 rounded-full object-cover border-2 border-indigo-600"
          draggable={false}
        />
        <span className="font-semibold text-gray-900 text-lg truncate max-w-[160px]">
          {user.name || "Guest User"}
        </span>
      </div>
      <button
        className="bg-gradient-to-r from-gray-700 to-gray-700 text-white py-2 px-5 rounded-lg shadow hover:from-gray-800 hover:to-gray-600 transition-all duration-200 font-semibold w-full md:w-auto"
        onClick={handleLogout}
        type="button"
      >
        Logout
      </button>
    </div>
  </div>
</header>


      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <main className="flex-grow max-w-6xl mx-auto px-4 flex flex-col gap-8 mb-12 z-20">
        <section className="mx-auto w-full md:w-[550px] bg-white bg-opacity-95 rounded-2xl shadow-xl p-6 -mb-2 -mt-2">
          <h2 className="text-2xl font-bold mb-4 text-center text-indigo-700">
            {editingId ? "Update Task" : "Add New Task"}
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
              rows={3}
              required
              className="w-full px-3 py-2 border border-blue-200 rounded-lg"
            />
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                min={today}
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
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
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
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 px-4 rounded-lg font-bold"
            >
              {editingId ? "Update Task" : "Add Task"}
            </button>
          </form>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section className="bg-white bg-opacity-95 rounded-2xl shadow-lg p-6 min-h-[340px]">
            <h3 className="text-xl font-bold mb-4 text-indigo-700 flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-yellow-400 inline-block"></span>
              Pending Tasks
            </h3>
            {renderTasks(pendingTasks)}
          </section>
          <section className="bg-white bg-opacity-95 rounded-2xl shadow-lg p-6 min-h-[340px]">
            <h3 className="text-xl font-bold mb-4 text-green-700 flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-green-400 inline-block"></span>
              Completed Tasks
            </h3>
            {renderTasks(completedTasks)}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Dashboard;
