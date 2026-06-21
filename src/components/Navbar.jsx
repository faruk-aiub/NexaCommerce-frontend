import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, User, Heart, Search, LogOut, 
  LayoutDashboard, Menu, X, ChevronDown, Phone, 
  Mail, ArrowRight, UserCheck, Settings, MapPin, 
  ShoppingBag as OrderIcon, FileText, Bookmark, 
  HelpCircle, Info, MessageSquare, Tag, Flame
} from 'lucide-react';
import { logoutUser } from '../redux/slices/authSlice';
import { toast } from 'sonner';

const megaMenuCategories = [
  {
    name: 'Electronics',
    slug: 'electronics',
    subcategories: [
      { name: 'Smartphones', path: '/shop?category=smartphones' },
      { name: 'Laptops & Computers', path: '/shop?category=laptops' },
      { name: 'Smartwatches & Tech', path: '/shop?category=electronics' },
      { name: 'Premium Audio', path: '/shop?category=electronics' }
    ],
    promo: {
      title: 'Premium Gadgets',
      badge: 'New M3 Max Chips',
      cta: 'Explore MacBooks',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=300'
    }
  },
  {
    name: 'Fashion',
    slug: 'fashion',
    subcategories: [
      { name: "Men's Designer Wear", path: '/shop?category=mens-wear' },
      { name: "Women's Collection", path: '/shop?category=fashion' },
      { name: 'Luxury Watches', path: '/shop?category=fashion' },
      { name: 'Premium Footwear', path: '/shop?category=mens-wear' }
    ],
    promo: {
      title: 'Timeless Apparel',
      badge: 'Autumn Release',
      cta: 'Shop Designer',
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=300'
    }
  },
  {
    name: 'Grocery',
    slug: 'grocery',
    subcategories: [
      { name: 'Fresh Produce', path: '/shop?category=grocery' },
      { name: 'Beverages & Nectars', path: '/shop?category=grocery' },
      { name: 'Healthy & Organic', path: '/shop?category=grocery' },
      { name: 'Exotic Spices', path: '/shop?category=grocery' }
    ],
    promo: {
      title: 'Farm Fresh Organic',
      badge: 'Harvest Special',
      cta: 'Explore Groceries',
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=300'
    }
  },
  {
    name: 'Beauty & Personal Care',
    slug: 'beauty',
    subcategories: [
      { name: 'Skincare Elixirs', path: '/shop?category=beauty' },
      { name: 'Luxury Perfumes', path: '/shop?category=beauty' },
      { name: 'Nourishing Haircare', path: '/shop?category=beauty' },
      { name: 'Wellness Cosmetics', path: '/shop?category=beauty' }
    ],
    promo: {
      title: 'Natural Glow Serum',
      badge: '100% Vegan & Cruelty-Free',
      cta: 'Shop Beauty',
      image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=300'
    }
  },
  {
    name: 'Home & Living',
    slug: 'home-living',
    subcategories: [
      { name: 'Elegant Furniture', path: '/shop?category=home-living' },
      { name: 'Ambient Lighting', path: '/shop?category=home-living' },
      { name: 'Artisan Tableware', path: '/shop?category=home-living' },
      { name: 'Luxury Linens', path: '/shop?category=home-living' }
    ],
    promo: {
      title: 'Modern Minimalist',
      badge: 'Curated Designs',
      cta: 'Explore Home',
      image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=300'
    }
  },
  {
    name: 'Gadgets & Accessories',
    slug: 'gadgets',
    subcategories: [
      { name: 'Wireless Chargers', path: '/shop?category=gadgets' },
      { name: 'Full-Grain Leather Cases', path: '/shop?category=gadgets' },
      { name: 'Noise-Canceling Tech', path: '/shop?category=gadgets' },
      { name: 'Travel Tech Pods', path: '/shop?category=gadgets' }
    ],
    promo: {
      title: 'Premium Accessories',
      badge: 'Sleek Protection',
      cta: 'Shop Gadgets',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=300'
    }
  },
  {
    name: 'Sports & Fitness',
    slug: 'sports-fitness',
    subcategories: [
      { name: 'Premium Activewear', path: '/shop?category=sports-fitness' },
      { name: 'Home Cardio Tech', path: '/shop?category=sports-fitness' },
      { name: 'Outdoors & Hiking', path: '/shop?category=sports-fitness' },
      { name: 'Strength Conditioning', path: '/shop?category=sports-fitness' }
    ],
    promo: {
      title: 'High Performance Gear',
      badge: 'Pro Training Series',
      cta: 'View Fitness',
      image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=300'
    }
  },
  {
    name: 'Books & Stationery',
    slug: 'books-stationery',
    subcategories: [
      { name: 'Luxury Leather Notebooks', path: '/shop?category=books-stationery' },
      { name: 'Fine Writing Instruments', path: '/shop?category=books-stationery' },
      { name: 'Curated Literature', path: '/shop?category=books-stationery' },
      { name: 'Artisan Desk Accessories', path: '/shop?category=books-stationery' }
    ],
    promo: {
      title: 'Crafted Stationery',
      badge: 'Made in Germany',
      cta: 'Shop Materials',
      image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=300'
    }
  }
];

