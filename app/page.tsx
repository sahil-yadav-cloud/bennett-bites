"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function Home() {
  // --- STATE MANAGEMENT ---
  const [showToast, setShowToast] = useState(false);
  const [lastAdded, setLastAdded] = useState("");
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [cart, setCart] = useState<{ item: any, qty: number }[]>([]);
  const [isTrayOpen, setIsTrayOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // --- DATA FETCHING ---
  useEffect(() => {
    async function fetchData() {
      // Fetches live snacks from your 'menu_items' table
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('name');
      
      if (error) {
        console.error("Error fetching menu:", error.message);
      } else if (data) {
        setMenuItems(data);
      }
      setIsLoading(false);
    }
    fetchData();
  }, []);

  // --- ACTIONS ---
  const addToTray = (item: any) => {
    setCart(prev => {
      const existing = prev.find(c => c.item.id === item.id);
      if (existing) return prev.map(c => c.item.id === item.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { item, qty: 1 }];
    });

    setLastAdded(item.name);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const totalPrice = cart.reduce((acc, curr) => acc + (curr.item.price * curr.qty), 0);
  const totalItems = cart.reduce((acc, curr) => acc + curr.qty, 0);

  return (
    // Uses your custom 'background' and 'on-background' colors
    <main className="min-h-screen bg-background text-on-background font-sans relative overflow-x-hidden">
      
      {/* BACKGROUND GLOWS - Matches your screenshot design */}
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-teal-accent/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* NOTIFICATION TOAST */}
      {showToast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-surface border border-white/10 shadow-2xl px-6 py-3 rounded-full flex items-center gap-3 backdrop-blur-md">
            <div className="w-2 h-2 bg-teal-accent rounded-full animate-pulse"></div>
            <p className="text-sm font-bold">
              Added <span className="text-teal-accent">{lastAdded}</span> to tray
            </p>
          </div>
        </div>
      )}

      {/* 1. HEADER */}
      <nav className="fixed top-0 w-full z-40 bg-background/60 backdrop-blur-xl border-b border-white/5 px-8 h-20 flex justify-between items-center">
        <div className="text-2xl font-black tracking-tighter text-teal-accent uppercase">Bennett Bites</div>
        <div className="flex items-center gap-6">
          <span className="material-symbols-outlined opacity-50 hover:opacity-100 cursor-pointer">search</span>
          <div className="w-10 h-10 rounded-full bg-surface border border-white/10 flex items-center justify-center text-xs font-bold text-primary">JD</div>
        </div>
      </nav>

      <div className="pt-32 pb-40 px-8 max-w-7xl mx-auto relative z-10">
        
        {/* 2. STATS SECTION */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { label: 'Budget Left', val: `₹${(120 - totalPrice).toFixed(2)}`, color: 'text-teal-accent' },
            { label: 'Wait Time', val: '12m', color: 'text-on-background' },
            { label: 'Daily Cals', val: '450', color: 'text-orange-400' },
            { label: 'Orders', val: '0 Active', color: 'text-blue-400' }
          ].map((stat, i) => (
            <div key={i} className="bg-surface/50 backdrop-blur-sm p-6 rounded-[2rem] border border-white/5">
              <p className="text-[10px] text-white/30 uppercase font-black tracking-widest mb-1">{stat.label}</p>
              <p className={`text-2xl font-black ${stat.color}`}>{stat.val}</p>
            </div>
          ))}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* 3. LIVE MENU */}
          <div className="lg:col-span-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black flex items-center gap-3">
                <span className="w-2 h-6 bg-teal-accent rounded-full"></span>
                Live Menu
              </h2>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 opacity-20">
                <div className="w-10 h-10 border-4 border-teal-accent border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="font-bold">Loading snacks...</p>
              </div>
            ) : menuItems.length === 0 ? (
              <div className="bg-surface/30 border border-dashed border-white/10 rounded-[2rem] p-12 text-center">
                <p className="text-white/40 font-bold italic">Your menu is empty. Add items to your Supabase table!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {menuItems.map((item) => (
                  <div key={item.id} className="bg-surface/40 rounded-[2.5rem] p-8 border border-white/5 hover:border-primary/30 transition-all group relative overflow-hidden">
                    <div className="flex justify-between items-start mb-8 relative z-10">
                      <div>
                        <span className={`text-[10px] font-black px-3 py-1 rounded-full ${item.is_veg ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                          {item.is_veg ? 'VEG' : 'NON-VEG'}
                        </span>
                        <h3 className="text-xl font-bold mt-3 group-hover:text-primary transition-colors">{item.name}</h3>
                      </div>
                      <span className="text-xl font-black">₹{item.price}</span>
                    </div>
                    <button 
                      onClick={() => addToTray(item)}
                      className="w-full py-4 bg-white/5 hover:bg-primary text-white hover:text-background font-black rounded-2xl border border-white/10 transition-all active:scale-95"
                    >
                      ADD TO TRAY
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 4. AI SIDEBAR */}
          <div className="lg:col-span-4">
            <div className="sticky top-32 space-y-6">
              <div className="bg-teal-accent/10 p-8 rounded-[2.5rem] border border-teal-accent/20">
                <h3 className="font-black text-xs mb-4 text-teal-accent uppercase tracking-[0.2em]">AI Suggestion</h3>
                <p className="text-sm leading-relaxed text-white/70 italic font-medium">
                  "It's getting warm outside! A <b className="text-white">Cold Coffee</b> might be better than tea right now."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. TRAY MODAL */}
      {isTrayOpen && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center px-4 pb-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-md" onClick={() => setIsTrayOpen(false)}></div>
          <div className="bg-surface w-full max-w-lg rounded-[3rem] p-10 relative z-10 border border-white/10 shadow-2xl animate-in slide-in-from-bottom duration-500">
            <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-10"></div>
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-3xl font-black">Your Tray</h3>
              <span className="bg-primary/20 text-primary px-4 py-1 rounded-full text-xs font-bold">{totalItems} items</span>
            </div>
            
            <div className="space-y-4 max-h-64 overflow-y-auto mb-10 pr-2 custom-scrollbar">
              {cart.map(c => (
                <div key={c.item.id} className="flex justify-between items-center bg-white/5 p-5 rounded-[1.5rem]">
                  <p className="font-bold text-white/90">{c.item.name} <span className="text-white/30 ml-2">x{c.qty}</span></p>
                  <p className="font-black text-primary">₹{c.item.price * c.qty}</p>
                </div>
              ))}
            </div>

            <div className="pt-8 border-t border-white/5">
              <div className="flex justify-between text-2xl font-black mb-8">
                <span>Total</span>
                <span className="text-teal-accent">₹{totalPrice.toFixed(2)}</span>
              </div>
              <button className="w-full py-5 bg-primary text-background font-black rounded-2xl shadow-xl shadow-primary/20 active:scale-95 transition-transform uppercase tracking-widest">
                Place Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. NAVIGATION DOCK */}
      <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-surface/60 backdrop-blur-2xl border border-white/10 px-8 py-4 rounded-full flex gap-12 items-center z-50 shadow-2xl">
        <button className="flex flex-col items-center text-teal-accent">
          <span className="material-symbols-outlined text-2xl">home</span>
          <span className="text-[8px] font-black mt-1 uppercase tracking-widest">Home</span>
        </button>
        <button onClick={() => setIsTrayOpen(true)} className="flex flex-col items-center text-white/40 hover:text-white relative">
          <span className="material-symbols-outlined text-2xl">shopping_bag</span>
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-background text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
              {totalItems}
            </span>
          )}
          <span className="text-[8px] font-black mt-1 uppercase tracking-widest">Tray</span>
        </button>
        <button className="flex flex-col items-center text-white/40 hover:text-white">
          <span className="material-symbols-outlined text-2xl">history</span>
          <span className="text-[8px] font-black mt-1 uppercase tracking-widest">Orders</span>
        </button>
      </nav>
    </main>
  );
}