import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const errors = {};
    const emailRegex =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // General RFC 5322-style email validation

    if (!emailRegex.test(email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    }

    // Optional: stricter password policy
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&()#^])[A-Za-z\d@$!%*?&()#^]{6,}$/;

    if (!strongPasswordRegex.test(password)) {
      errors.password =
        'Password must include at least one uppercase letter, one lowercase letter, one number, and one special character';
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });
      localStorage.setItem('token', res.data.token);
      navigate('/');
    } catch (err) {
      alert('Login failed: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Image Side */}
      <div className="md:w-1/2 w-full h-64 md:h-auto">
        <img
          src="https://images.unsplash.com/photo-1586473219010-2ffc57b0d282?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8dGFzayUyMG1hbmFnZW1lbnR8ZW58MHx8MHx8fDA%3D"
          alt="Login Visual"
          className="object-cover w-full h-full"
        />
      </div>

      {/* Login Form Side */}
      <div className="md:w-1/2 w-full flex items-center justify-center bg-gray-300">
        <form
          className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
          onSubmit={handleSubmit}
        >
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
            Welcome To TaskPilot
          </h2>

          {/* Email */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              autoComplete="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-md hover:from-gray-700 hover:to-gray-500 transition-all duration-200 shadow"
          >
            Login
          </button>

          <p className="mt-4 text-sm text-center text-gray-600">
            Don&apos;t have an account?{' '}
            <a href="/register" className="text-blue-700 underline">
              Register
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
