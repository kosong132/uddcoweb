import React from 'react';
import { 
  LayoutDashboard, 
  Shirt, 
  ShoppingCart, 
  MessageCircle, 
  User, 
  Truck 
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    { icon: LayoutDashboard, name: 'Dashboard', path: '/dashboard' },
    { icon: Shirt, name: 'Product', path: '/product' },
    { icon: ShoppingCart, name: 'Order', path: '/order' },
    { icon: MessageCircle, name: 'Chat', path: '/chat' },
    { icon: User, name: 'Profile', path: '/profile' },
    { icon: Truck, name: 'Delivery', path: '/delivery' }
  ];

  return (
    <div className="fixed top-16 left-0 bottom-0 w-20 bg-white shadow-md flex flex-col items-center pt-4">
      {menuItems.map((item) => (
        <Link 
          key={item.name}
          to={item.path}
          className={`
            p-3 mb-2 rounded-lg w-14 h-14 flex flex-col items-center justify-center
            ${location.pathname === item.path
              ? 'bg-orange-100 text-orange-600' 
              : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'}
            transition-colors duration-200
          `}
        >
          <item.icon size={24} />
          <span className="text-xs block mt-1">{item.name}</span>
        </Link>
      ))}
    </div>
  );
};

export default Sidebar;