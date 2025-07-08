import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const backendURL = import.meta.env.VITE_BACKEND_URL;

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const res = await axios.post(`${backendURL}/api/register`, {
        username,
        password,
      });

      alert('注册成功，请前往登录');
      navigate('/login');
    } catch (error) {
      console.error('注册失败：', error);
      alert('注册失败，请检查控制台或尝试其他用户名');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">注册</h1>

        <div className="mb-4">
          <label className="block mb-1">用户名</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:border-blue-300"
            placeholder="请输入用户名"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1">密码</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:border-blue-300"
            placeholder="请输入密码"
          />
        </div>

        <button
          onClick={handleRegister}
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
        >
          注册
        </button>
      </div>
    </div>
  );
}

export default RegisterPage;
