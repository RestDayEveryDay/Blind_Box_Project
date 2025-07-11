import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BottomTabBar from '../components/BottomTabBar';

export default function AdminBoxPage() {
  const [boxes, setBoxes] = useState([]);
  const [pools, setPools] = useState([]);
  const [newBox, setNewBox] = useState({
    name: '',
    description: '',
    probability: '',
    pool_id: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const fetchBoxes = async () => {
    const res = await axios.get('/api/admin/boxes');
    setBoxes(res.data.boxes);
  };

  const fetchPools = async () => {
    const res = await axios.get('/api/admin/pools');
    setPools(res.data.pools);
  };

  useEffect(() => {
    fetchBoxes();
    fetchPools();
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
    await axios.delete(`/api/admin/boxes/${id}`);
    fetchBoxes();
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

      {/* 添加区域 */}
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

      {/* 展示区域 */}
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

      {/* ✅ 添加通用底部导航 */}
      <BottomTabBar />
    </div>
  );
}
