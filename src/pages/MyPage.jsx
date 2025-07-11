import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomTabBar from '../components/BottomTabBar';

export default function MyPage() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const storedId = localStorage.getItem('userId');
    if (!storedId) {
      navigate('/login');
    } else {
      setUserId(storedId);
      if (storedId === '1') {
        // 账号ID为1的为管理员
        setIsAdmin(true);
        navigate('/admin'); // ✅ 自动跳转管理员页面
      }
    }
  }, [navigate]);

  if (!userId || isAdmin) return null; // 页面跳转中，不渲染内容

  return (
    <div className="flex flex-col min-h-screen pb-20">
      <div className="flex flex-col items-center justify-center flex-1 gap-6 p-6">
        <h1 className="text-xl font-bold">👋 欢迎回来，用户 {userId}</h1>

        <div className="text-left w-full space-y-4">
          <div className="border p-4 rounded shadow">
            <h2 className="font-semibold mb-2">🧾 我的订单</h2>
            <p>（此处将显示用户抽盒记录）</p>
          </div>

          <div className="border p-4 rounded shadow">
            <h2 className="font-semibold mb-2">📸 我发布的帖子</h2>
            <p>（此处将展示我发的动态）</p>
          </div>
        </div>
      </div>

      <BottomTabBar />
    </div>
  );
}
