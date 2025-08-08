import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from './assets/logo.jpg'; // Adjust the path as necessary

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate(); // Hook for navigation

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const emailRegex =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&()#^])[A-Za-z\d@$!%*?&()#^]{6,}$/;

    const validationErrors = {};

    if (!form.name.trim()) {
      validationErrors.name = 'Name is required';
    }

    if (!emailRegex.test(form.email)) {
      validationErrors.email = 'Please enter a valid email address';
    }

    if (!strongPasswordRegex.test(form.password)) {
      validationErrors.password =
        'Password must be at least 6 characters and include uppercase, lowercase, number, and special character';
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const res = await axios.post('https://sparkling-rejoicing-production.up.railway.app/api/auth/register', form);
      toast.success(res.data.message || 'Registration successful!');

      // Navigate to login page after short delay to show toast
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      console.error('Registration error:', err);
      toast.error(
        'Registration failed: ' + (err.response?.data?.message || err.message)
      );
    }
  };

  return (
    <>
      <div className="min-h-screen flex flex-col md:flex-row">
        {/* Register Form Side */}
        <div className="md:w-1/2 w-full flex items-center justify-center bg-gray-300">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
            noValidate
          >
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <img
                src={logo}
                alt="TaskPilot Logo"
                className="h-20 w-auto object-contain"
                draggable={false}
              />
            </div>

            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
              Create Your TaskPilot Account
            </h2>

            {/* Name Field */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-1" htmlFor="name">
                Name
              </label>
              <input
                id="name"
                name="name"
                placeholder="Enter your name"
                value={form.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                autoComplete="name"
                required
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* Email Field */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-1" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                autoComplete="email"
                required
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="mb-6">
              <label className="block text-gray-700 mb-1" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Create a password"
                value={form.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                autoComplete="new-password"
                required
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-2 bg-gradient-to-r from-red-600 to-red-500 text-white font-semibold rounded-md hover:from-gray-700 hover:to-gray-500 transition-all duration-200 shadow"
            >
              Register
            </button>

            {/* Link to Login */}
            <p className="mt-4 text-sm text-center text-gray-600">
              Already have an account?{' '}
              <a href="/login" className="text-blue-700 underline">
                Login
              </a>
            </p>
          </form>
        </div>

        {/* Image Side */}
        <div className="md:w-1/2 w-full h-64 md:h-auto">
          <img
            src="https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dGFzayUyMG1hbmFnZW1lbnR8ZW58MHx8MHx8fDA%3D"
            alt="Register Visual"
            className="object-cover w-full h-full"
            style={{ opacity: 0.8 }}
          />
        </div>
      </div>

      {/* Toast Container for toastify */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </>
  );
};

export default Register;
