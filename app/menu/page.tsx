"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import TopNavBar from '@/src/components/layout/TopNavBar';
import SideNavBar from '@/src/components/layout/SideNavBar';
import BottomMobileNav from '@/src/components/layout/BottomMobileNav';
import { useCart, MenuItem } from '@/src/context/CartContext';
import Link from 'next/link';

export default function MenuPage() {
  const { addToTray, totalItems, totalPrice } = useCart();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    async function fetchMenu() {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('name');

      if (error) {
        console.error("Error fetching menu:", error.message);
      } else if (data) {
        setMenuItems(data as MenuItem[]);
      }
      setIsLoading(false);
    }
    fetchMenu();
  }, []);

  const filteredItems = activeFilter === 'All'
    ? menuItems
    : menuItems.filter(item => {
        if (activeFilter === 'Budget') return item.category === 'Budget';
        if (activeFilter === 'Healthy') return item.category === 'Healthy';
        if (activeFilter === 'Quick') return item.prep_time && item.prep_time <= 5;
        return true;
      });

  return (
    <div className="bg-background font-body text-on-surface min-h-screen selection:bg-primary-fixed relative overflow-x-hidden">
      <TopNavBar />
      <SideNavBar />

      <main className="pt-24 pb-20 max-w-7xl mx-auto px-6 lg:ml-72">
        {/* Hero Header */}
        <header className="py-12 md:py-20 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-7xl font-extrabold font-headline tracking-tight text-primary leading-[1.1]">
              The Curated <br /><span className="text-secondary italic">Campus Pantry.</span>
            </h1>
            <p className="mt-6 text-lg text-on-surface-variant max-w-lg leading-relaxed">
              Elevated dining for the academic soul. Discover nutritious bites and budget-friendly treasures crafted for the Bennett community.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-6 py-3 bg-primary text-on-primary rounded-full font-semibold shadow-lg hover:shadow-primary/20 transition-all active:scale-95">
              <span className="material-symbols-outlined">restaurant_menu</span>
              Order Now
            </button>
          </div>
        </header>

        {/* Filters Section */}
        <section className="mb-12">
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => setActiveFilter('All')}
              className={`px-6 py-2.5 rounded-full font-medium transition-all ${activeFilter === 'All' ? 'bg-primary text-on-primary' : 'bg-primary-fixed-dim text-on-primary-fixed-variant'}`}
            >
              All Bites
            </button>
            <button
              onClick={() => setActiveFilter('Budget')}
              className={`px-6 py-2.5 rounded-full font-medium transition-all flex items-center gap-2 ${activeFilter === 'Budget' ? 'bg-primary text-on-primary' : 'bg-primary-fixed-dim text-on-primary-fixed-variant hover:bg-primary-container hover:text-on-primary-container'}`}
            >
              <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>savings</span>
              Budget-friendly
            </button>
            <button
              onClick={() => setActiveFilter('Healthy')}
              className={`px-6 py-2.5 rounded-full font-medium transition-all flex items-center gap-2 ${activeFilter === 'Healthy' ? 'bg-primary text-on-primary' : 'bg-primary-fixed-dim text-on-primary-fixed-variant hover:bg-primary-container hover:text-on-primary-container'}`}
            >
              <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
              Healthy
            </button>
            <button
              onClick={() => setActiveFilter('Quick')}
              className={`px-6 py-2.5 rounded-full font-medium transition-all flex items-center gap-2 ${activeFilter === 'Quick' ? 'bg-primary text-on-primary' : 'bg-primary-fixed-dim text-on-primary-fixed-variant hover:bg-primary-container hover:text-on-primary-container'}`}
            >
              <span className="material-symbols-outlined text-lg">bolt</span>
              Quick Bites
            </button>
          </div>
        </section>

        {/* Menu Bento Grid */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {isLoading ? (
            <div className="col-span-12 py-20 text-center opacity-50 font-bold">Loading Menu...</div>
          ) : filteredItems.length === 0 ? (
             <div className="col-span-12 py-20 text-center opacity-50 font-bold">No menu items found for this filter.</div>
          ) : (
            <>
              {/* Featured Item: Paneer Roll or First Item */}
              {filteredItems[0] && (
                <div className="md:col-span-8 group relative overflow-hidden rounded-xl bg-surface-container-low min-h-[400px]">
                  <div className="absolute inset-0 z-0">
                    <img
                      alt={filteredItems[0].name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      src={filteredItems[0].image_url || "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=1000&auto=format&fit=crop"}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  </div>
                  <div className="relative z-10 p-10 h-full flex flex-col justify-end">
                    <div className="flex gap-2 mb-4">
                      <span className="px-3 py-1 bg-white/20 backdrop-blur-xl border border-white/20 rounded-full text-xs font-bold text-white uppercase tracking-widest">Editor&apos;s Choice</span>
                      <span className="px-3 py-1 bg-secondary text-on-secondary rounded-full text-xs font-bold uppercase tracking-widest">
                        {filteredItems[0].category || 'Featured'}
                      </span>
                    </div>
                    <h3 className="text-4xl font-extrabold text-white font-headline mb-2">{filteredItems[0].name}</h3>
                    <p className="text-stone-200 max-w-md mb-6">{filteredItems[0].description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-white">₹{filteredItems[0].price}</span>
                      <button
                        onClick={() => addToTray(filteredItems[0])}
                        className="w-12 h-12 bg-white text-primary rounded-full flex items-center justify-center active:scale-90 transition-transform shadow-lg"
                      >
                        <span className="material-symbols-outlined">add</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Other Items */}
              {filteredItems.slice(1).map((item) => (
                <div key={item.id} className="md:col-span-4 bg-white/40 backdrop-blur-xl p-1 border border-outline-variant/10 rounded-xl flex flex-col shadow-sm hover:shadow-md transition-shadow">
                  <div className="h-48 rounded-lg overflow-hidden mb-6">
                    <img
                      alt={item.name}
                      className="w-full h-full object-cover"
                      src={item.image_url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000&auto=format&fit=crop"}
                    />
                  </div>
                  <div className="px-6 pb-8 flex-grow flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold font-headline text-primary">{item.name}</h3>
                      <span className="bg-primary-fixed text-on-primary-fixed px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tighter">
                        {item.category || 'Bite'}
                      </span>
                    </div>
                    <div className="flex gap-3 mb-4">
                      <div className="flex items-center gap-1 text-xs text-secondary font-semibold">
                        <span className="material-symbols-outlined text-sm">fitness_center</span> {item.calories || 0} kcal
                      </div>
                      <div className="flex items-center gap-1 text-xs text-secondary font-semibold">
                        <span className="material-symbols-outlined text-sm">schedule</span> {item.prep_time || 0} mins
                      </div>
                    </div>
                    <p className="text-sm text-on-surface-variant mb-6 line-clamp-2">{item.description}</p>
                    <div className="mt-auto flex items-center justify-between">
                      <span className="text-xl font-bold text-on-surface">₹{item.price}</span>
                      <button
                        onClick={() => addToTray(item)}
                        className="px-4 py-2 bg-surface-container-high hover:bg-primary hover:text-on-primary rounded-full text-sm font-bold transition-all active:scale-95"
                      >
                        Add to Tray
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </section>

        {/* Specialized Component: Bite-Sized Carousel */}
        <section className="mt-24">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-extrabold font-headline text-primary">Quick Campus Grabs</h2>
            <div className="flex gap-2">
              <button className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center text-primary hover:bg-surface-container-high transition-colors">
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center text-primary hover:bg-surface-container-high transition-colors">
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
          <div className="flex gap-6 overflow-x-auto pb-8 no-scrollbar -mx-6 px-8">
            {[
              { icon: 'cookie', name: 'Oatmeal Cookie', price: 30, desc: 'Fiber-rich & lightly sweetened' },
              { icon: 'icecream', name: 'Greek Yogurt Pop', price: 55, desc: 'Probiotic frozen snack' },
              { icon: 'local_cafe', name: 'Iced Americano', price: 90, desc: 'Zero calorie caffeine hit' },
              { icon: 'apple', name: 'Fruit Medley', price: 70, desc: 'Seasonal diced fruits' },
            ].map((grab, i) => (
              <div key={i} className="min-w-[280px] bg-surface-variant/30 rounded-lg p-6 flex flex-col items-center text-center transition-all hover:bg-surface-container-high group">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: grab.icon === 'icecream' ? "'FILL' 1" : "" }}>
                    {grab.icon}
                  </span>
                </div>
                <h5 className="font-bold text-on-surface mb-1">{grab.name}</h5>
                <p className="text-xs text-on-surface-variant mb-4">{grab.desc}</p>
                <span className="font-bold text-secondary">₹{grab.price}</span>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Floating Action for Cart Summary */}
      {totalItems > 0 && (
        <div className="fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 z-40">
          <Link href="/cart">
            <button className="flex items-center gap-4 bg-primary text-on-primary px-8 py-4 rounded-full shadow-[0_20px_40px_rgba(43,100,108,0.2)] hover:scale-105 active:scale-95 transition-all">
              <span className="material-symbols-outlined">shopping_basket</span>
              <span className="font-bold font-headline">View Tray ({totalItems} items)</span>
              <span className="w-px h-6 bg-white/20"></span>
              <span className="font-bold">₹{totalPrice.toFixed(2)}</span>
            </button>
          </Link>
        </div>
      )}

      <BottomMobileNav activeTab="menu" />
    </div>
  );
}
