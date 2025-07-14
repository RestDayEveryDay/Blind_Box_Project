import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import HomePage from './pages/HomePage';
import LoginPage from "./pages/LoginPage";
import RegisterPage from './pages/RegisterPage';
import MyPage from './pages/MyPage';
import AdminHome from './pages/AdminHome';
import AdminBoxPage from './pages/AdminBoxPage';
import AdminOrderPage from './pages/AdminOrderPage';
import MomentsPage from './pages/MomentsPage';
import BoxDetailPage from './pages/BoxDetailPage'; // 新增

// 保护路由组件
const ProtectedRoute = ({ children }) => {
  const userId = localStorage.getItem('userId');
  
  if (!userId) {
    // 如果未登录，重定向到登录页
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// 管理员路由保护
const AdminRoute = ({ children }) => {
  const userId = localStorage.getItem('userId');
  const userRole = localStorage.getItem('userRole'); // 假设你存储了用户角色
  
  if (!userId) {
    return <Navigate to="/login" replace />;
  }
  
  if (userRole !== 'admin' && userId !== '1') { // 添加用户ID为1的管理员判断
    return <Navigate to="/" replace />;
  }
  
  return children;
};

function App() {
  return (
    <div className="App">
      <Routes>
        {/* 公开路由 */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* 盲盒详情页面 - 公开访问 */}
        <Route path="/box-detail/:poolId" element={<BoxDetailPage />} />
        
        {/* 需要登录的路由 */}
        <Route 
          path="/my" 
          element={
            <ProtectedRoute>
              <MyPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/moments" 
          element={
            <ProtectedRoute>
              <MomentsPage />
            </ProtectedRoute>
          } 
        />
        
        {/* 管理员路由 */}
        <Route 
          path="/admin" 
          element={
            <AdminRoute>
              <AdminHome />
            </AdminRoute>
          } 
        />
        <Route 
          path="/admin/boxes" 
          element={
            <AdminRoute>
              <AdminBoxPage />
            </AdminRoute>
          } 
        />
        <Route 
          path="/admin/orders" 
          element={
            <AdminRoute>
              <AdminOrderPage />
            </AdminRoute>
          } 
        />
        
        {/* 404 页面 */}
        <Route 
          path="*" 
          element={
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
                <p className="text-gray-600 mb-4">页面不存在</p>
                <a 
                  href="/" 
                  className="text-blue-500 hover:text-blue-700 underline"
                >
                  返回首页
                </a>
              </div>
            </div>
          } 
        />
      </Routes>
    </div>
  );
}

export default App;