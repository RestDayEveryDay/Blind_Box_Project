import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BottomTabBar from '../components/BottomTabBar';
import { getImageUrlWithFallback } from '../utils/imageUtils';

// 移除硬编码的baseURL，使用Vite代理
// axios.defaults.baseURL = 'http://localhost:3001';

export default function MyPage() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [myMoments, setMyMoments] = useState([]);
  const [orderStats, setOrderStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [luckyItems, setLuckyItems] = useState([]);
  const [loading] = useState(false);
  const [username, setUsername] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const storedId = localStorage.getItem('userId');
    const storedUsername = localStorage.getItem('username') || `用户${storedId}`;
    
    if (!storedId) {
      navigate('/login');
    } else {
      setUserId(storedId);
      setUsername(storedUsername);
      
      if (storedId === '1') {
        setIsAdmin(true);
        navigate('/admin');
      } else {
        // 获取我的数据
        fetchMyMoments(storedId);
        fetchOrderStats(storedId);
        fetchRecentOrders(storedId);
        fetchLuckyItems(storedId);
      }
    }
  }, [navigate]);

  const fetchMyMoments = async (userId) => {
    try {
      const res = await axios.get(`/api/moments/user/${userId}`);
      setMyMoments(res.data.moments || []);
      setErrors(prev => ({ ...prev, moments: null }));
    } catch (err) {
      console.error('❗ 获取我的动态失败:', err);
      setErrors(prev => ({ ...prev, moments: '获取动态失败' }));
    }
  };

  const fetchOrderStats = async (userId) => {
    try {
      const res = await axios.get(`/api/orders/stats/${userId}`);
      setOrderStats(res.data.stats);
      setErrors(prev => ({ ...prev, stats: null }));
    } catch (err) {
      console.error('❗ 获取订单统计失败:', err);
      setErrors(prev => ({ ...prev, stats: '获取统计失败' }));
      // 设置默认值
      setOrderStats({
        basic: { totalOrders: 0, uniqueBoxes: 0 },
        rarity: [],
        recent: []
      });
    }
  };

  const fetchRecentOrders = async (userId) => {
    try {
      const res = await axios.get(`/api/orders/user/${userId}`);
      setRecentOrders(res.data.orders.slice(0, 5));
      setErrors(prev => ({ ...prev, orders: null }));
    } catch (err) {
      console.error('❗ 获取最近订单失败:', err);
      setErrors(prev => ({ ...prev, orders: '获取订单失败' }));
    }
  };

  const fetchLuckyItems = async (userId) => {
    try {
      const res = await axios.get(`/api/orders/lucky/${userId}`);
      setLuckyItems(res.data.luckyItems || []);
      setErrors(prev => ({ ...prev, lucky: null }));
    } catch (err) {
      console.error('❗ 获取幸运物品失败:', err);
      setErrors(prev => ({ ...prev, lucky: '获取幸运物品失败' }));
    }
  };

  const handleDeleteMoment = async (momentId) => {
    if (!confirm('确定要删除这条动态吗？')) {
      return;
    }

    try {
      await axios.delete(`/api/moments/delete/${momentId}`, {
        data: { user_id: parseInt(userId) }
      });
      
      alert('删除成功');
      await fetchMyMoments(userId);
    } catch (err) {
      console.error('❗ 删除失败:', err);
      const errorMessage = err.response?.data?.error || '删除失败';
      alert(errorMessage);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    navigate('/login');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN') + ' ' + date.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRarityColor = (rarity) => {
    const colors = {
      'legendary': 'text-yellow-600 bg-yellow-100',
      'epic': 'text-purple-600 bg-purple-100',
      'rare': 'text-blue-600 bg-blue-100',
      'common': 'text-gray-600 bg-gray-100'
    };
    return colors[rarity] || 'text-gray-600 bg-gray-100';
  };

  const getRarityName = (rarity) => {
    const names = {
      'legendary': '传说',
      'epic': '史诗',
      'rare': '稀有',
      'common': '普通'
    };
    return names[rarity] || rarity;
  };

  if (!userId || isAdmin) return null;

  return (
    <div className="flex flex-col min-h-screen pb-20 bg-gray-50">
      <div className="p-4 space-y-4">
        {/* 用户信息头部 */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h1 className="text-xl font-bold text-center">👋 欢迎回来</h1>
          <p className="text-center text-gray-600 mt-1">{username}</p>
          <div className="flex justify-center mt-3 space-x-4 text-sm text-gray-500">
            <span>用户ID: {userId}</span>
            <span>动态: {myMoments.length}</span>
            <span>订单: {orderStats?.basic?.totalOrders || 0}</span>
          </div>
        </div>

        {/* 选项卡 */}
        <div className="bg-white rounded-lg shadow">
          <div className="flex border-b">
            <button
              className={`flex-1 py-3 text-center ${activeTab === 'overview' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
              onClick={() => setActiveTab('overview')}
            >
              📊 总览
            </button>
            <button
              className={`flex-1 py-3 text-center ${activeTab === 'orders' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
              onClick={() => setActiveTab('orders')}
            >
              🎁 盲盒
            </button>
            <button
              className={`flex-1 py-3 text-center ${activeTab === 'moments' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
              onClick={() => setActiveTab('moments')}
            >
              📸 动态
            </button>
          </div>

          <div className="p-4">
            {/* 总览选项卡 */}
            {activeTab === 'overview' && (
              <div className="space-y-4">
                {/* 快捷操作 */}
                <div>
                  <h3 className="font-semibold mb-3">⚡ 快捷操作</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => navigate('/moments')}
                      className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      📸 发布动态
                    </button>
                    <button
                      onClick={() => navigate('/')}
                      className="bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition-colors"
                    >
                      🎁 抽盲盒
                    </button>
                  </div>
                </div>

                {/* 统计卡片 */}
                {errors.stats ? (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-600">⚠️ {errors.stats}</p>
                    <button 
                      onClick={() => fetchOrderStats(userId)}
                      className="text-red-500 text-sm underline mt-2"
                    >
                      重试
                    </button>
                  </div>
                ) : orderStats && (
                  <div>
                    <h3 className="font-semibold mb-3">📈 我的统计</h3>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-blue-50 p-3 rounded-lg text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {orderStats.basic.totalOrders}
                        </div>
                        <div className="text-xs text-gray-600">总抽取次数</div>
                      </div>
                      <div className="bg-purple-50 p-3 rounded-lg text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {orderStats.basic.uniqueBoxes}
                        </div>
                        <div className="text-xs text-gray-600">不同盲盒</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 稀有度统计 */}
                {orderStats?.rarity?.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3">✨ 稀有度分布</h3>
                    <div className="space-y-2">
                      {orderStats.rarity.map((item) => (
                        <div key={item.rarity} className="flex items-center justify-between">
                          <span className={`px-2 py-1 rounded text-xs ${getRarityColor(item.rarity)}`}>
                            {getRarityName(item.rarity)}
                          </span>
                          <span className="text-sm font-medium">{item.count} 个</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 盲盒选项卡 */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                {errors.orders || errors.lucky ? (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-700">⚠️ 盲盒数据加载失败，可能是第一次使用</p>
                    <p className="text-sm text-yellow-600 mt-1">去抽一个盲盒试试吧！</p>
                    <button
                      onClick={() => navigate('/')}
                      className="mt-2 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                    >
                      立即抽盲盒
                    </button>
                  </div>
                ) : (
                  <>
                    {/* 幸运物品 */}
                    {luckyItems.length > 0 && (
                      <div>
                        <h3 className="font-semibold mb-3">🍀 我的幸运物品</h3>
                        <div className="space-y-2">
                          {luckyItems.slice(0, 3).map((item) => (
                            <div key={item.id} className="flex items-center space-x-3 p-2 bg-yellow-50 rounded-lg">
                              {item.item_image && (
                                <img 
                                  src={getImageUrlWithFallback(item.item_image)} 
                                  alt={item.item_name}
                                  className="w-12 h-12 rounded object-cover"
                                  onError={(e) => e.target.style.display = 'none'}
                                />
                              )}
                              <div className="flex-1">
                                <div className="font-medium text-sm">{item.item_name}</div>
                                <div className="text-xs text-gray-500">{item.box_name}</div>
                              </div>
                              <span className={`px-2 py-1 rounded text-xs ${getRarityColor(item.rarity)}`}>
                                {getRarityName(item.rarity)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 最近订单 */}
                    <div>
                      <h3 className="font-semibold mb-3">📦 最近抽取</h3>
                      {recentOrders.length === 0 ? (
                        <div className="text-center py-6 text-gray-500">
                          <p className="mb-3">还没有抽取记录</p>
                          <button
                            onClick={() => navigate('/')}
                            className="text-blue-500 hover:text-blue-700 underline"
                          >
                            去抽第一个盲盒 →
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {recentOrders.map((order) => (
                            <div key={order.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                              {order.item_image && (
                                <img 
                                  src={getImageUrlWithFallback(order.item_image)} 
                                  alt={order.item_name}
                                  className="w-10 h-10 rounded object-cover"
                                  onError={(e) => e.target.style.display = 'none'}
                                />
                              )}
                              <div className="flex-1">
                                <div className="font-medium text-sm">{order.item_name || '未知物品'}</div>
                                <div className="text-xs text-gray-500">
                                  {order.box_name} • {formatDate(order.created_at)}
                                </div>
                              </div>
                              {order.rarity && (
                                <span className={`px-2 py-1 rounded text-xs ${getRarityColor(order.rarity)}`}>
                                  {getRarityName(order.rarity)}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* 动态选项卡 */}
            {activeTab === 'moments' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">📸 我发布的帖子</h3>
                  <button 
                    onClick={() => fetchMyMoments(userId)}
                    className="text-blue-500 text-sm hover:text-blue-700"
                    disabled={loading}
                  >
                    {loading ? '刷新中...' : '刷新'}
                  </button>
                </div>

                {errors.moments ? (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-600">⚠️ {errors.moments}</p>
                    <button 
                      onClick={() => fetchMyMoments(userId)}
                      className="text-red-500 text-sm underline mt-2"
                    >
                      重试
                    </button>
                  </div>
                ) : myMoments.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-gray-500 mb-3">还没有发布任何动态</p>
                    <button
                      onClick={() => navigate('/moments')}
                      className="text-blue-500 hover:text-blue-700 underline"
                    >
                      去发布第一条动态 →
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {myMoments.map((moment) => (
                      <div key={moment.id} className="border border-gray-200 p-3 rounded-lg bg-gray-50">
                        <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-line">
                          {moment.content}
                        </p>
                        
                        {moment.imageUrl && (
                          <div className="mt-2">
                            <img
                              src={getImageUrlWithFallback(moment.imageUrl)}
                              alt="动态图片"
                              className="rounded-lg max-h-32 w-auto object-cover cursor-pointer hover:opacity-90 transition-opacity"
                              onError={(e) => e.target.style.display = 'none'}
                              onClick={() => window.open(getImageUrlWithFallback(moment.imageUrl), '_blank')}
                            />
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-gray-500 text-xs">{formatDate(moment.created_at)}</p>
                          <button
                            onClick={() => handleDeleteMoment(moment.id)}
                            className="text-red-500 text-xs hover:text-red-700 px-2 py-1 rounded"
                          >
                            删除
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 退出登录 */}
        <div className="bg-white p-4 rounded-lg shadow">
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition-colors font-medium"
          >
            🚪 退出登录
          </button>
        </div>
      </div>

      <BottomTabBar />
    </div>
  );
}