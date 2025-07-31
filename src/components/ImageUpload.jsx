import React, { useState } from 'react';
import axios from 'axios';
import { getPlaceholderImage } from '../utils/imageUtils';

const ImageUpload = ({ type, onSuccess, currentImage, label }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentImage || '');

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // 文件类型检查
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('只允许上传图片文件 (jpeg, jpg, png, gif, webp)');
      return;
    }

    // 文件大小检查 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('文件大小不能超过 5MB');
      return;
    }

    try {
      setUploading(true);

      // 创建预览
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(file);

      // 上传文件
      const formData = new FormData();
      formData.append('image', file);

      const response = await axios.post(`/api/upload/${type}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        const imageUrl = response.data.data.url;
        setPreview(imageUrl);
        
        // 调用成功回调，传递图片URL
        if (onSuccess) {
          onSuccess(imageUrl);
        }
        
        console.log('图片上传成功:', imageUrl);
      } else {
        throw new Error(response.data.error || '上传失败');
      }
    } catch (error) {
      console.error('图片上传失败:', error);
      const errorMsg = error.response?.data?.error || error.message || '上传失败';
      alert(`图片上传失败: ${errorMsg}`);
      setPreview(currentImage || '');
    } finally {
      setUploading(false);
      // 清空input，允许重新选择同一个文件
      event.target.value = '';
    }
  };

  const handleRemove = () => {
    setPreview('');
    if (onSuccess) {
      onSuccess('');
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        {label || '图片'}
      </label>
      
      {/* 图片预览区域 */}
      {preview && (
        <div className="relative inline-block">
          <img
            src={preview}
            alt="预览"
            className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
            onError={(e) => {
              e.target.src = getPlaceholderImage.uploadFailed();
            }}
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
          >
            ×
          </button>
        </div>
      )}

      {/* 上传按钮 */}
      <div className="flex items-center space-x-3">
        <label className={`cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium transition-colors ${
          uploading 
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
            : 'bg-white text-gray-700 hover:bg-gray-50'
        }`}>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={uploading}
          />
          {uploading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
              上传中...
            </>
          ) : (
            <>
              📷 选择图片
            </>
          )}
        </label>
        
        {preview && (
          <span className="text-sm text-green-600">✅ 已选择图片</span>
        )}
      </div>

      {/* 提示信息 */}
      <div className="text-xs text-gray-500 space-y-1">
        <p>• 支持格式: JPEG, PNG, GIF, WebP</p>
        <p>• 最大大小: 5MB</p>
        <p>• 建议尺寸: 200x200 或 300x300 像素</p>
      </div>
    </div>
  );
};

export default ImageUpload;