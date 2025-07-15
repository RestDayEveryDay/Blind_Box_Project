import React, { useState, useEffect, useRef } from 'react';

const SearchBar = ({ 
  value, 
  onChange, 
  placeholder = "搜索盲盒池...", 
  suggestions = [], 
  onSuggestionClick,
  showHistory = true,
  className = ""
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);
  const searchBarRef = useRef(null);

  // 从 localStorage 加载搜索历史
  useEffect(() => {
    if (showHistory) {
      const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
      setSearchHistory(history);
    }
  }, [showHistory]);

  // 点击外部关闭建议框
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target)) {
        setShowSuggestions(false);
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    onChange(newValue);
    setShowSuggestions(newValue.length > 0 || (isFocused && searchHistory.length > 0));
  };

  const handleInputFocus = () => {
    setIsFocused(true);
    setShowSuggestions(value.length > 0 || searchHistory.length > 0);
  };

  const handleSearch = (searchTerm) => {
    if (searchTerm.trim()) {
      // 保存到搜索历史
      saveToHistory(searchTerm.trim());
      
      // 触发搜索
      onChange(searchTerm);
      setShowSuggestions(false);
      setIsFocused(false);
      
      // 触发建议点击回调（如果提供）
      if (onSuggestionClick) {
        onSuggestionClick(searchTerm);
      }
    }
  };

  const saveToHistory = (term) => {
    if (!showHistory) return;
    
    const newHistory = [term, ...searchHistory.filter(item => item !== term)].slice(0, 10);
    setSearchHistory(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
  };

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
  };

  const clearSearch = () => {
    onChange('');
    inputRef.current?.focus();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(value);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setIsFocused(false);
      inputRef.current?.blur();
    }
  };

  // 过滤建议（匹配搜索词）
  const filteredSuggestions = suggestions.filter(suggestion =>
    suggestion.toLowerCase().includes(value.toLowerCase())
  );

  // 过滤搜索历史
  const filteredHistory = searchHistory.filter(item =>
    item.toLowerCase().includes(value.toLowerCase())
  );

  const hotSearches = [
    '龙猫', '草莓', '机甲', '核心', '宝石', 
    '玩偶', '手办', '贴纸', '徽章', '传说'
  ];

  return (
    <div ref={searchBarRef} className={`sticky top-0 bg-white z-20 py-3 px-4 shadow-sm ${className}`}>
      {/* 搜索输入框 */}
      <div className="relative">
        <div className={`flex items-center border rounded-lg px-3 py-2 transition-all duration-200 ${
          isFocused ? 'border-blue-400 ring-2 ring-blue-100' : 'border-gray-300'
        }`}>
          {/* 搜索图标 */}
          <svg 
            className="w-5 h-5 text-gray-400 mr-2" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
            />
          </svg>

          {/* 输入框 */}
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onKeyDown={handleKeyPress}
            placeholder={placeholder}
            className="flex-1 text-sm focus:outline-none placeholder-gray-400"
          />

          {/* 清除按钮 */}
          {value && (
            <button
              onClick={clearSearch}
              className="ml-2 p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* 建议下拉框 */}
        {showSuggestions && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto z-30">
            
            {/* 当前搜索词建议 */}
            {value && (
              <div className="p-2 border-b border-gray-100">
                <button
                  onClick={() => handleSearch(value)}
                  className="w-full flex items-center px-3 py-2 hover:bg-gray-50 rounded-lg text-left"
                >
                  <svg className="w-4 h-4 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span className="text-sm">搜索 "<span className="font-medium text-blue-600">{value}</span>"</span>
                </button>
              </div>
            )}

            {/* 匹配的建议 */}
            {filteredSuggestions.length > 0 && (
              <div className="p-2 border-b border-gray-100">
                <div className="text-xs text-gray-500 px-3 py-1 font-medium">建议</div>
                {filteredSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearch(suggestion)}
                    className="w-full flex items-center px-3 py-2 hover:bg-gray-50 rounded-lg text-left"
                  >
                    <svg className="w-4 h-4 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm">{suggestion}</span>
                  </button>
                ))}
              </div>
            )}

            {/* 搜索历史 */}
            {showHistory && filteredHistory.length > 0 && (
              <div className="p-2 border-b border-gray-100">
                <div className="flex items-center justify-between px-3 py-1">
                  <span className="text-xs text-gray-500 font-medium">最近搜索</span>
                  <button
                    onClick={clearHistory}
                    className="text-xs text-gray-400 hover:text-gray-600"
                  >
                    清除
                  </button>
                </div>
                {filteredHistory.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearch(item)}
                    className="w-full flex items-center px-3 py-2 hover:bg-gray-50 rounded-lg text-left"
                  >
                    <svg className="w-4 h-4 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm">{item}</span>
                  </button>
                ))}
              </div>
            )}

            {/* 热门搜索 */}
            {!value && (
              <div className="p-2">
                <div className="text-xs text-gray-500 px-3 py-1 font-medium">热门搜索</div>
                <div className="flex flex-wrap gap-2 px-3 py-2">
                  {hotSearches.map((term, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearch(term)}
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-xs text-gray-700 transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 无结果提示 */}
            {value && filteredSuggestions.length === 0 && filteredHistory.length === 0 && (
              <div className="p-4 text-center text-gray-500">
                <svg className="w-8 h-8 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <p className="text-sm">没有找到相关建议</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 搜索结果统计 */}
      {value && !showSuggestions && (
        <div className="mt-2 text-xs text-gray-500 flex items-center">
          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          搜索关键词: {value}
        </div>
      )}
    </div>
  );
};

export default SearchBar;