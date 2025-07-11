import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import BottomTabBar from '../components/BottomTabBar';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const res = await axios.post('/api/auth/register', { username, password });
      localStorage.setItem('userId', res.data.userId);
      navigate('/my');
    } catch (err) {
      setMessage(err.response?.data?.error || '注册失败');
    }
  };

  return (
    <div className="flex flex-col min-h-screen pb-16">
      <div className="flex flex-col items-center justify-center flex-1 gap-4 p-4">
        <h1 className="text-2xl font-bold">注册</h1>
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
          onClick={handleRegister}
          className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
        >
          注册
        </button>
        {message && <p className="text-red-500">{message}</p>}
      </div>

      <BottomTabBar />
    </div>
  );
}
