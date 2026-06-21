import React from 'react';
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../redux/slices/authSlice';
import { 
  LayoutDashboard, ShoppingBag, FolderTree, Award, 
  Ticket, MessageSquare, FileText, ArrowLeft, LogOut 
} from 'lucide-react';
import { toast } from 'sonner';

export const AdminLayout = () => {
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
    { name: 'Dashboard Stats', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Manage Products', path: '/admin/products', icon: ShoppingBag },
    { name: 'Categories CRUD', path: '/admin/categories', icon: FolderTree },
    { name: 'Brands CRUD', path: '/admin/brands', icon: Award },
    { name: 'Coupons Editor', path: '/admin/coupons', icon: Ticket },
    { name: 'Review Moderator', path: '/admin/reviews', icon: MessageSquare },
    { name: 'Invoices Journal', path: '/admin/invoices', icon: FileText },
  ];

  return (
    <div className="flex min-h-screen bg-[#0B0F19] text-gray-100">
      {/* Sidebar Nav */}
      <aside className="w-64 border-r border-gray-800 bg-[#0E1322] flex-shrink-0 flex flex-col justify-between">
        <div className="p-6">
          {/* Logo & Back to Shop */}
          <div className="flex items-center justify-between pb-6 border-b border-gray-800 mb-6">
            <Link to="/" className="flex items-center space-x-2 text-[#E63946] font-bold text-lg tracking-wider">
              <span>NEXA ADMIN</span>
            </Link>
            <Link to="/" className="text-xs text-gray-400 hover:text-white flex items-center space-x-1 transition-colors" title="Back to storefront">
              <ArrowLeft className="h-3 w-3" />
              <span>Store</span>
            </Link>
          </div>

          <div className="space-y-1">
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
                        : 'text-gray-400 hover:bg-[#161F38] hover:text-white'
                    }`
                  }
                >
                  <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* Footer of Sidebar */}
        <div className="p-4 border-t border-gray-800 bg-[#0A0D18]">
          <div className="flex items-center space-x-3 mb-4 px-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500/10 text-red-500 font-bold text-sm">
              A
            </div>
            <div>
              <p className="text-xs font-semibold text-white">{user?.name}</p>
              <p className="text-[10px] text-gray-500 truncate max-w-[150px]">Administrator</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center rounded-lg px-3 py-2 text-xs font-medium text-red-400 hover:bg-red-950/20 transition-colors"
          >
            <LogOut className="mr-3 h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Console Area */}
      <main className="flex-grow p-8 overflow-y-auto">
        <div className="mx-auto max-w-7xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
