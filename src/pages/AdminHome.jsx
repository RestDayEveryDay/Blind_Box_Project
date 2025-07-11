import React from 'react';
import { useNavigate } from 'react-router-dom';
import BottomTabBar from '../components/BottomTabBar';

export default function AdminHome() {
  const navigate = useNavigate();

  const handleBoxManage = () => navigate('/admin/boxes');
  const handleOrderManage = () => navigate('/admin/orders');
  const handleLogout = () => {
    localStorage.removeItem('userId');
    window.location.href = '/login';
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-screen p-6 pb-20">
      <div className="flex flex-col items-center gap-6">
        <h1 className="text-2xl font-bold">🛠 管理员中心</h1>

        <button
          onClick={handleBoxManage}
          className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600"
        >
          📦 盲盒管理
        </button>

        <button
          onClick={handleOrderManage}
          className="bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600"
        >
          📄 订单管理
        </button>

        <button
          onClick={handleLogout}
          className="text-red-500 underline mt-4"
        >
          退出登录
        </button>
      </div>

      <BottomTabBar />
    </div>
  );
}
