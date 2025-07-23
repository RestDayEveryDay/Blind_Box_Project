import { Link, useLocation } from 'react-router-dom';

const tabs = [
  { name: '首页', path: '/', icon: '🏠' },
  { name: '公告', path: '/moments', icon: '📢' },
  { name: '欧非榜', path: '/luck-rank', icon: '🏆' },
  { name: '我的', path: '/my', icon: '👤' },
];

const BottomTabBar = () => {
  const location = useLocation();

  return (
    <div className="fixed bottom-0 w-full bg-white border-t flex justify-around py-2 z-50">
      {tabs.map(tab => (
        <Link
          key={tab.path}
          to={tab.path}
          className={`flex flex-col items-center text-sm ${
            location.pathname === tab.path ? 'text-blue-500' : 'text-gray-500'
          }`}
        >
          <span className="text-xl">{tab.icon}</span>
          {tab.name}
        </Link>
      ))}
    </div>
  );
};

export default BottomTabBar;