import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import BottomTabBar from '../components/BottomTabBar';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post('/api/auth/login', { username, password });

      // 保存用户信息
      localStorage.setItem('userId', res.data.userId);
      localStorage.setItem('role', res.data.role);

      if (res.data.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/my');
      }
    } catch (err) {
      setMessage(err.response?.data?.error || '登录失败');
    }
  };

  return (
    <div className="flex flex-col min-h-screen pb-16">
      <div className="flex flex-col items-center justify-center flex-1 gap-4 p-4">
        <h1 className="text-2xl font-bold">登录</h1>
        <input
          type="text"
          placeholder="用户名"
          className="border px-4 py-2 rounded w-64"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="密码"
          className="border px-4 py-2 rounded w-64"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleLogin}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        >
          登录
        </button>
        <p className="text-sm text-gray-600">
          还没有账号？<Link to="/register" className="text-blue-600 hover:underline">注册新账号</Link>
        </p>
        {message && <p className="text-red-500">{message}</p>}
      </div>

      <BottomTabBar />
    </div>
  );
}
