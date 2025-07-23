// src/pages/MomentsPage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BottomTabBar from '../components/BottomTabBar';

// 配置 axios 基础URL
axios.defaults.baseURL = 'http://localhost:3001';

export default function MomentsPage() {
  const [moments, setMoments] = useState([]);
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [posting, setPosting] = useState(false);

  const fetchMoments = async () => {
    try {
      setLoading(true);
      console.log('📖 正在获取动态列表...');
      
      const res = await axios.get('/api/moments');
      console.log('✅ 获取动态成功:', res.data);
      
      setMoments(res.data.moments || []);
    } catch (err) {
      console.error('❗ 获取动态失败:', err);
      console.error('错误详情:', err.response?.data);
      
      // 用户友好的错误提示
      if (err.response?.status === 404) {
        alert('API 端点不存在，请检查服务器是否正常运行');
      } else if (err.code === 'ERR_NETWORK') {
        alert('网络连接失败，请检查服务器是否启动');
      } else {
        alert('获取动态失败，请稍后重试');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePost = async () => {
    const userId = localStorage.getItem('userId');
    
    console.log('📝 准备发布动态...');
    console.log('用户ID:', userId);
    console.log('内容:', content);
    console.log('图片URL:', imageUrl);

    // 验证用户登录状态
    if (!userId) {
      alert('请先登录');
      return;
    }

    // 验证内容
    if (!content.trim()) {
      alert('请输入动态内容');
      return;
    }

    // 验证图片URL（如果提供）
    if (imageUrl && !isValidUrl(imageUrl)) {
      alert('请输入有效的图片URL');
      return;
    }

    try {
      setPosting(true);
      
      const payload = {
        user_id: parseInt(userId),
        content: content.trim(),
        imageUrl: imageUrl.trim(),
      };
      
      console.log('📤 发送请求:', payload);
      
      const response = await axios.post('/api/moments', payload);
      console.log('✅ 发布成功:', response.data);

      // 清空表单
      setContent('');
      setImageUrl('');
      
      // 刷新动态列表
      await fetchMoments();
      
      alert('发布成功！');
    } catch (err) {
      console.error('❗ 发布失败:', err);
      console.error('错误详情:', err.response?.data);
      
      const errorMessage = err.response?.data?.error || '发布失败，请稍后重试';
      alert(errorMessage);
    } finally {
      setPosting(false);
    }
  };

  const handleDelete = async (momentId) => {
    const userId = localStorage.getItem('userId');
    
    if (!userId) {
      alert('请先登录');
      return;
    }

    if (!confirm('确定要删除这条动态吗？')) {
      return;
    }

    try {
      await axios.delete(`/api/moments/${momentId}`, {
        data: { user_id: parseInt(userId) }
      });
      
      console.log('✅ 删除成功');
      alert('删除成功');
      await fetchMoments();
    } catch (err) {
      console.error('❗ 删除失败:', err);
      const errorMessage = err.response?.data?.error || '删除失败';
      alert(errorMessage);
    }
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 7) return `${days}天前`;
    
    return date.toLocaleDateString('zh-CN');
  };

  useEffect(() => {
    fetchMoments();
  }, []);

  const currentUserId = parseInt(localStorage.getItem('userId'));
  const userRole = localStorage.getItem('userRole');
  const isAdmin = userRole === 'admin' || currentUserId === 1;

  return (
    <div className="flex flex-col min-h-screen pb-20 bg-gray-50">
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">{isAdmin ? '📢 管理公告' : '📸 朋友圈'}</h1>
          <button 
            onClick={fetchMoments}
            className="text-blue-500 text-sm"
            disabled={loading}
          >
            {loading ? '刷新中...' : '刷新'}
          </button>
        </div>

        {/* 发布区域 */}
        <div className="bg-white p-4 rounded-lg shadow">
          {isAdmin && (
            <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <span className="text-yellow-600">📢</span>
                <span className="text-sm text-yellow-800 font-medium">管理员发布公告</span>
              </div>
              <p className="text-xs text-yellow-700 mt-1">您发布的内容将作为系统公告显示给所有用户</p>
            </div>
          )}
          
          <textarea
            placeholder={isAdmin ? "发布系统公告..." : "说点什么吧..."}
            className="w-full border border-gray-300 p-3 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={isAdmin ? 4 : 3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={isAdmin ? 1000 : 500}
          />
          <div className="text-right text-xs text-gray-500 mt-1">
            {content.length}/{isAdmin ? 1000 : 500}
          </div>
          
          <input
            type="url"
            placeholder={isAdmin ? "公告图片地址（可选）" : "图片地址（可选）"}
            className="w-full border border-gray-300 p-3 rounded-lg mt-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
          
          <button
            className={`w-full mt-3 px-4 py-2 rounded-lg font-medium ${
              posting || !content.trim()
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : isAdmin 
                  ? 'bg-orange-500 text-white hover:bg-orange-600'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
            onClick={handlePost}
            disabled={posting || !content.trim()}
          >
            {posting ? (isAdmin ? '发布公告中...' : '发布中...') : (isAdmin ? '📢 发布公告' : '发布')}
          </button>
        </div>

        {/* 动态列表 */}
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-500">加载中...</p>
          </div>
        ) : moments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>{isAdmin ? '还没有公告，快来发布第一条吧！' : '还没有动态，快来发布第一条吧！'}</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {moments.map((moment) => {
              const isAdminPost = moment.role === 'admin' || moment.user_id === 1;
              
              return (
                <li key={moment.id} className={`p-4 rounded-lg shadow ${
                  isAdminPost ? 'bg-gradient-to-r from-orange-50 to-yellow-50 border-l-4 border-orange-400' : 'bg-white'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {isAdminPost && <span className="text-orange-600">📢</span>}
                      <p className={`font-semibold ${
                        isAdminPost ? 'text-orange-600' : 'text-blue-600'
                      }`}>
                        {isAdminPost ? '系统公告' : moment.username}
                      </p>
                      {isAdminPost && (
                        <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                          官方
                        </span>
                      )}
                    </div>
                    {moment.user_id === currentUserId && (
                      <button
                        onClick={() => handleDelete(moment.id)}
                        className="text-red-500 text-sm hover:text-red-700"
                      >
                        删除
                      </button>
                    )}
                  </div>
                  
                  <p className={`mt-2 whitespace-pre-line leading-relaxed ${
                    isAdminPost ? 'text-gray-900 font-medium' : 'text-gray-800'
                  }`}>
                    {moment.content}
                  </p>
                  
                  {moment.imageUrl && (
                    <div className="mt-3">
                      <img
                        src={moment.imageUrl}
                        alt={isAdminPost ? "公告图片" : "动态图片"}
                        className="rounded-lg max-h-60 w-auto object-cover cursor-pointer hover:opacity-90 transition-opacity"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          console.error('图片加载失败:', moment.imageUrl);
                        }}
                        onClick={() => window.open(moment.imageUrl, '_blank')}
                      />
                    </div>
                  )}
                  
                  <p className="text-gray-500 text-sm mt-3 border-t pt-2">
                    {formatDate(moment.created_at)}
                  </p>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <BottomTabBar />
    </div>
  );
}