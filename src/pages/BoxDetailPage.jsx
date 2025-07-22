import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import BottomTabBar from '../components/BottomTabBar';

// 配置 axios 基础URL
axios.defaults.baseURL = 'http://localhost:3001';

export default function BoxDetailPage() {
  const { poolId } = useParams();
  const navigate = useNavigate();
  const [poolData, setPoolData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [drawing, setDrawing] = useState(false);
  const [result, setResult] = useState(null);
  const [showAnimation, setShowAnimation] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const fetchPoolPreview = useCallback(async () => {
    try {
      setLoading(true);
      console.log('📖 获取盲盒池预览:', poolId);
      
      const res = await axios.get(`/api/pools/${poolId}/preview`);
      console.log('✅ 获取预览成功:', res.data);
      
      setPoolData(res.data);
    } catch (err) {
      console.error('❗ 获取预览失败:', err);
      
      if (err.response?.status === 404) {
        alert('盲盒池不存在');
        navigate('/');
      } else {
        alert('加载失败，请稍后重试');
      }
    } finally {
      setLoading(false);
    }
  }, [poolId, navigate]);

  useEffect(() => {
    fetchPoolPreview();
    
    // 检测是否为管理员
    const userId = localStorage.getItem('userId');
    if (userId === '1') {
      setIsAdmin(true);
    }
  }, [fetchPoolPreview]);

  const handleDraw = async () => {
    const userId = localStorage.getItem('userId');
    
    if (!userId) {
      alert('请先登录');
      navigate('/login');
      return;
    }

    // 管理员不能抽盒
    if (isAdmin || userId === '1') {
      alert('管理员账号不能参与抽盒，请使用普通用户账号');
      return;
    }

    if (!confirm(`确定要抽取 ${poolData.pool.name} 吗？\n\n⚠️ 这是真正的盲盒抽取，结果完全随机！`)) {
      return;
    }

    try {
      setDrawing(true);
      setShowAnimation(true);
      
      console.log('🎲 开始抽取盲盒池:', {
        poolId,
        userId: parseInt(userId)
      });

      // 模拟抽取动画时间
      setTimeout(async () => {
        try {
          const res = await axios.post(`/api/pools/${poolId}/draw`, {
            user_id: parseInt(userId)
          });

          console.log('✅ 抽取成功:', res.data);
          setResult(res.data);
          setShowAnimation(false);
          
          // 显示结果5秒后关闭
          setTimeout(() => {
            setResult(null);
          }, 5000);

        } catch (err) {
          console.error('❗ 抽取失败:', err);
          setShowAnimation(false);
          const errorMessage = err.response?.data?.error || '抽取失败，请稍后重试';
          alert(errorMessage);
        } finally {
          setDrawing(false);
        }
      }, 2000); // 2秒抽取动画

    } catch {
      setDrawing(false);
      setShowAnimation(false);
    }
  };

  const getRarityColor = (rarity) => {
    const colors = {
      'hidden': 'from-yellow-400 to-yellow-600',
      'normal': 'from-blue-400 to-blue-600'
    };
    return colors[rarity] || 'from-gray-400 to-gray-600';
  };

  const getRarityName = (rarity) => {
    const names = {
      'hidden': '隐藏款',
      'normal': '普通款'
    };
    return names[rarity] || rarity;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  if (!poolData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">数据加载失败</p>
          <button onClick={() => navigate('/')} className="mt-4 text-blue-500 underline">
            返回首页
          </button>
        </div>
      </div>
    );
  }

  const { pool, preview } = poolData;

  return (
    <div className="min-h-screen pb-20 bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-100">
      {/* 头部导航 */}
      <div className="bg-white shadow-sm">
        <div className="flex items-center p-4">
          <button 
            onClick={() => navigate('/')}
            className="mr-3 text-gray-600 hover:text-gray-800"
          >
            ← 返回
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold">{pool.name}</h1>
            <p className="text-sm text-gray-600">{pool.description}</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* 盲盒池信息卡片 */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center space-x-4">
            <img 
              src={pool.image_url} 
              alt={pool.name}
              className="w-20 h-20 rounded-lg object-cover"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/80x80?text=盲盒';
              }}
            />
            <div className="flex-1">
              <h2 className="text-xl font-bold text-purple-800">{pool.name}</h2>
              <p className="text-gray-600 text-sm mt-1">{pool.description}</p>
              <div className="flex items-center mt-2 space-x-4">
                <span className="text-sm text-blue-600">🎁 {preview.totalItems} 个物品</span>
                <span className="text-sm text-yellow-600">⭐ {preview.hiddenProbability.toFixed(1)}% 隐藏款概率</span>
              </div>
            </div>
          </div>
        </div>

        {/* 大抽取按钮 */}
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <button
            onClick={handleDraw}
            disabled={drawing || isAdmin}
            className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all transform ${
              drawing || isAdmin
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 hover:scale-105 shadow-lg'
            }`}
          >
            {isAdmin ? '🛠 管理员账号' : drawing ? '🎲 抽取中...' : '🎁 开启盲盒'}
          </button>
          <p className="text-sm text-gray-500 mt-2">
            {isAdmin ? '管理员账号不能参与抽盒' : '点击抽取，获得随机物品！'}
          </p>
        </div>

        {/* 普通款预览 */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-lg font-bold text-gray-800 mb-4">👀 普通款预览</h3>
          <div className="grid grid-cols-3 gap-3">
            {preview.normalItems.map((item) => (
              <div key={item.id} className="bg-gray-50 rounded-lg p-3 text-center">
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-full h-16 object-cover rounded mb-2"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/64x64?text=物品';
                  }}
                />
                <h4 className="text-xs font-medium text-gray-800 line-clamp-1">
                  {item.name}
                </h4>
                <p className="text-xs text-gray-500 mt-1">
                  {(item.drop_rate * 100).toFixed(1)}%
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 隐藏款神秘区域 */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-md p-4 text-white">
          <h3 className="text-lg font-bold mb-4">🎭 神秘隐藏款</h3>
          <div className="grid grid-cols-1 gap-3">
            {preview.hiddenItems.map((item) => (
              <div key={item.id} className="bg-black bg-opacity-30 rounded-lg p-4 text-center">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center mb-3">
                  <span className="text-2xl">❓</span>
                </div>
                <h4 className="font-bold text-yellow-400">神秘隐藏款</h4>
                <p className="text-xs text-gray-300 mt-1">
                  {(item.drop_rate * 100).toFixed(1)}% 概率
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  ？？？ 等你来揭晓 ？？？
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 概率说明 */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-bold text-yellow-800 mb-2">📊 抽取概率说明</h3>
          <div className="space-y-2 text-sm text-yellow-700">
            <div className="flex justify-between">
              <span>普通款总概率</span>
              <span className="font-medium">{(100 - preview.hiddenProbability).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span>隐藏款概率</span>
              <span className="font-medium text-yellow-600">{preview.hiddenProbability.toFixed(1)}%</span>
            </div>
          </div>
          <p className="text-xs text-yellow-600 mt-3">
            ⚠️ 每次抽取都是独立随机的，概率仅供参考
          </p>
        </div>
      </div>

      {/* 抽取动画 */}
      {showAnimation && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="text-center">
            <div className="relative">
              <div className="w-32 h-32 mx-auto mb-6 relative">
                <div className="absolute inset-0 border-4 border-purple-300 rounded-full animate-spin"></div>
                <div className="absolute inset-2 border-4 border-pink-300 rounded-full animate-spin" style={{animationDirection: 'reverse'}}></div>
                <div className="absolute inset-4 border-4 border-blue-300 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl animate-bounce">🎁</span>
                </div>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">🎲 抽取中...</h3>
            <p className="text-white opacity-80">命运的齿轮正在转动</p>
            <div className="flex justify-center mt-4 space-x-2">
              <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
              <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
              <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
            </div>
          </div>
        </div>
      )}

      {/* 抽取结果弹窗 */}
      {result && !showAnimation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`bg-gradient-to-br ${getRarityColor(result.item?.rarity)} p-1 rounded-xl max-w-sm w-full ${result.isHidden ? 'animate-pulse' : ''}`}>
            <div className="bg-white rounded-lg p-6 text-center">
              <h3 className="text-xl font-bold mb-4">
                {result.isHidden ? '🎊 恭喜获得隐藏款！' : '✨ 获得新物品！'}
              </h3>
              
              {result.item?.image_url && (
                <img 
                  src={result.item.image_url} 
                  alt={result.item.name}
                  className="w-24 h-24 mx-auto rounded-lg object-cover mb-4 shadow-lg"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/96x96?text=物品';
                  }}
                />
              )}
              
              <h4 className="text-lg font-bold text-gray-800 mb-2">
                {result.item?.name || '神秘物品'}
              </h4>
              
              <p className="text-sm text-gray-600 mb-3">
                {result.item?.description}
              </p>
              
              {result.item?.rarity && (
                <span className={`inline-block px-3 py-1 rounded-full text-white text-sm font-medium bg-gradient-to-r ${getRarityColor(result.item.rarity)} shadow-lg`}>
                  ✨ {getRarityName(result.item.rarity)}
                </span>
              )}
              
              <p className="text-gray-600 text-sm mt-4">
                🎊 已自动保存到你的收藏
              </p>
              
              <div className="mt-4 text-xs text-gray-500">
                5秒后自动关闭
              </div>
            </div>
          </div>
        </div>
      )}

      <BottomTabBar />
    </div>
  );
}