import React from 'react';

const SearchPage: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">盲盒搜索</h1>
      <input
        type="text"
        placeholder="搜索盲盒..."
        className="border border-gray-300 px-3 py-2 rounded w-full"
      />
      <p className="mt-4 text-gray-600">这里展示搜索结果。</p>
    </div>
  );
};

export default SearchPage;
