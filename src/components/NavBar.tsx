import { Link, useLocation } from 'react-router-dom';

const NavBar = () => {
  const location = useLocation();

  const navItems = [
    { name: '首页', path: '/' },
    { name: '全部盲盒', path: '/boxes' },
    { name: '订单记录', path: '/orders' },
    { name: '玩家展示', path: '/players' },
    { name: '搜索', path: '/search' },
    { name: '登录', path: '/login' },
    { name: '注册', path: '/register' },
  ];

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  location.pathname === item.path
                    ? 'text-blue-600 bg-gray-100'
                    : 'text-gray-700 hover:text-blue-500'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
