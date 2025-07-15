import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BottomTabBar from '../components/BottomTabBar';

// 配置 axios 基础URL
axios.defaults.baseURL = 'http://localhost:3001';

export default function LuckRankPage() {
  const [luckRanking, setLuckRanking] = useState([]);
  const [unluckRanking, setUnluckRanking] = useState([]);
  const [myRanking, setMyRanking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('luck'); // luck, unluck, stats
  const [rankingStats, setRankingStats] = useState(null);

  useEffect(() => {
    fetchRankings();
    fetchMyRanking();
    fetchRankingStats();
  }, []);

  const fetchRankings = async () => {
    try {
      setLoading(true);
      const [luckRes, unluckRes] = await Promise.all([
        axios.get('/api/rankings/luck'),
        axios.get('/api/rankings/unluck')
      ]);
      
      setLuckRanking(luckRes.data.rankings || []);
      setUnluckRanking(unluckRes.data.rankings || []);
    } catch (err) {
      console.error('获取排名失败:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyRanking = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) return;

      const res = await axios.get(`/api/rankings/my-rank/${userId}`);
      setMyRanking(res.data.ranking);
    } catch (err) {
      console.error('获取我的排名失败:', err);
    }
  };

  const fetchRankingStats = async () => {
    try {
      const res = await axios.get('/api/rankings/stats');
      setRankingStats(res.data.stats);
    } catch (err) {
      console.error('获取排名统计失败:', err);
    }
  };

  const getLuckLevel = (score) => {
    if (score >= 80) return { level: '欧皇', color: 'text-yellow-600 bg-yellow-100', icon: '👑' };
    if (score >= 60) return { level: '欧洲人', color: 'text-blue-600 bg-blue-100', icon: '😊' };
    if (score >= 40) return { level: '平民', color: 'text-gray-600 bg-gray-100', icon: '😐' };
    if (score >= 20) return { level: '非洲人', color: 'text-orange-600 bg-orange-100', icon: '😭' };
    return { level: '非酋', color: 'text-red-600 bg-red-100', icon: '💀' };
  };

  const formatScore = (score) => {
    return Math.round(score * 10) / 10;
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  const currentUserId = parseInt(localStorage.getItem('userId'));

  return (
    <div className="min-h-screen pb-20 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      {/* 头部 */}
      <div className="bg-white shadow-sm">
        <div className="p-4 text-center">
          <h1 className="text-xl font-bold text-gray-800">🏆 欧非榜</h1>
          <p className="text-sm text-gray-600">看看谁是真正的欧皇和非酋</p>
        </div>
      </div>

      {/* 我的排名卡片 */}
      {myRanking && (
        <div className="p-4">
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold">我的运气</h3>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-2xl">{getLuckLevel(myRanking.luckScore).icon}</span>
                  <span className="font-medium">{getLuckLevel(myRanking.luckScore).level}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{formatScore(myRanking.luckScore)}</div>
                <div className="text-sm opacity-90">运气值</div>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="font-bold">{myRanking.luckRank || '-'}</div>
                <div className="text-xs opacity-90">欧皇榜</div>
              </div>
              <div>
                <div className="font-bold">{myRanking.unluckRank || '-'}</div>
                <div className="text-xs opacity-90">非酋榜</div>
              </div>
              <div>
                <div className="font-bold">{myRanking.totalOrders}</div>
                <div className="text-xs opacity-90">总抽取</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 选项卡 */}
      <div className="px-4 mb-4">
        <div className="bg-white rounded-lg shadow">
          <div className="flex">
            <button
              className={`flex-1 py-3 text-center ${activeTab === 'luck' ? 'bg-yellow-500 text-white' : 'text-gray-600 hover:bg-gray-50'} rounded-l-lg`}
              onClick={() => setActiveTab('luck')}
            >
              👑 欧皇榜
            </button>
            <button
              className={`flex-1 py-3 text-center ${activeTab === 'unluck' ? 'bg-red-500 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
              onClick={() => setActiveTab('unluck')}
            >
              💀 非酋榜
            </button>
            <button
              className={`flex-1 py-3 text-center ${activeTab === 'stats' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-50'} rounded-r-lg`}
              onClick={() => setActiveTab('stats')}
            >
              📊 统计
            </button>
          </div>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="px-4">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
            <p className="mt-4 text-gray-600">加载排名中...</p>
          </div>
        ) : (
          <>
            {/* 欧皇榜 */}
            {activeTab === 'luck' && (
              <div className="bg-white rounded-lg shadow">
                <div className="p-4 border-b border-gray-100">
                  <h3 className="font-bold text-gray-800 flex items-center">
                    👑 欧皇榜 - 运气爆棚的幸运儿
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    根据传说/史诗物品获得率排名
                  </p>
                </div>
                <div className="divide-y divide-gray-100">
                  {luckRanking.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      <div className="text-4xl mb-2">🎭</div>
                      <p>还没有人上榜呢</p>
                      <p className="text-sm">去抽盲盒争夺欧皇宝座吧！</p>
                    </div>
                  ) : (
                    luckRanking.map((user, index) => {
                      const luck = getLuckLevel(user.luckScore);
                      const isMe = user.user_id === currentUserId;
                      
                      return (
                        <div key={user.user_id} className={`p-4 flex items-center space-x-4 ${isMe ? 'bg-yellow-50' : ''}`}>
                          <div className="text-xl font-bold w-8 text-center">
                            {getRankIcon(index + 1)}
                          </div>
                          <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                            {user.username.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">{user.username}</span>
                              {isMe && <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">我</span>}
                            </div>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className={`px-2 py-1 rounded text-xs ${luck.color}`}>
                                {luck.icon} {luck.level}
                              </span>
                              <span className="text-xs text-gray-500">
                                {user.legendaryCount}传说 {user.epicCount}史诗
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-yellow-600">{formatScore(user.luckScore)}</div>
                            <div className="text-xs text-gray-500">{user.totalOrders}次抽取</div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {/* 非酋榜 */}
            {activeTab === 'unluck' && (
              <div className="bg-white rounded-lg shadow">
                <div className="p-4 border-b border-gray-100">
                  <h3 className="font-bold text-gray-800 flex items-center">
                    💀 非酋榜 - 运气不太好的勇士
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    根据抽取次数多但稀有物品少排名
                  </p>
                </div>
                <div className="divide-y divide-gray-100">
                  {unluckRanking.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      <div className="text-4xl mb-2">🍀</div>
                      <p>大家运气都不错！</p>
                      <p className="text-sm">没有非酋上榜</p>
                    </div>
                  ) : (
                    unluckRanking.map((user, index) => {
                      const luck = getLuckLevel(user.luckScore);
                      const isMe = user.user_id === currentUserId;
                      
                      return (
                        <div key={user.user_id} className={`p-4 flex items-center space-x-4 ${isMe ? 'bg-red-50' : ''}`}>
                          <div className="text-xl font-bold w-8 text-center">
                            {getRankIcon(index + 1)}
                          </div>
                          <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center text-white font-bold">
                            {user.username.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">{user.username}</span>
                              {isMe && <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">我</span>}
                            </div>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className={`px-2 py-1 rounded text-xs ${luck.color}`}>
                                {luck.icon} {luck.level}
                              </span>
                              <span className="text-xs text-gray-500">
                                {user.commonCount}普通 占{Math.round(user.commonCount / user.totalOrders * 100)}%
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-red-600">{formatScore(user.luckScore)}</div>
                            <div className="text-xs text-gray-500">{user.totalOrders}次抽取</div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {/* 统计页面 */}
            {activeTab === 'stats' && rankingStats && (
              <div className="space-y-4">
                {/* 全服统计 */}
                <div className="bg-white rounded-lg shadow p-4">
                  <h3 className="font-bold text-gray-800 mb-3">📊 全服统计</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{rankingStats.totalUsers}</div>
                      <div className="text-sm text-gray-600">总用户数</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{rankingStats.totalOrders}</div>
                      <div className="text-sm text-gray-600">总抽取次数</div>
                    </div>
                    <div className="text-center p-3 bg-yellow-50 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">{rankingStats.legendaryCount}</div>
                      <div className="text-sm text-gray-600">传说物品</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{rankingStats.epicCount}</div>
                      <div className="text-sm text-gray-600">史诗物品</div>
                    </div>
                  </div>
                </div>

                {/* 稀有度分布 */}
                <div className="bg-white rounded-lg shadow p-4">
                  <h3 className="font-bold text-gray-800 mb-3">🎯 稀有度分布</h3>
                  <div className="space-y-3">
                    {rankingStats.rarityDistribution?.map(item => (
                      <div key={item.rarity} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded text-xs ${
                            item.rarity === 'legendary' ? 'bg-yellow-100 text-yellow-600' :
                            item.rarity === 'epic' ? 'bg-purple-100 text-purple-600' :
                            item.rarity === 'rare' ? 'bg-blue-100 text-blue-600' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {item.rarity === 'legendary' ? '👑 传说' :
                             item.rarity === 'epic' ? '💜 史诗' :
                             item.rarity === 'rare' ? '💙 稀有' : '⚪ 普通'}
                          </span>
                          <span className="text-sm">{item.count} 个</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                item.rarity === 'legendary' ? 'bg-yellow-500' :
                                item.rarity === 'epic' ? 'bg-purple-500' :
                                item.rarity === 'rare' ? 'bg-blue-500' : 'bg-gray-500'
                              }`}
                              style={{ width: `${item.percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600">{item.percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 运气等级分布 */}
                <div className="bg-white rounded-lg shadow p-4">
                  <h3 className="font-bold text-gray-800 mb-3">🎭 运气等级分布</h3>
                  <div className="space-y-2">
                    {rankingStats.luckLevels?.map(level => (
                      <div key={level.level} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm">{level.icon} {level.level}</span>
                        <span className="text-sm font-medium">{level.count} 人</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <BottomTabBar />
    </div>
  );
}