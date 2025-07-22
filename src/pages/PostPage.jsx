// src/pages/PostPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BottomTabBar from '../components/BottomTabBar';

// 配置 axios 基础URL
axios.defaults.baseURL = 'http://localhost:3001';

export default function PostPage() {
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [posting, setPosting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handlePost = async () => {
    const userId = localStorage.getItem('userId');
    
    if (!userId) {
      alert('请先登录');
      navigate('/login');
      return;
    }

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
      
      alert('发布成功！');
      
      // 跳转到朋友圈页面查看
      navigate('/moments');
      
    } catch (err) {
      console.error('❗ 发布失败:', err);
      console.error('错误详情:', err.response?.data);
      
      const errorMessage = err.response?.data?.error || '发布失败，请稍后重试';
      alert(errorMessage);
    } finally {
      setPosting(false);
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

  const handleImagePreview = () => {
    if (imageUrl && isValidUrl(imageUrl)) {
      setShowPreview(true);
    }
  };

  const insertTemplate = (template) => {
    setContent(prev => prev + template);
  };

  const templates = [
    '今天心情不错～ 😊',
    '分享一下最近的收获 📚',
    '美好的一天开始了 ☀️',
    '晚安，好梦 🌙',
    '周末愉快！🎉',
    '感谢生活中的小美好 💕'
  ];

  const quickImages = [
    'https://via.placeholder.com/300x200/FF6B6B/FFFFFF?text=美食',
    'https://via.placeholder.com/300x200/4ECDC4/FFFFFF?text=风景', 
    'https://via.placeholder.com/300x200/45B7D1/FFFFFF?text=天空',
    'https://via.placeholder.com/300x200/96CEB4/FFFFFF?text=自然',
    'https://via.placeholder.com/300x200/FFEAA7/000000?text=阳光',
    'https://via.placeholder.com/300x200/DDA0DD/FFFFFF?text=花朵'
  ];

  return (
    <div className="min-h-screen pb-20 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* 头部导航 */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          <button 
            onClick={() => navigate('/moments')}
            className="text-gray-600 hover:text-gray-800"
          >
            ← 返回
          </button>
          <h1 className="text-lg font-bold">✍️ 发表动态</h1>
          <button
            onClick={handlePost}
            disabled={posting || !content.trim()}
            className={`px-4 py-2 rounded-lg font-medium ${
              posting || !content.trim()
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            {posting ? '发布中...' : '发布'}
          </button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* 发布区域 */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              💭 说点什么吧...
            </label>
            <textarea
              placeholder="分享你的想法、心情或者今天发生的有趣事情..."
              className="w-full border border-gray-300 p-4 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              maxLength={1000}
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-gray-500">
                {content.length}/1000
              </span>
              <span className="text-xs text-blue-500">
                支持换行，尽情表达 💕
              </span>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              🖼️ 添加图片（可选）
            </label>
            <div className="flex space-x-2">
              <input
                type="url"
                placeholder="粘贴图片链接地址..."
                className="flex-1 border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
              {imageUrl && (
                <button
                  onClick={handleImagePreview}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  预览
                </button>
              )}
            </div>
          </div>

          {/* 图片预览 */}
          {imageUrl && isValidUrl(imageUrl) && (
            <div className="mb-4">
              <img
                src={imageUrl}
                alt="预览图片"
                className="w-full max-h-60 object-cover rounded-lg"
                onError={(e) => {
                  e.target.style.display = 'none';
                  alert('图片加载失败，请检查链接是否正确');
                }}
              />
            </div>
          )}
        </div>

        {/* 快速模板 */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="font-semibold mb-3 text-gray-800">💡 快速模板</h3>
          <div className="grid grid-cols-1 gap-2">
            {templates.map((template, index) => (
              <button
                key={index}
                onClick={() => insertTemplate(template)}
                className="text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-sm"
              >
                {template}
              </button>
            ))}
          </div>
        </div>

        {/* 快速图片 */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="font-semibold mb-3 text-gray-800">🎨 快速配图</h3>
          <div className="grid grid-cols-3 gap-2">
            {quickImages.map((imageUrl, index) => (
              <button
                key={index}
                onClick={() => setImageUrl(imageUrl)}
                className="relative aspect-square rounded-lg overflow-hidden hover:opacity-80 transition-opacity"
              >
                <img
                  src={imageUrl}
                  alt={`配图${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* 发布小贴士 */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold mb-2 text-yellow-800">📝 发布小贴士</h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• 分享真实的想法和感受，让朋友们了解你</li>
            <li>• 可以配上一张图片，让动态更生动</li>
            <li>• 内容积极正面，传播正能量</li>
            <li>• 尊重他人，友善交流</li>
          </ul>
        </div>

        {/* 最近动态预览 */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="font-semibold mb-3 text-gray-800">👀 发布预览</h3>
          {content || imageUrl ? (
            <div className="border border-gray-200 p-3 rounded-lg bg-gray-50">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {localStorage.getItem('username')?.charAt(0) || '我'}
                </div>
                <span className="ml-2 font-medium text-sm">
                  {localStorage.getItem('username') || '我'}
                </span>
              </div>
              
              {content && (
                <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-line mb-2">
                  {content}
                </p>
              )}
              
              {imageUrl && isValidUrl(imageUrl) && (
                <img
                  src={imageUrl}
                  alt="预览图片"
                  className="rounded-lg max-h-40 w-auto object-cover"
                  onError={(e) => e.target.style.display = 'none'}
                />
              )}
              
              <p className="text-gray-500 text-xs mt-2">刚刚</p>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              输入内容后会在这里显示预览效果
            </p>
          )}
        </div>
      </div>

      {/* 图片预览弹窗 */}
      {showPreview && imageUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-full max-h-full">
            <img
              src={imageUrl}
              alt="图片预览"
              className="max-w-full max-h-full rounded-lg"
            />
            <button
              onClick={() => setShowPreview(false)}
              className="absolute top-2 right-2 bg-black bg-opacity-50 text-white w-8 h-8 rounded-full hover:bg-opacity-75"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <BottomTabBar />
    </div>
  );
}