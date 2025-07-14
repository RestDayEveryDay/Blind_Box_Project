import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BottomTabBar from '../components/BottomTabBar';

const PAGE_SIZE = 10;

export default function AdminOrderPage() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get('/api/admin/orders');
        setOrders(res.data.orders);
        setFilteredOrders(res.data.orders);
      } catch (err) {
        console.error('获取订单失败', err);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    const lowerSearch = search.toLowerCase();
    const result = orders.filter(
      (order) =>
        order.username?.toLowerCase().includes(lowerSearch) ||
        order.box_name?.toLowerCase().includes(lowerSearch)
    );
    setFilteredOrders(result);
    setPage(1); // 重置到第一页
  }, [search, orders]);

  const totalPages = Math.ceil(filteredOrders.length / PAGE_SIZE);
  const currentPageOrders = filteredOrders.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  return (
    <div className="flex flex-col min-h-screen pb-20">
      <div className="p-6 space-y-4 flex-1">
        <h1 className="text-2xl font-bold">📄 所有用户订单</h1>

        <input
          type="text"
          placeholder="搜索用户名或盲盒名"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded w-full"
        />

        <ul className="space-y-3">
          {currentPageOrders.map((order) => (
            <li key={order.id} className="border p-3 rounded shadow">
              <p>
                🧍 用户 <strong>{order.username}</strong>
              </p>
              <p>
                📦 抽中盲盒 <strong>{order.box_name}</strong>
              </p>
              <p className="text-sm text-gray-600">🕒 时间 {order.timestamp}</p>
            </li>
          ))}
        </ul>

        {/* 分页按钮 */}
        <div className="flex justify-center gap-4 mt-4">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            上一页
          </button>
          <span>
            第 {page} / {totalPages} 页
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            下一页
          </button>
        </div>
      </div>

      <BottomTabBar />
    </div>
  );
}
