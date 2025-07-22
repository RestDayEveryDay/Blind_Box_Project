import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BottomTabBar from '../components/BottomTabBar';

export default function AdminBoxPage() {
  const [boxes, setBoxes] = useState([]);
  const [pools, setPools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newBox, setNewBox] = useState({
    name: '',
    description: '',
    probability: '',
    pool_id: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const fetchBoxes = async () => {
    try {
      setError(null);
      const res = await axios.get('/api/admin/boxes');
      setBoxes(res.data.boxes || []);
    } catch (error) {
      console.error('获取盲盒列表失败:', error);
      const errorMsg = error.response?.data?.error || error.message;
      setError(`无法加载盲盒列表: ${errorMsg}`);
      setBoxes([]);
    }
  };

  const fetchPools = async () => {
    try {
      const res = await axios.get('/api/admin/pools');
      setPools(res.data.pools || []);
    } catch (error) {
      console.error('获取盲盒池列表失败:', error);
      const errorMsg = error.response?.data?.error || error.message;
      setError(`无法加载盲盒池列表: ${errorMsg}`);
      setPools([]);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchBoxes(), fetchPools()]);
      setLoading(false);
    };
    loadData();
  }, []);

  const handleAdd = async () => {
    if (!newBox.name || !newBox.probability || !newBox.pool_id) {
      alert('名称、概率、盲盒池不能为空');
      return;
    }

    try {
      await axios.post('/api/admin/boxes', {
        name: newBox.name,
        description: newBox.description,
        probability: parseFloat(newBox.probability),
        pool_id: parseInt(newBox.pool_id),
      });
      setNewBox({ name: '', description: '', probability: '', pool_id: '' });
      fetchBoxes();
    } catch (err) {
      alert(err.response?.data?.error || '添加失败');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('确定要删除这个盲盒吗？')) {
      return;
    }
    
    try {
      await axios.delete(`/api/admin/boxes/${id}`);
      fetchBoxes();
    } catch (error) {
      console.error('删除盲盒失败:', error);
      alert('删除失败: ' + (error.response?.data?.error || error.message));
    }
  };

  const startEditing = (box) => {
    setEditingId(box.id);
    setEditData({ ...box });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`/api/admin/boxes/${editingId}`, {
        ...editData,
        probability: parseFloat(editData.probability),
        pool_id: parseInt(editData.pool_id),
      });
      setEditingId(null);
      setEditData({});
      fetchBoxes();
    } catch (err) {
      alert(err.response?.data?.error || '修改失败');
    }
  };

  return (
    <div className="p-6 pb-20 space-y-4">
      <h1 className="text-2xl font-bold">📦 盲盒管理</h1>

      {/* 错误提示 */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">⚠️ 数据加载失败</p>
          <p>{error}</p>
          <button 
            onClick={() => {
              setError(null);
              fetchBoxes();
              fetchPools();
            }}
            className="mt-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            重试
          </button>
        </div>
      )}

      {/* 加载中 */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-gray-600">加载中...</p>
        </div>
      )}

      {/* 添加区域 */}
      {!loading && !error && (
        <div className="space-y-2 border-b pb-4">
        <input
          type="text"
          placeholder="盲盒名称"
          className="border px-3 py-2 rounded w-full"
          value={newBox.name}
          onChange={(e) => setNewBox({ ...newBox, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="盲盒描述（可选）"
          className="border px-3 py-2 rounded w-full"
          value={newBox.description}
          onChange={(e) => setNewBox({ ...newBox, description: e.target.value })}
        />
        <input
          type="number"
          step="0.01"
          placeholder="概率（例如 0.25）"
          className="border px-3 py-2 rounded w-full"
          value={newBox.probability}
          onChange={(e) => setNewBox({ ...newBox, probability: e.target.value })}
        />
        <select
          className="border px-3 py-2 rounded w-full"
          value={newBox.pool_id}
          onChange={(e) => setNewBox({ ...newBox, pool_id: e.target.value })}
        >
          <option value="">选择所属盲盒池</option>
          {pools.map((pool) => (
            <option key={pool.id} value={pool.id}>
              {pool.name}
            </option>
          ))}
        </select>
        <button
          onClick={handleAdd}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          添加盲盒
        </button>
        </div>
      )}

      {/* 展示区域 */}
      {!loading && !error && (
        <ul className="space-y-3">
        {boxes.map((box) => (
          <li key={box.id} className="border p-3 rounded space-y-1">
            {editingId === box.id ? (
              <div className="space-y-1">
                <input
                  type="text"
                  className="border px-2 py-1 rounded w-full"
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                />
                <input
                  type="text"
                  className="border px-2 py-1 rounded w-full"
                  value={editData.description}
                  onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                />
                <input
                  type="number"
                  step="0.01"
                  className="border px-2 py-1 rounded w-full"
                  value={editData.probability}
                  onChange={(e) => setEditData({ ...editData, probability: e.target.value })}
                />
                <select
                  className="border px-2 py-1 rounded w-full"
                  value={editData.pool_id}
                  onChange={(e) => setEditData({ ...editData, pool_id: e.target.value })}
                >
                  {pools.map((pool) => (
                    <option key={pool.id} value={pool.id}>
                      {pool.name}
                    </option>
                  ))}
                </select>
                <div className="flex gap-2">
                  <button
                    onClick={handleUpdate}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  >
                    保存
                  </button>
                  <button
                    onClick={cancelEditing}
                    className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                  >
                    取消
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold">{box.name}</p>
                  <p className="text-sm text-gray-600">{box.description}</p>
                  <p className="text-sm text-gray-500">
                    概率: {box.probability} / 池ID: {box.pool_id}
                  </p>
                </div>
                <div className="space-x-2">
                  <button
                    className="text-blue-600 hover:underline"
                    onClick={() => startEditing(box)}
                  >
                    编辑
                  </button>
                  <button
                    className="text-red-500 hover:underline"
                    onClick={() => handleDelete(box.id)}
                  >
                    删除
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
        </ul>
      )}

      {/* ✅ 添加通用底部导航 */}
      <BottomTabBar />
    </div>
  );
}
