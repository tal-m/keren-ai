// components/BottomNav.tsx
import { Link, useLocation } from 'react-router-dom';
import { FaUser, FaGlobe, FaPlane , FaCog } from 'react-icons/fa';

const BottomNavBar = () => {
  const location = useLocation();

  const navItems = [
    { to: '/discovery', icon: <FaGlobe />, label: 'Discovery' },
    { to: '/trips', icon: <FaPlane  />, label: 'Trips' },
    { to: '/settings', icon: <FaCog />, label: 'Settings' },
    { to: '/my-Profile', icon: <FaUser />, label: 'Profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-md flex justify-around py-2">
      {navItems.map((item) => (
        <Link key={item.to} to={item.to} className={`flex flex-col items-center text-sm ${location.pathname === item.to ? 'text-indigo-600' : 'text-gray-500'}`}>
          {item.icon}
        </Link>
      ))}
    </div>
  );
};

export default BottomNavBar;
