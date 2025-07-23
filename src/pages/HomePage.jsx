import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllPools } from '../api/index';
import SearchBar from '../components/SearchBar';
import BottomTabBar from '../components/BottomTabBar';
import BoxPoolCard from '../components/BoxPoolCard';

function HomePage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [pools, setPools] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState([]);

  useEffect(() => {
    fetchPools();
  }, []);

  // 生成搜索建议
  useEffect(() => {
    if (pools.length > 0) {
      const suggestions = [
        ...new Set([
          ...pools.map(pool => pool.name),
          ...pools.flatMap(pool => {
            const words = pool.name.split(/\s+/);
            return words.length > 1 ? words : [];
          }),
          // 添加一些常见搜索词
          '龙猫', '草莓', '机甲', '核心', '宝石',
          '可爱', '精美', '限定', '特别版', '收藏'
        ])
      ].filter(Boolean);
      setSearchSuggestions(suggestions);
    }
  }, [pools]);

  const fetchPools = async () => {
    try {
      setLoading(true);
      const res = await getAllPools();
      setPools(res.data.pools || []);
    } catch (err) {
      console.error('获取盲盒池失败:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePoolClick = (poolId) => {
    navigate(`/box-detail/${poolId}`);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearch(suggestion);
    // 可以在这里添加搜索统计或其他逻辑
    console.log('搜索:', suggestion);
  };

  // 增强的搜索过滤逻辑
  const filteredPools = pools.filter(pool => {
    if (!search) return true;
    
    const searchLower = search.toLowerCase();
    const poolName = pool.name.toLowerCase();
    const poolDescription = (pool.description || '').toLowerCase();
    
    // 支持多种搜索方式
    return (
      poolName.includes(searchLower) ||           // 名称包含
      poolDescription.includes(searchLower) ||    // 描述包含
      poolName.startsWith(searchLower) ||         // 名称开头匹配
      poolName.split('').some((char, index) =>    // 首字母匹配
        searchLower.split('').every((searchChar, searchIndex) =>
          poolName[index + searchIndex] === searchChar
        )
      )
    );
  });

  // 搜索结果排序（相关度排序）
  const sortedPools = filteredPools.sort((a, b) => {
    if (!search) return 0;
    
    const searchLower = search.toLowerCase();
    const aName = a.name.toLowerCase();
    const bName = b.name.toLowerCase();
    
    // 完全匹配优先
    if (aName === searchLower) return -1;
    if (bName === searchLower) return 1;
    
    // 开头匹配优先
    const aStartsWith = aName.startsWith(searchLower);
    const bStartsWith = bName.startsWith(searchLower);
    if (aStartsWith && !bStartsWith) return -1;
    if (!aStartsWith && bStartsWith) return 1;
    
    // 按名称长度排序（更短的更相关）
    return aName.length - bName.length;
  });

  const left = sortedPools.filter((_, i) => i % 2 === 0);
  const right = sortedPools.filter((_, i) => i % 2 === 1);

  return (
    <div className="min-h-screen pb-20 bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-100">
      {/* 增强的搜索栏 */}
      <SearchBar 
        value={search} 
        onChange={setSearch}
        placeholder="搜索你喜欢的盲盒系列..."
        suggestions={searchSuggestions}
        onSuggestionClick={handleSuggestionClick}
        showHistory={true}
      />

      {/* 标题区域 */}
      <div className="text-center py-6">
        <h1 className="text-3xl font-bold text-purple-800">盲盒抽取机</h1>
        <p className="text-sm text-gray-600 mt-1">
          {search ? `搜索结果: ${sortedPools.length} 个系列` : '选择喜欢的系列抽取吧～'}
        </p>
      </div>

      {/* 搜索结果 */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          <p className="mt-4 text-gray-600">加载盲盒池中...</p>
        </div>
      ) : sortedPools.length === 0 ? (
        <div className="text-center py-12 px-4">
          {search ? (
            <div className="max-w-md mx-auto">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                没有找到相关结果
              </h3>
              <p className="text-gray-600 mb-4">
                没有找到包含 "<span className="font-medium text-purple-600">{search}</span>" 的盲盒系列
              </p>
              <div className="space-y-2">
                <p className="text-sm text-gray-500">搜索建议：</p>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li>• 尝试更简短的关键词</li>
                  <li>• 检查拼写是否正确</li>
                  <li>• 使用更通用的词语</li>
                </ul>
              </div>
              <button
                onClick={() => setSearch('')}
                className="mt-4 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
              >
                查看全部系列
              </button>
            </div>
          ) : (
            <p className="text-gray-600">暂无可用的盲盒池</p>
          )}
        </div>
      ) : (
        <>
          {/* 搜索状态显示 */}
          {search && (
            <div className="px-4 mb-4">
              <div className="bg-white/70 backdrop-blur-sm rounded-lg p-3 border border-purple-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">
                      找到 <span className="font-semibold text-purple-600">{sortedPools.length}</span> 个相关系列
                    </span>
                  </div>
                  <button
                    onClick={() => setSearch('')}
                    className="text-xs text-purple-600 hover:text-purple-800 underline"
                  >
                    清除搜索
                  </button>
                </div>
                
                {/* 显示搜索词高亮 */}
                <div className="mt-2 flex flex-wrap gap-1">
                  <span className="text-xs text-gray-500">搜索:</span>
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                    {search}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 盲盒网格 */}
          <div className="grid grid-cols-2 gap-4 px-4">
            <div>
              {left.map(pool => (
                <BoxPoolCard 
                  key={pool.id} 
                  {...pool} 
                  onClick={() => handlePoolClick(pool.id)}
                  searchTerm={search} // 传递搜索词用于高亮
                />
              ))}
            </div>
            <div>
              {right.map(pool => (
                <BoxPoolCard 
                  key={pool.id} 
                  {...pool} 
                  onClick={() => handlePoolClick(pool.id)}
                  searchTerm={search} // 传递搜索词用于高亮
                />
              ))}
            </div>
          </div>
        </>
      )}

      <BottomTabBar />
    </div>
  );
}

export default HomePage;