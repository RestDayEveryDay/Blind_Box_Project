import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import BottomTabBar from '../components/BottomTabBar';

// 配置 axios 基础URL
axios.defaults.baseURL = 'http://localhost:3001';

export default function BoxDetailPage() {
  const { poolId } = useParams();
  const navigate = useNavigate();
  const [pool, setPool] = useState(null);
  const [boxes, setBoxes] = useState([]);
  const [possibleItems, setPossibleItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [drawing, setDrawing] = useState(false);
  const [result, setResult] = useState(null);
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    fetchPoolDetail();
    fetchBoxes();
    fetchPossibleItems();
  }, [poolId]);

  const fetchPoolDetail = async () => {
    try {
      const res = await axios.get(`/api/pools`);
      const foundPool = res.data.pools.find(p => p.id === parseInt(poolId));
      setPool(foundPool);
    } catch (err) {
      console.error('获取盲盒池详情失败:', err);
    }
  };

  const fetchBoxes = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/admin/boxes`);
      const poolBoxes = res.data.boxes.filter(box => box.pool_id === parseInt(poolId));
      setBoxes(poolBoxes);
    } catch (err) {
      console.error('获取盲盒列表失败:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPossibleItems = async () => {
    try {
      // 获取这个盲盒池中所有可能的物品（用于展示概率）
      const res = await axios.get(`/api/admin/boxes`);
      const poolBoxes = res.data.boxes.filter(box => box.pool_id === parseInt(poolId));
      
      // 这里应该有获取物品的API，暂时用模拟数据
      const allItems = [];
      // 实际应该调用 /api/items/pool/:poolId 获取所有可能的物品
      setPossibleItems(allItems);
    } catch (err) {
      console.error('获取可能物品失败:', err);
    }
  };

  const handleDrawBox = async (box) => {
    const userId = localStorage.getItem('userId');
    
    if (!userId) {
      alert('请先登录');
      navigate('/login');
      return;
    }

    if (!confirm(`确定要抽取 ${box.name} 吗？\n价格：¥${box.price}\n\n⚠️ 注意：这是盲盒，你无法选择具体物品！`)) {
      return;
    }

    try {
      setDrawing(true);
      setShowAnimation(true);
      
      console.log('抽盒请求:', {
        user_id: parseInt(userId),
        box_id: box.id
      });

      // 模拟抽盒动画时间
      setTimeout(async () => {
        try {
          const res = await axios.post('/api/boxes/draw', {
            user_id: parseInt(userId),
            box_id: box.id
          });

          console.log('抽盒结果:', res.data);
          setResult(res.data);
          setShowAnimation(false);
          
          // 显示结果5秒后关闭
          setTimeout(() => {
            setResult(null);
          }, 5000);

        } catch (err) {
          console.error('抽盒失败:', err);
          setShowAnimation(false);
          const errorMessage = err.response?.data?.error || '抽盒失败，请稍后重试';
          alert(errorMessage);
        } finally {
          setDrawing(false);
        }
      }, 2000); // 2秒抽盒动画

    } catch (err) {
      setDrawing(false);
      setShowAnimation(false);
    }
  };

  const getRarityColor = (rarity) => {
    const colors = {
      'legendary': 'from-yellow-400 to-yellow-600',
      'epic': 'from-purple-400 to-purple-600',
      'rare': 'from-blue-400 to-blue-600',
      'common': 'from-gray-400 to-gray-600'
    };
    return colors[rarity] || 'from-gray-400 to-gray-600';
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

  const getRarityProbability = (rarity) => {
    const probabilities = {
      'legendary': '5%',
      'epic': '15%',
      'rare': '30%',
      'common': '50%'
    };
    return probabilities[rarity] || '未知';
  };

  if (!pool) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

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

      {/* 盲盒池信息 */}
      <div className="p-4">
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
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
                <span className="text-sm text-blue-600">🎁 {boxes.length} 种盲盒</span>
                <span className="text-sm text-green-600">💰 ¥{Math.min(...boxes.map(b => b.price))} 起</span>
                <span className="text-sm text-purple-600">🎲 随机抽取</span>
              </div>
            </div>
          </div>
        </div>

        {/* 概率说明 */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <h3 className="font-bold text-yellow-800 mb-2">📊 掉落概率说明</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="px-2 py-1 rounded text-xs bg-yellow-100 text-yellow-600">传说</span>
              <span className="text-yellow-700 font-medium">5%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="px-2 py-1 rounded text-xs bg-purple-100 text-purple-600">史诗</span>
              <span className="text-purple-700 font-medium">15%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-600">稀有</span>
              <span className="text-blue-700 font-medium">30%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-600">普通</span>
              <span className="text-gray-700 font-medium">50%</span>
            </div>
          </div>
          <p className="text-xs text-yellow-700 mt-2">
            ⚠️ 每次抽取都是独立随机的，概率仅供参考
          </p>
        </div>

        {/* 盲盒列表 */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-purple-800">🎁 神秘盲盒（随机抽取）</h3>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2 text-gray-600">加载盲盒中...</p>
            </div>
          ) : boxes.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">暂无可抽取的盲盒</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {boxes.map((box) => (
                <div key={box.id} className="bg-white rounded-lg shadow-md p-4 relative overflow-hidden">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <img 
                        src={box.image_url} 
                        alt={box.name}
                        className="w-16 h-16 rounded-lg object-cover"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/64x64?text=？';
                        }}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-30 rounded-lg flex items-center justify-center">
                        <span className="text-white text-2xl">？</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800">{box.name}</h4>
                      <p className="text-gray-600 text-sm mt-1">神秘盲盒，内含随机物品</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-lg font-bold text-green-600">¥{box.price}</span>
                        <button
                          onClick={() => handleDrawBox(box)}
                          disabled={drawing}
                          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                            drawing 
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transform hover:scale-105'
                          }`}
                        >
                          {drawing ? '抽取中...' : '🎲 神秘抽取'}
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* 神秘效果 */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400"></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 抽盒动画 */}
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

      {/* 抽盒结果弹窗 */}
      {result && !showAnimation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`bg-gradient-to-br ${getRarityColor(result.item?.rarity)} p-1 rounded-xl max-w-sm w-full animate-pulse`}>
            <div className="bg-white rounded-lg p-6 text-center">
              <h3 className="text-xl font-bold mb-4">🎉 恭喜获得</h3>
              
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