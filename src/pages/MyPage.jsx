import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function MyPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      // 未登录，跳转到登录页
      navigate('/login');
    }
    // 若已登录，可在这里加载用户信息
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen text-xl">
      <p>👤 欢迎回来，用户 {localStorage.getItem('userId')}</p>
    </div>
  );
}