export const Navbar = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const cartItems = useSelector((state) => state.cart.items);
  const wishlistItems = useSelector((state) => state.wishlist.items);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [localSearch, setLocalSearch] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null); // 'categories' or null
  const [activeMegaCategory, setActiveMegaCategory] = useState(megaMenuCategories[0]);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Mobile accordion states
  const [mobileExpandedCat, setMobileExpandedCat] = useState(null);

  const accountMenuRef = useRef(null);
  const megaMenuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns on route changes
  useEffect(() => {
    setIsAccountOpen(false);
    setIsMobileMenuOpen(false);
    setActiveMenu(null);
  }, [location.pathname]);

  // Click outside listener for account dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target)) {
        setIsAccountOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (localSearch.trim()) {
      navigate(`/shop?search=${encodeURIComponent(localSearch.trim())}`);
    } else {
      navigate('/shop');
    }
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (err) {
      toast.error('Logout failed');
    }
  };

  const cartItemsCount = cartItems ? cartItems.reduce((acc, item) => acc + item.quantity, 0) : 0;
  const isAdmin = user && user.roles && user.roles.some(r => r.name === 'admin');

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop All', path: '/shop' },
    { name: 'Categories', path: '#mega-menu', isMega: true },
    { name: 'Collections', path: '/shop?collection=all' },
    { name: 'New Arrivals', path: '/shop?sort=newest' },
    { name: 'Deals', path: '/shop?filter=deals', isSpecial: true },
    { name: 'About Us', path: '/about' },
    { name: 'Blog', path: '/blog' },
    { name: 'Track Order', path: '/track-order' },
    { name: 'Contact Us', path: '/contact' }
  ];

  return (
    <header className="w-full z-50 transition-all duration-300">
      {/* 1. Announcement Bar */}
      <AnimatePresence>
        {!isScrolled && (
          <motion.div 
            initial={{ height: 40, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full bg-[#111827] text-white text-[11px] font-poppins font-medium tracking-wide uppercase px-4 overflow-hidden border-b border-gray-800"
          >
            <div className="mx-auto max-w-7xl h-10 flex items-center justify-between">
              <div className="flex items-center space-x-5">
                <span className="flex items-center text-gray-400">
                  <Phone className="h-3 w-3 mr-1 text-[#E63946]" />
                  +1 (800) 555-0199
                </span>
                <span className="hidden md:flex items-center text-gray-400">
                  <Mail className="h-3 w-3 mr-1 text-[#E63946]" />
                  support@nexacommerce.com
                </span>
              </div>
              <div className="text-center font-semibold text-white tracking-widest animate-pulse">
                COMPLIMENTARY SHIPPING ON ORDERS OVER $150 • CODE: NEXALUXE
              </div>
              <div className="hidden lg:flex items-center space-x-4 text-gray-400">
                <Link to="/faq" className="hover:text-white transition-colors">FAQ</Link>
                <span>•</span>
                <Link to="/track-order" className="hover:text-white transition-colors">Track Order</Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Main Sticky Header Assembly */}
      <div className={`w-full transition-all duration-300 ${isScrolled ? 'sticky top-0 luxury-glass border-b border-gray-200/80 luxury-shadow-md' : 'bg-white border-b border-gray-100'}`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Main header row */}
          <div className="flex h-20 items-center justify-between">
            {/* Mobile hamburger menu (Left) */}
            <div className="flex lg:hidden">
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="text-gray-700 hover:text-[#E63946] focus:outline-none p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>

            {/* Brand Logo (Left/Center on mobile) */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#E63946] to-[#C1121F] text-white shadow-lg shadow-red-200/50">
                  <ShoppingBag className="h-5.5 w-5.5" />
                </div>
                <span className="font-poppins text-xl font-bold tracking-widest text-gray-900 leading-none">
                  NEXA<span className="text-[#E63946]">COMMERCE</span>
                </span>
              </Link>
            </div>

            {/* Large Search Bar (Center) */}
            <div className="hidden md:block flex-1 max-w-lg mx-12">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  placeholder="Search premium collections..."
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  className="w-full font-inter rounded-full border border-gray-200 bg-gray-50/50 px-5 py-2.5 pr-12 text-xs font-medium text-gray-800 placeholder-gray-400 focus:border-[#E63946] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#E63946]/20 transition-all duration-200"
                />
                <button type="submit" className="absolute right-4 top-3 text-gray-400 hover:text-[#E63946] transition-colors">
                  <Search className="h-4.5 w-4.5" />
                </button>
              </form>
            </div>

            {/* Header Action Controls (Right) */}
            <div className="flex items-center space-x-4 sm:space-x-6">
              {/* Wishlist */}
              <Link 
                to={isAuthenticated ? "/wishlist" : "/login"} 
                className="relative text-gray-700 hover:text-[#E63946] p-2 hover:bg-gray-50 rounded-full transition-all duration-200" 
                title="Wishlist"
              >
                <Heart className="h-5.5 w-5.5" />
                {wishlistItems.length > 0 && (
                  <span className="absolute top-0 right-0 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#E63946] text-[9px] font-bold text-white ring-2 ring-white">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>

              {/* Shopping Cart */}
              <Link 
                to="/cart" 
                className="relative text-gray-700 hover:text-[#E63946] p-2 hover:bg-gray-50 rounded-full transition-all duration-200" 
                title="Shopping Cart"
              >
                <ShoppingBag className="h-5.5 w-5.5" />
                {cartItemsCount > 0 && (
                  <span className="absolute top-0 right-0 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#E63946] text-[9px] font-bold text-white ring-2 ring-white">
                    {cartItemsCount}
                  </span>
                )}
              </Link>

              {/* Admin Panel Quick link */}
              {isAdmin && (
                <Link 
                  to="/admin" 
                  className="hidden lg:flex items-center space-x-1.5 rounded-lg border border-red-100 bg-red-50/30 px-3.5 py-2 text-xs font-poppins font-semibold text-[#E63946] hover:bg-[#E63946] hover:text-white transition-all duration-300"
                >
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  <span>Admin Panel</span>
                </Link>
              )}

              {/* User Account / Profile Dropdown */}
              <div className="relative" ref={accountMenuRef}>
                {isAuthenticated ? (
                  <button 
                    onClick={() => setIsAccountOpen(!isAccountOpen)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-[#E63946] focus:outline-none p-1 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <div className="flex h-8.5 w-8.5 items-center justify-center rounded-full bg-gradient-to-tr from-gray-100 to-gray-200 border border-gray-200">
                      <User className="h-4.5 w-4.5 text-[#E63946]" />
                    </div>
                    <span className="hidden sm:inline text-xs font-poppins font-semibold tracking-wide">
                      {user?.name?.split(' ')[0]}
                    </span>
                    <ChevronDown className={`h-3 w-3 text-gray-400 transition-transform duration-300 ${isAccountOpen ? 'rotate-180' : ''}`} />
                  </button>
                ) : (
                  <Link 
                    to="/login" 
                    className="flex items-center space-x-1.5 rounded-full bg-[#E63946] px-5 py-2.5 text-xs font-poppins font-semibold text-white hover:bg-[#C1121F] hover:shadow-lg hover:shadow-red-200/40 transition-all duration-300"
                  >
                    <User className="h-4 w-4" />
                    <span>Sign In</span>
                  </Link>
                )}

                {/* Account Dropdown Overlay */}
                <AnimatePresence>
                  {isAccountOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-3 w-64 origin-top-right rounded-xl border border-gray-150 bg-white p-2.5 shadow-xl ring-1 ring-black/5 z-50 font-poppins"
                    >
                      <div className="px-3.5 py-3 border-b border-gray-100 mb-2">
                        <p className="text-xs text-gray-400 font-medium">Logged in as</p>
                        <p className="text-sm font-bold text-gray-900 truncate">{user?.name}</p>
                        <p className="text-[10px] text-gray-500 truncate font-inter">{user?.email}</p>
                      </div>

                      <div className="space-y-0.5">
                        {isAdmin && (
                          <Link 
                            to="/admin" 
                            className="flex items-center space-x-2.5 rounded-lg px-3.5 py-2.5 text-xs font-semibold text-[#E63946] hover:bg-red-50/50 transition-colors"
                          >
                            <LayoutDashboard className="h-4 w-4" />
                            <span>Admin Console</span>
                          </Link>
                        )}
                        <Link 
                          to="/dashboard/profile" 
                          className="flex items-center space-x-2.5 rounded-lg px-3.5 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                        >
                          <UserCheck className="h-4 w-4 text-gray-400" />
                          <span>Dashboard & Profile</span>
                        </Link>
                        <Link 
                          to="/dashboard/orders" 
                          className="flex items-center space-x-2.5 rounded-lg px-3.5 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                        >
                          <OrderIcon className="h-4 w-4 text-gray-400" />
                          <span>My Orders</span>
                        </Link>
                        <Link 
                          to="/admin/invoices" 
                          className="flex items-center space-x-2.5 rounded-lg px-3.5 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                        >
                          <FileText className="h-4 w-4 text-gray-400" />
                          <span>Invoice Log</span>
                        </Link>
                        <Link 
                          to="/wishlist" 
                          className="flex items-center space-x-2.5 rounded-lg px-3.5 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                        >
                          <Heart className="h-4 w-4 text-gray-400" />
                          <span>My Wishlist</span>
                        </Link>
                        <Link 
                          to="/dashboard/addresses" 
                          className="flex items-center space-x-2.5 rounded-lg px-3.5 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                        >
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span>Saved Addresses</span>
                        </Link>
                        <Link 
                          to="/dashboard/settings" 
                          className="flex items-center space-x-2.5 rounded-lg px-3.5 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                        >
                          <Settings className="h-4 w-4 text-gray-400" />
                          <span>Account Settings</span>
                        </Link>

                        <div className="border-t border-gray-100 my-1 pt-1"></div>

                        <button 
                          onClick={handleLogout}
                          className="flex w-full items-center space-x-2.5 rounded-lg px-3.5 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors cursor-pointer"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* 3. Navigation Links row (Desktop Only) */}
          <div className="hidden lg:flex items-center justify-between border-t border-gray-100/50 py-3.5">
            <div className="flex items-center space-x-8">
              {navLinks.map((link) => {
                const isLinkActive = link.path !== '#mega-menu' && (
                  link.path === '/' 
                    ? location.pathname === '/' 
                    : location.pathname.startsWith(link.path.split('?')[0])
                );

                if (link.isMega) {
                  return (
                    <div 
                      key={link.name}
                      onMouseEnter={() => setActiveMenu('categories')}
                      onMouseLeave={() => setActiveMenu(null)}
                      className="relative"
                    >
                      <button 
                        className={`flex items-center space-x-1 font-poppins text-[13px] font-semibold tracking-wider uppercase transition-colors py-1.5 focus:outline-none cursor-pointer ${activeMenu === 'categories' ? 'text-[#E63946]' : 'text-gray-700 hover:text-[#E63946]'}`}
                      >
                        <span>{link.name}</span>
                        <ChevronDown className={`h-3.5 w-3.5 text-gray-400 transition-transform duration-300 ${activeMenu === 'categories' ? 'rotate-180 text-[#E63946]' : ''}`} />
                      </button>
                    </div>
                  );
                }

                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`font-poppins text-[13px] font-semibold tracking-wider uppercase transition-all duration-200 relative py-1.5 ${link.isSpecial ? 'text-[#E63946] flex items-center space-x-1' : 'text-gray-700 hover:text-[#E63946]'} ${isLinkActive ? 'text-[#E63946]' : ''}`}
                  >
                    {link.isSpecial && <Flame className="h-3.5 w-3.5 animate-bounce fill-current" />}
                    <span>{link.name}</span>
                    {isLinkActive && (
                      <motion.span 
                        layoutId="activeNavLine" 
                        className="absolute bottom-0 left-0 w-full h-[2px] bg-[#E63946] rounded"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>
            
            <div className="text-xs font-semibold text-[#E63946] bg-red-50/60 rounded-full px-4 py-1.5 tracking-wider uppercase font-poppins border border-red-100 flex items-center">
              <Tag className="h-3 w-3 mr-1" />
              <span>FLASH SALE: 20% OFF CODES</span>
            </div>
          </div>
        </div>

        {/* Categories MEGA MENU (Full-width dropdown) */}
        <AnimatePresence>
          {activeMenu === 'categories' && (
            <motion.div
              ref={megaMenuRef}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              transition={{ duration: 0.2 }}
              onMouseEnter={() => setActiveMenu('categories')}
              onMouseLeave={() => setActiveMenu(null)}
              className="absolute left-0 w-full bg-white border-b border-gray-200 shadow-2xl z-40"
            >
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
                <div className="grid grid-cols-4 gap-8">
                  {/* Left Column: Category selector list */}
                  <div className="col-span-1 border-r border-gray-100 pr-6 space-y-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-poppins mb-3 pl-2.5">Departments</p>
                    {megaMenuCategories.map((cat) => (
                      <button
                        key={cat.name}
                        onMouseEnter={() => setActiveMegaCategory(cat)}
                        onClick={() => navigate(`/shop?category=${cat.slug}`)}
                        className={`flex w-full items-center justify-between rounded-lg px-3.5 py-2.5 text-left text-xs font-semibold font-poppins transition-all duration-200 cursor-pointer ${activeMegaCategory.name === cat.name ? 'bg-red-50/50 text-[#E63946] pl-5' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}`}
                      >
                        <span>{cat.name}</span>
                        <ChevronDown className="-rotate-90 h-3 w-3 opacity-60" />
                      </button>
                    ))}
                  </div>

                  {/* Middle columns: Subcategories grid list */}
                  <div className="col-span-2 px-4">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-poppins mb-6">Popular Subcategories</p>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                      {activeMegaCategory.subcategories.map((sub) => (
                        <div key={sub.name} className="space-y-1.5">
                          <Link 
                            to={sub.path}
                            className="font-poppins text-sm font-bold text-gray-900 hover:text-[#E63946] flex items-center transition-colors"
                          >
                            <span>{sub.name}</span>
                            <ArrowRight className="h-3 w-3 ml-1 opacity-0 hover:opacity-100 transition-opacity text-[#E63946]" />
                          </Link>
                          <ul className="space-y-1.5 pl-0.5">
                            <li>
                              <Link to={sub.path} className="font-inter text-xs text-gray-500 hover:text-gray-900 transition-colors">Best Sellers</Link>
                            </li>
                            <li>
                              <Link to={sub.path} className="font-inter text-xs text-gray-500 hover:text-gray-900 transition-colors">New Releases</Link>
                            </li>
                            <li>
                              <Link to={sub.path} className="font-inter text-xs text-gray-500 hover:text-gray-900 transition-colors">Exclusive Offers</Link>
                            </li>
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right column: Promotional Highlight cards */}
                  <div className="col-span-1 pl-4 flex flex-col justify-between">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-poppins mb-3">Featured Highlights</p>
                    <div className="group flex-grow relative overflow-hidden rounded-xl border border-gray-150 shadow-sm bg-gray-50 p-4.5 flex flex-col justify-end min-h-[180px] transition-transform duration-300">
                      <div className="absolute inset-0 z-0">
                        <img 
                          src={activeMegaCategory.promo.image} 
                          alt={activeMegaCategory.promo.title}
                          className="h-full w-full object-cover brightness-50 group-hover:scale-105 transition-transform duration-500" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent"></div>
                      </div>

                      <div className="relative z-10 space-y-1 text-white font-poppins">
                        <span className="inline-block rounded bg-[#E63946] px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase">
                          {activeMegaCategory.promo.badge}
                        </span>
                        <h4 className="text-sm font-bold tracking-wide">{activeMegaCategory.promo.title}</h4>
                        <Link 
                          to={`/shop?category=${activeMegaCategory.slug}`}
                          className="inline-flex items-center text-[10px] font-semibold text-red-200 hover:text-white transition-colors mt-1"
                        >
                          <span>{activeMegaCategory.promo.cta}</span>
                          <ArrowRight className="h-2.5 w-2.5 ml-1" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 4. Mobile responsive full-screen drawer menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black z-50 lg:hidden"
            />

            {/* Sidebar drawer content */}
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed top-0 bottom-0 left-0 w-80 bg-white shadow-2xl z-50 overflow-y-auto lg:hidden font-poppins text-gray-800"
            >
              {/* Header drawer section */}
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <Link to="/" className="flex items-center space-x-2" onClick={() => setIsMobileMenuOpen(false)}>
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#E63946] to-[#C1121F] text-white">
                    <ShoppingBag className="h-4.5 w-4.5" />
                  </div>
                  <span className="font-poppins text-base font-bold tracking-widest text-gray-900">NEXA</span>
                </Link>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="rounded-full hover:bg-gray-100 p-2 text-gray-400 hover:text-gray-900 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Mobile Search input */}
              <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                <form onSubmit={handleSearchSubmit} className="relative">
                  <input
                    type="text"
                    placeholder="Search collections..."
                    value={localSearch}
                    onChange={(e) => setLocalSearch(e.target.value)}
                    className="w-full rounded-full border border-gray-250 bg-white px-4 py-2 text-xs focus:border-[#E63946] focus:outline-none"
                  />
                  <button type="submit" className="absolute right-3.5 top-2.5 text-gray-400">
                    <Search className="h-4 w-4" />
                  </button>
                </form>
              </div>

              {/* Scrollable links menu list */}
              <div className="py-4 px-3 space-y-1">
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2 pl-2">Storefront Navigation</p>
                {navLinks.map((link) => {
                  if (link.isMega) {
                    return (
                      <div key={link.name} className="space-y-1">
                        <button
                          onClick={() => setMobileExpandedCat(mobileExpandedCat === 'cat' ? null : 'cat')}
                          className="flex w-full items-center justify-between rounded-lg px-3.5 py-2.5 text-left text-xs font-bold text-gray-700 hover:bg-gray-50 hover:text-[#E63946] transition-colors"
                        >
                          <span>{link.name}</span>
                          <ChevronDown className={`h-4 w-4 transition-transform ${mobileExpandedCat === 'cat' ? 'rotate-180 text-[#E63946]' : ''}`} />
                        </button>
                        
                        {/* Nested categories accordion links */}
                        <AnimatePresence>
                          {mobileExpandedCat === 'cat' && (
                            <motion.div 
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="pl-4 space-y-0.5 overflow-hidden"
                            >
                              {megaMenuCategories.map((cat) => (
                                <Link
                                  key={cat.name}
                                  to={`/shop?category=${cat.slug}`}
                                  onClick={() => setIsMobileMenuOpen(false)}
                                  className="block rounded-md px-3.5 py-2 text-[11px] font-semibold text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                                >
                                  {cat.name}
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  }

                  return (
                    <Link
                      key={link.name}
                      to={link.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`block rounded-lg px-3.5 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 hover:text-[#E63946] transition-colors ${link.isSpecial ? 'text-[#E63946] font-semibold' : ''}`}
                    >
                      {link.name}
                    </Link>
                  );
                })}

                <div className="border-t border-gray-100 my-4"></div>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2 pl-2">Customer Settings</p>
                {isAuthenticated ? (
                  <div className="space-y-1">
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center space-x-2.5 rounded-lg px-3.5 py-2.5 text-xs font-bold text-[#E63946] hover:bg-red-50/50"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        <span>Admin Console</span>
                      </Link>
                    )}
                    <Link
                      to="/dashboard/profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center space-x-2.5 rounded-lg px-3.5 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-55"
                    >
                      <User className="h-4 w-4 text-gray-400" />
                      <span>My Profile</span>
                    </Link>
                    <Link
                      to="/dashboard/orders"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center space-x-2.5 rounded-lg px-3.5 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-55"
                    >
                      <OrderIcon className="h-4 w-4 text-gray-400" />
                      <span>Orders Log</span>
                    </Link>
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        handleLogout();
                      }}
                      className="flex w-full items-center space-x-2.5 rounded-lg px-3.5 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center space-x-2 rounded-xl bg-[#E63946] text-white py-3 text-xs font-semibold text-center hover:bg-[#C1121F] transition-colors mx-2"
                  >
                    <User className="h-4 w-4" />
                    <span>Sign In</span>
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
