import React from 'react';

export default function BoxPoolCard({ id, name, description, image_url, onClick }) {
  return (
    <div 
      className="bg-white rounded-xl shadow-lg p-4 mb-4 cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-xl"
      onClick={onClick}
    >
      <div className="aspect-square mb-3 overflow-hidden rounded-lg">
        <img 
          src={image_url} 
          alt={name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/200x200?text=盲盒';
          }}
        />
      </div>
      
      <h3 className="font-bold text-gray-800 text-sm mb-1 line-clamp-1">
        {name}
      </h3>
      
      <p className="text-gray-600 text-xs line-clamp-2 leading-relaxed">
        {description || '神秘盲盒等你来抽~'}
      </p>
      
      <div className="mt-3 flex items-center justify-between">
        <span className="text-purple-600 text-xs font-medium">点击查看详情</span>
        <div className="text-right">
          <div className="text-xs text-gray-500">立即抽取</div>
          <div className="text-purple-600 font-bold text-sm">🎁</div>
        </div>
      </div>
    </div>
  );
}