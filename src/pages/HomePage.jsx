import { useEffect, useState } from 'react';
import axios from 'axios';
import SearchBar from '../components/SearchBar';
import BottomTabBar from '../components/BottomTabBar';
import BoxPoolCard from '../components/BoxPoolCard';

const backendURL = import.meta.env.VITE_BACKEND_URL;

function HomePage() {
  const [search, setSearch] = useState('');
  const [pools, setPools] = useState([]);

  useEffect(() => {
    axios.get(`${backendURL}/api/pools`).then(res => {
      setPools(res.data.pools || []);
    });
  }, []);

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

      <div className="grid grid-cols-2 gap-4 px-4">
        <div>{left.map(pool => <BoxPoolCard key={pool.id} {...pool} />)}</div>
        <div>{right.map(pool => <BoxPoolCard key={pool.id} {...pool} />)}</div>
      </div>

      <BottomTabBar />
    </div>
  );
}

export default HomePage;
