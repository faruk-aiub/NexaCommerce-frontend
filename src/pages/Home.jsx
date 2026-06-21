import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Award, ShieldCheck, Truck, Clock } from 'lucide-react';
import { fetchProducts, fetchCategories } from '../redux/slices/catalogSlice';

export const Home = () => {
  const dispatch = useDispatch();
  const { products, categories, loading } = useSelector((state) => state.catalog);
  const [timeLeft, setTimeLeft] = useState(86400 * 3); // 3 days in seconds

  useEffect(() => {
    dispatch(fetchProducts({ limit: 4 }));
    dispatch(fetchCategories());
  }, [dispatch]);

  // Flash Sale Timer Countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return { d, h, m, s };
  };

  const timerData = formatTime(timeLeft);

  return (
    <div className="relative overflow-hidden bg-gray-50">
      {/* Hero Banner Section */}
      <section className="relative flex min-h-[85vh] items-center bg-[#0B0F19] text-white">
        <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80')" }}></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F19] via-[#0B0F19]/80 to-transparent"></div>
        
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-xl space-y-6"
          >
            <span className="inline-block rounded-full bg-[#E63946]/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[#E63946] ring-1 ring-[#E63946]/30">
              New Luxury Collection
            </span>
            <h1 className="font-poppins text-4xl font-bold tracking-tight sm:text-6xl">
              Elevate Your Everyday Style
            </h1>
            <p className="font-inter text-lg text-gray-300 leading-relaxed">
              Discover curated luxury pieces, meticulously crafted for modern tastemakers. Complimentary shipping & personal concierge support.
            </p>
            <div className="flex space-x-4">
              <Link 
                to="/shop" 
                className="flex items-center space-x-2 rounded-full bg-[#E63946] px-8 py-3 text-sm font-semibold hover:bg-[#C1121F] shadow-lg shadow-red-900/30 transition-all duration-200"
              >
                <span>Shop Catalog</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link 
                to="/about" 
                className="rounded-full border border-white/20 bg-white/5 px-8 py-3 text-sm font-semibold hover:bg-white/10 transition-all duration-200"
              >
                Our Story
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="border-y border-gray-100 bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center space-x-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-[#E63946]">
                <Truck className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-poppins text-sm font-semibold text-gray-900">Complimentary Courier</h4>
                <p className="font-inter text-xs text-gray-500">Free delivery on orders over $150</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-[#E63946]">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-poppins text-sm font-semibold text-gray-900">Fully Protected Payment</h4>
                <p className="font-inter text-xs text-gray-500">Industry standard SSL keys & tokens</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-[#E63946]">
                <Award className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-poppins text-sm font-semibold text-gray-900">Elite Craftsmanship</h4>
                <p className="font-inter text-xs text-gray-500">100% certified authentic items</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-[#E63946]">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-poppins text-sm font-semibold text-gray-900">Elite Concierge Service</h4>
                <p className="font-inter text-xs text-gray-500">Dedicated 24/7 client managers</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Grid Section */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-poppins text-3xl font-bold tracking-tight text-gray-900">Explore Selected Collections</h2>
          <p className="mt-4 font-inter text-gray-500">Explore state-of-the-art products across handpicked luxury departments.</p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4 lg:gap-x-8">
          {categories.slice(0, 4).map((cat) => (
            <Link 
              key={cat.id} 
              to={`/shop?category=${cat.id}`}
              className="group relative flex h-80 flex-col overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
              <div className="absolute inset-0 bg-[#111827] opacity-20 group-hover:opacity-10 transition-opacity"></div>
              
              <div className="mt-auto relative z-20 text-white space-y-1">
                <h3 className="font-poppins text-lg font-bold">{cat.name}</h3>
                <p className="font-inter text-xs text-gray-300">View Collection &rarr;</p>
              </div>
            </Link>
          ))}
          {categories.length === 0 && (
            [1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse h-80 rounded-2xl bg-gray-250 bg-gray-200"></div>
            ))
          )}
        </div>
      </section>

      {/* Flash Sale Banner Section */}
      <section className="bg-gradient-to-r from-[#0B0F19] to-[#1F1212] py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:grid lg:grid-cols-2 lg:items-center lg:gap-x-8 lg:px-8">
          <div className="space-y-6">
            <span className="inline-block rounded-full bg-[#E63946] px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white">
              Limited Flash Sale
            </span>
            <h2 className="font-poppins text-3xl font-bold tracking-tight sm:text-4xl">Up to 40% Off Designer Items</h2>
            <p className="font-inter text-gray-300">
              Act quickly to secure our most coveted designs. Offer valid while stocks last.
            </p>
            
            {/* Timer digits */}
            <div className="flex space-x-4">
              <div className="flex flex-col items-center bg-white/5 border border-white/10 rounded-xl p-4 w-20">
                <span className="text-2xl font-bold font-poppins">{timerData.d}</span>
                <span className="text-[10px] text-gray-400 font-inter">Days</span>
              </div>
              <div className="flex flex-col items-center bg-white/5 border border-white/10 rounded-xl p-4 w-20">
                <span className="text-2xl font-bold font-poppins">{timerData.h}</span>
                <span className="text-[10px] text-gray-400 font-inter">Hrs</span>
              </div>
              <div className="flex flex-col items-center bg-white/5 border border-white/10 rounded-xl p-4 w-20">
                <span className="text-2xl font-bold font-poppins">{timerData.m}</span>
                <span className="text-[10px] text-gray-400 font-inter">Mins</span>
              </div>
              <div className="flex flex-col items-center bg-white/5 border border-white/10 rounded-xl p-4 w-20">
                <span className="text-2xl font-bold font-poppins">{timerData.s}</span>
                <span className="text-[10px] text-gray-400 font-inter">Secs</span>
              </div>
            </div>
            
            <Link 
              to="/shop" 
              className="inline-block rounded-full bg-white px-8 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-100 transition-colors"
            >
              Shop the Sale
            </Link>
          </div>
          
          <div className="mt-12 lg:mt-0 flex justify-center">
            <div className="relative h-96 w-80 rounded-2xl bg-white/5 border border-white/10 p-6 flex flex-col justify-between overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 bg-[#E63946] text-xs font-bold px-3 py-1.5 rounded-bl-xl uppercase tracking-wider">
                Elite Picks
              </div>
              <div className="h-60 bg-[#161B2E] rounded-xl flex items-center justify-center">
                <span className="text-sm text-gray-400">Preview Collection</span>
              </div>
              <div>
                <h4 className="font-poppins font-bold">Nexa Chronograph Pro</h4>
                <p className="text-[#E63946] font-semibold mt-1 font-poppins">$299.00 <span className="text-gray-400 line-through text-xs">$499.00</span></p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-poppins text-3xl font-bold tracking-tight text-gray-900">Featured Additions</h2>
            <p className="mt-2 font-inter text-gray-500">The latest arrivals, handpicked for you.</p>
          </div>
          <Link to="/shop" className="text-sm font-semibold text-[#E63946] hover:text-[#C1121F] flex items-center space-x-1">
            <span>View All</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {products.slice(0, 4).map((product) => (
            <div key={product.id} className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
              <div className="aspect-w-1 aspect-h-1 bg-gray-200 group-hover:opacity-75 h-64 flex items-center justify-center overflow-hidden">
                <img 
                  src={product.image_url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80'} 
                  alt={product.name} 
                  className="h-full w-full object-cover object-center"
                />
              </div>
              <div className="flex flex-1 flex-col p-4 space-y-2 justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 font-poppins">
                    <Link to={`/product/${product.slug}`}>
                      <span aria-hidden="true" className="absolute inset-0"></span>
                      {product.name}
                    </Link>
                  </h3>
                  <p className="text-xs text-gray-500 font-inter line-clamp-2 mt-1">{product.description}</p>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <p className="text-sm font-bold text-gray-950 font-poppins">${parseFloat(product.price).toFixed(2)}</p>
                  <div className="flex items-center text-xs text-amber-500">
                    <Star className="h-3.5 w-3.5 fill-current" />
                    <span className="ml-1 text-gray-600 font-medium">4.8</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {loading && (
            [1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse flex flex-col rounded-2xl border border-gray-100 h-96 bg-white">
                <div className="h-64 bg-gray-250 bg-gray-200 rounded-t-2xl"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};
export default Home;
