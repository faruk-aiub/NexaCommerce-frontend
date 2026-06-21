import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../redux/slices/authSlice';
import { User, ShoppingBag, MapPin, Settings, LogOut } from 'lucide-react';
import { toast } from 'sonner';

export const DashboardLayout = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (err) {
      toast.error('Logout failed');
    }
  };

  const navItems = [
    { name: 'Profile Details', path: '/dashboard/profile', icon: User },
    { name: 'Order History', path: '/dashboard/orders', icon: ShoppingBag },
    { name: 'Address Book', path: '/dashboard/addresses', icon: MapPin },
    { name: 'Settings', path: '/dashboard/settings', icon: Settings },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="lg:grid lg:grid-cols-12 lg:gap-x-8">
        {/* Sidebar Nav */}
        <aside className="py-6 px-2 sm:px-6 lg:col-span-3 lg:py-0 lg:px-0">
          <div className="space-y-1 rounded-xl bg-white p-4 shadow-sm border border-gray-100">
            {/* User Intro */}
            <div className="flex items-center space-x-3 border-b border-gray-100 pb-4 mb-4 px-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E63946]/10 text-[#E63946] font-bold">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500 truncate max-w-[150px]">{user?.email}</p>
              </div>
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-[#E63946] text-white'
                        : 'text-gray-700 hover:bg-gray-55 hover:text-gray-900 hover:bg-gray-50'
                    }`
                  }
                >
                  <Icon
                    className="mr-3 h-5 w-5 flex-shrink-0"
                    aria-hidden="true"
                  />
                  <span className="truncate">{item.name}</span>
                </NavLink>
              );
            })}
            <button
              onClick={handleLogout}
              className="group flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="mr-3 h-5 w-5 flex-shrink-0" />
              <span>Log Out</span>
            </button>
          </div>
        </aside>

        {/* Nested Dashboard Page */}
        <div className="space-y-6 sm:px-6 lg:col-span-9 lg:px-0">
          <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100 min-h-[500px]">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
