import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BottomTabBar from '../components/BottomTabBar';
import ImageUpload from '../components/ImageUpload';
import { getImageUrlWithFallback, getPlaceholderImage } from '../utils/imageUtils';

export default function AdminBoxPage() {
  const [pools, setPools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPool, setSelectedPool] = useState(null);
  const [items, setItems] = useState([]);
  const [itemsLoading, setItemsLoading] = useState(false);
  
  // 新增系列相关状态
  const [newPool, setNewPool] = useState({
    name: '',
    description: '',
    imageUrl: ''
  });
  const [editingPoolId, setEditingPoolId] = useState(null);
  const [editPoolData, setEditPoolData] = useState({});
  
  // 物品管理相关状态
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    drop_rate: '',
    rarity: 'normal',
    imageUrl: ''
  });
  const [editingItemId, setEditingItemId] = useState(null);
  const [editItemData, setEditItemData] = useState({});

  const fetchPools = async () => {
    try {
      setError(null);
      const res = await axios.get('/api/admin/pools');
      setPools(res.data.pools || []);
    } catch (error) {
      console.error('获取盲盒系列失败:', error);
      const errorMsg = error.response?.data?.error || error.message;
      setError(`无法加载盲盒系列: ${errorMsg}`);
      setPools([]);
    }
  };

  const fetchItems = async (poolId) => {
    if (!poolId) return;
    
    try {
      setItemsLoading(true);
      const res = await axios.get(`/api/admin/pools/${poolId}/items`);
      setItems(res.data.items || []);
    } catch (error) {
      console.error('获取物品列表失败:', error);
      setItems([]);
    } finally {
      setItemsLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchPools();
      setLoading(false);
    };
    loadData();
  }, []);

  useEffect(() => {
    if (selectedPool) {
      fetchItems(selectedPool.id);
    }
  }, [selectedPool]);

  // 系列管理函数
  const handleAddPool = async () => {
    if (!newPool.name) {
      alert('系列名称不能为空');
      return;
    }

    try {
      await axios.post('/api/admin/pools', {
        name: newPool.name,
        description: newPool.description,
        imageUrl: newPool.imageUrl
      });
      setNewPool({ name: '', description: '', imageUrl: '' });
      fetchPools();
    } catch (err) {
      alert(err.response?.data?.error || '添加系列失败');
    }
  };

  const handleDeletePool = async (poolId) => {
    if (!confirm('确定要删除这个系列吗？这将删除系列下的所有物品！')) {
      return;
    }
    
    try {
      await axios.delete(`/api/admin/pools/${poolId}`);
      fetchPools();
      if (selectedPool && selectedPool.id === poolId) {
        setSelectedPool(null);
        setItems([]);
      }
    } catch (error) {
      console.error('删除系列失败:', error);
      alert('删除失败: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleTogglePoolStatus = async (poolId, currentStatus) => {
    try {
      await axios.put(`/api/admin/pools/${poolId}/status`, {
        is_active: currentStatus ? 0 : 1
      });
      fetchPools();
    } catch (error) {
      alert('更新状态失败: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleMovePool = async (poolId, direction) => {
    try {
      await axios.put(`/api/admin/pools/${poolId}/move`, { direction });
      fetchPools();
    } catch (error) {
      alert('调整顺序失败: ' + (error.response?.data?.error || error.message));
    }
  };

  // 物品管理函数
  const handleAddItem = async () => {
    if (!newItem.name || !newItem.drop_rate) {
      alert('物品名称和掉落率不能为空');
      return;
    }

    try {
      await axios.post(`/api/admin/pools/${selectedPool.id}/items`, {
        name: newItem.name,
        description: newItem.description,
        drop_rate: parseFloat(newItem.drop_rate),
        rarity: newItem.rarity,
        image_url: newItem.imageUrl
      });
      setNewItem({ name: '', description: '', drop_rate: '', rarity: 'normal', imageUrl: '' });
      fetchItems(selectedPool.id);
    } catch (err) {
      alert(err.response?.data?.error || '添加物品失败');
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!confirm('确定要删除这个物品吗？')) {
      return;
    }
    
    try {
      await axios.delete(`/api/admin/items/${itemId}`);
      fetchItems(selectedPool.id);
    } catch (error) {
      alert('删除失败: ' + (error.response?.data?.error || error.message));
    }
  };

  // 系列管理界面
  const renderPoolsManagement = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">📦 系列管理</h2>
        <button 
          onClick={() => setSelectedPool(null)}
          className="text-blue-500 text-sm"
        >
          返回系列列表
        </button>
      </div>

      {/* 添加新系列 */}
      <div className="bg-gray-50 p-4 rounded-lg space-y-3">
        <h3 className="font-semibold">添加新系列</h3>
        <input
          type="text"
          placeholder="系列名称（如：端庄的长公子）"
          className="border px-3 py-2 rounded w-full"
          value={newPool.name}
          onChange={(e) => setNewPool({ ...newPool, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="系列描述（可选）"
          className="border px-3 py-2 rounded w-full"
          value={newPool.description}
          onChange={(e) => setNewPool({ ...newPool, description: e.target.value })}
        />
        <ImageUpload
          type="pools"
          label="系列封面图片"
          currentImage={newPool.imageUrl}
          onSuccess={(url) => setNewPool({ ...newPool, imageUrl: url })}
        />
        <button
          onClick={handleAddPool}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          添加系列
        </button>
      </div>

      {/* 系列列表 */}
      <div className="space-y-3">
        {pools.map((pool, index) => (
          <div key={pool.id} className="border rounded-lg p-4 bg-white shadow">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h3 className="font-bold text-lg">{pool.name}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    pool.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {pool.is_active ? '首页显示' : '已隐藏'}
                  </span>
                </div>
                {pool.description && (
                  <p className="text-gray-600 text-sm mt-1">{pool.description}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  显示顺序: {pool.display_order || 0}
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                {/* 顺序调整 */}
                <div className="flex flex-col space-y-1">
                  <button
                    onClick={() => handleMovePool(pool.id, 'up')}
                    disabled={index === 0}
                    className="text-xs bg-gray-200 px-2 py-1 rounded disabled:opacity-50"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => handleMovePool(pool.id, 'down')}
                    disabled={index === pools.length - 1}
                    className="text-xs bg-gray-200 px-2 py-1 rounded disabled:opacity-50"
                  >
                    ↓
                  </button>
                </div>
                
                {/* 状态切换 */}
                <button
                  onClick={() => handleTogglePoolStatus(pool.id, pool.is_active)}
                  className={`px-3 py-1 rounded text-sm ${
                    pool.is_active 
                      ? 'bg-orange-500 text-white hover:bg-orange-600' 
                      : 'bg-green-500 text-white hover:bg-green-600'
                  }`}
                >
                  {pool.is_active ? '隐藏' : '显示'}
                </button>
                
                {/* 管理物品 */}
                <button
                  onClick={() => setSelectedPool(pool)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                >
                  管理物品
                </button>
                
                {/* 删除系列 */}
                <button
                  onClick={() => handleDeletePool(pool.id)}
                  className="text-red-500 hover:underline text-sm"
                >
                  删除
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // 物品管理界面
  const renderItemsManagement = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">🎁 物品管理</h2>
          <p className="text-gray-600 text-sm">系列：{selectedPool.name}</p>
        </div>
        <button 
          onClick={() => setSelectedPool(null)}
          className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 text-sm"
        >
          返回系列管理
        </button>
      </div>

      {/* 添加新物品 */}
      <div className="bg-gray-50 p-4 rounded-lg space-y-3">
        <h3 className="font-semibold">添加新物品</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="物品名称"
            className="border px-3 py-2 rounded"
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          />
          <select
            className="border px-3 py-2 rounded"
            value={newItem.rarity}
            onChange={(e) => setNewItem({ ...newItem, rarity: e.target.value })}
          >
            <option value="normal">普通款</option>
            <option value="hidden">隐藏款</option>
          </select>
        </div>
        <input
          type="text"
          placeholder="物品描述（可选）"
          className="border px-3 py-2 rounded w-full"
          value={newItem.description}
          onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
        />
        <input
          type="number"
          step="0.01"
          min="0"
          max="1"
          placeholder="掉落率（0-1之间，如0.9）"
          className="border px-3 py-2 rounded w-full"
          value={newItem.drop_rate}
          onChange={(e) => setNewItem({ ...newItem, drop_rate: e.target.value })}
        />
        <ImageUpload
          type="items"
          label="物品图片"
          currentImage={newItem.imageUrl}
          onSuccess={(url) => setNewItem({ ...newItem, imageUrl: url })}
        />
        <button
          onClick={handleAddItem}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          添加物品
        </button>
      </div>

      {/* 物品列表 */}
      {itemsLoading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-gray-600">加载物品中...</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="border rounded-lg p-3 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {/* 物品图片 */}
                  {item.image_url && (
                    <img
                      src={getImageUrlWithFallback(item.image_url)}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg border-2 border-gray-200"
                      onError={(e) => {
                        e.target.src = getPlaceholderImage.item64();
                      }}
                    />
                  )}
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-bold">{item.name}</h4>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        item.rarity === 'hidden' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {item.rarity === 'hidden' ? '隐藏款' : '普通款'}
                      </span>
                    </div>
                    {item.description && (
                      <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      掉落率: {(item.drop_rate * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="text-red-500 hover:underline text-sm"
                  >
                    删除
                  </button>
                </div>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>该系列暂无物品，快来添加第一个吧！</p>
            </div>
          )}
        </div>
      )}
    </div>
  );

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

      {/* 主要内容区域 */}
      {!loading && !error && (
        selectedPool ? renderItemsManagement() : renderPoolsManagement()
      )}

      <BottomTabBar />
    </div>
  );
}
