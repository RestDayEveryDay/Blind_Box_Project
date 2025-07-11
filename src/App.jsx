import React from 'react';
import { Routes, Route } from 'react-router-dom';

import NavBar from './components/SearchBar'; // 确保路径正确
import HomePage from './pages/HomePage';
import LoginPage from "./pages/LoginPage";
import RegisterPage from './pages/RegisterPage';
import MyPage from './pages/MyPage';
import AdminHome from './pages/AdminHome';
import AdminBoxPage from './pages/AdminBoxPage';


// 后续可加入其他页面组件
// import BoxesPage from './pages/BoxesPage';
// import OrdersPage from './pages/OrdersPage';

function App() {
  return (
    <>
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/my" element={<MyPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminHome />} />
        <Route path="/admin/boxes" element={<AdminBoxPage />} />
        {/* 后续页面 */}
        {/* <Route path="/boxes" element={<BoxesPage />} /> */}
        {/* <Route path="/orders" element={<OrdersPage />} /> */}
      </Routes>
    </>
  );
}

export default App;
