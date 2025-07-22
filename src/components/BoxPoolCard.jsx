import React from 'react';

// 高亮搜索词的辅助函数
const highlightText = (text, searchTerm) => {
  if (!searchTerm || !text) return text;
  
  const regex = new RegExp(`(${searchTerm})`, 'gi');
  const parts = text.split(regex);
  
  return parts.map((part, index) =>
    regex.test(part) ? (
      <mark key={index} className="bg-yellow-200 text-yellow-800 px-1 rounded">
        {part}
      </mark>
    ) : (
      part
    )
  );
};

export default function BoxPoolCard({ 
  name, 
  description, 
  image_url, 
  onClick, 
  searchTerm = "",
  className = ""
}) {
  return (
    <div 
      className={`bg-white rounded-xl shadow-lg p-4 mb-4 cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-xl border border-gray-100 ${className}`}
      onClick={onClick}
    >
      {/* 图片区域 */}
      <div className="aspect-square mb-3 overflow-hidden rounded-lg relative">
        <img 
          src={image_url} 
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/200x200/E5E7EB/9CA3AF?text=盲盒';
          }}
        />
        
        {/* 悬停遮罩 */}
        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
          <div className="text-white text-xs font-medium opacity-0 hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-50 px-2 py-1 rounded">
            点击查看
          </div>
        </div>
        
        {/* 搜索匹配标识 */}
        {searchTerm && name.toLowerCase().includes(searchTerm.toLowerCase()) && (
          <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-xs px-2 py-1 rounded-full font-medium">
            匹配
          </div>
        )}
      </div>
      
      {/* 标题区域 */}
      <h3 className="font-bold text-gray-800 text-sm mb-1 line-clamp-1">
        {highlightText(name, searchTerm)}
      </h3>
      
      {/* 描述区域 */}
      <p className="text-gray-600 text-xs line-clamp-2 leading-relaxed mb-3">
        {description ? highlightText(description, searchTerm) : '神秘盲盒等你来抽~'}
      </p>
      
      {/* 底部信息 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <span className="text-purple-600 text-xs font-medium">立即抽取</span>
          <svg className="w-3 h-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
        
        <div className="flex items-center space-x-1">
          <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          <span className="text-xs text-gray-500">热门</span>
        </div>
      </div>
      
      {/* 互动提示 */}
      <div className="mt-2 pt-2 border-t border-gray-100">
        <div className="flex items-center justify-center space-x-2 text-xs text-gray-400">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <span>点击查看详情</span>
        </div>
      </div>
    </div>
  );
}