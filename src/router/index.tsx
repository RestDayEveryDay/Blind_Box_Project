// src/router/index.tsx
import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import BoxDetailPage from '../pages/BoxDetailPage';
import BoxListPage from '../pages/BoxListPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import OrderPage from '../pages/OrderPage';
import PlayerShowPage from '../pages/PlayerShowPage';
import SearchPage from '../pages/SearchPage';

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/box/:id" element={<BoxDetailPage />} />
      <Route path="/boxes" element={<BoxListPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/orders" element={<OrderPage />} />
      <Route path="/players" element={<PlayerShowPage />} />
      <Route path="/search" element={<SearchPage />} />
    </Routes>
  );
}
