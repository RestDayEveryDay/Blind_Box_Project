import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SearchBar from '../components/SearchBar';
import BottomTabBar from '../components/BottomTabBar';
import BoxPoolCard from '../components/BoxPoolCard';

// 配置 axios 基础URL
axios.defaults.baseURL = 'http://localhost:3001';

function HomePage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [pools, setPools] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPools();
  }, []);

  const fetchPools = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/pools');
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

  const filtered = pools.filter(pool =>
    pool.name.toLowerCase().includes(search.toLowerCase())
  );

  const left = filtered.filter((_, i) => i % 2 === 0);
  const right = filtered.filter((_, i) => i % 2 === 1);

  return (
    <div className="min-h-screen pb-20 bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-100">
      <SearchBar value={search} onChange={setSearch} />

      <div className="text-center py-6">
        <h1 className="text-3xl font-bold text-purple-800">盲盒抽取机</h1>
        <p className="text-sm text-gray-600">选择喜欢的系列抽取吧～</p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          <p className="mt-4 text-gray-600">加载盲盒池中...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">
            {search ? `没有找到包含 "${search}" 的盲盒池` : '暂无可用的盲盒池'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 px-4">
          <div>
            {left.map(pool => (
              <BoxPoolCard 
                key={pool.id} 
                {...pool} 
                onClick={() => handlePoolClick(pool.id)}
              />
            ))}
          </div>
          <div>
            {right.map(pool => (
              <BoxPoolCard 
                key={pool.id} 
                {...pool} 
                onClick={() => handlePoolClick(pool.id)}
              />
            ))}
          </div>
        </div>
      )}

      <BottomTabBar />
    </div>
  );
}

export default HomePage;