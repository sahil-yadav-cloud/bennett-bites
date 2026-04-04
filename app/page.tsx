"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import TopNavBar from '@/src/components/layout/TopNavBar';
import SideNavBar from '@/src/components/layout/SideNavBar';
import BottomMobileNav from '@/src/components/layout/BottomMobileNav';
import Link from 'next/link';
import { useCart, MenuItem } from '@/src/context/CartContext';
import { useRouter } from 'next/navigation';

interface Profile {
  id: string;
  full_name: string;
  budget_balance: number;
}

export default function Home() {
  const router = useRouter();
  const { cart, addToTray, totalItems, totalPrice, clearCart } = useCart();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isTrayOpen, setIsTrayOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  useEffect(() => {
    async function fetchData() {
      // In a real app, we'd get the current user's ID
      // const { data: { user } } = await supabase.auth.getUser();

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .single();

      if (profileData) {
        setProfile(profileData as Profile);
      }

      const { data: menuData } = await supabase
        .from('menu_items')
        .select('*')
        .limit(3);
      
      if (menuData) {
        setMenuItems(menuData as MenuItem[]);
      }
      setIsLoading(false);
    }
    fetchData();
  }, []);

  const budgetBalance = profile?.budget_balance ?? 142.50;

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;
    setIsPlacingOrder(true);
    try {
      // In a real app, we'd use current user's profile ID
      const profileId = profile?.id || (await supabase.from('profiles').select('id').single()).data?.id;

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          profile_id: profileId,
          total_price: totalPrice,
          status: 'preparing'
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = cart.map(c => ({
        order_id: order.id,
        menu_item_id: c.item.id,
        quantity: c.qty,
        price_at_order: c.item.price
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      clearCart();
      setIsTrayOpen(false);
      router.push(`/order-status/${order.id}`);
    } catch (e) {
      console.error("Order failed", e);
      alert("Failed to place order. Check console for details.");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-on-surface font-body relative overflow-x-hidden">
      <TopNavBar />
      <SideNavBar />
      
      {/* BACKGROUND GLOWS */}
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="pt-32 pb-40 px-6 max-w-7xl mx-auto relative z-10 lg:ml-72">
        {/* Header Section */}
        <header className="mb-12">
          <h1 className="font-headline text-5xl md:text-6xl font-extrabold tracking-tight text-primary mb-4">
            {profile?.full_name ? `Welcome, ${profile.full_name}` : 'The Academic Alchemist'}
          </h1>
          <p className="font-body text-lg text-on-surface-variant max-w-2xl">Curating your campus nutrition and spending with data-driven elegance.</p>
        </header>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Nutrition Summary (Large Card) */}
          <div className="md:col-span-8 bg-surface-container-lowest rounded-xl p-8 shadow-[0_20px_40px_rgba(43,100,108,0.06)] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
              <span className="material-symbols-outlined text-9xl text-primary">analytics</span>
            </div>
            <h2 className="font-headline text-2xl font-bold mb-8 text-on-surface">Nutrition Overview</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 relative z-10">
              <div className="flex flex-col gap-2">
                <span className="text-secondary font-semibold text-sm tracking-wider uppercase">Calories</span>
                <div className="text-4xl font-headline font-extrabold text-primary">1,840</div>
                <div className="h-1.5 w-full bg-surface-container-high rounded-full mt-2">
                  <div className="h-full bg-primary rounded-full w-[72%]"></div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-secondary font-semibold text-sm tracking-wider uppercase">Protein</span>
                <div className="text-4xl font-headline font-extrabold text-primary">85g</div>
                <div className="h-1.5 w-full bg-surface-container-high rounded-full mt-2">
                  <div className="h-full bg-primary-container rounded-full w-[85%]"></div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-secondary font-semibold text-sm tracking-wider uppercase">Carbs</span>
                <div className="text-4xl font-headline font-extrabold text-primary">210g</div>
                <div className="h-1.5 w-full bg-surface-container-high rounded-full mt-2">
                  <div className="h-full bg-secondary-fixed-dim rounded-full w-[60%]"></div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-secondary font-semibold text-sm tracking-wider uppercase">Fats</span>
                <div className="text-4xl font-headline font-extrabold text-primary">54g</div>
                <div className="h-1.5 w-full bg-surface-container-high rounded-full mt-2">
                  <div className="h-full bg-tertiary-fixed-dim rounded-full w-[45%]"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Budget Tracker (Medium Card) */}
          <div className="md:col-span-4 bg-surface-container-low rounded-xl p-8 flex flex-col justify-between">
            <div>
              <h2 className="font-headline text-2xl font-bold mb-2 text-on-surface">Spending</h2>
              <p className="text-on-surface-variant font-body text-sm mb-6">Weekly allowance balance</p>
              <div className="text-5xl font-headline font-extrabold text-primary mb-8 tracking-tighter">₹{(budgetBalance - totalPrice).toFixed(2)}</div>
            </div>
            <div className="flex items-end justify-between h-32 gap-2">
              <div className="w-full bg-primary/20 rounded-t-lg h-[40%] hover:bg-primary transition-colors duration-300"></div>
              <div className="w-full bg-primary/20 rounded-t-lg h-[65%] hover:bg-primary transition-colors duration-300"></div>
              <div className="w-full bg-primary/20 rounded-t-lg h-[90%] hover:bg-primary transition-colors duration-300"></div>
              <div className="w-full bg-primary/20 rounded-t-lg h-[55%] hover:bg-primary transition-colors duration-300"></div>
              <div className="w-full bg-primary/20 rounded-t-lg h-[75%] hover:bg-primary transition-colors duration-300"></div>
              <div className="w-full bg-primary/20 rounded-t-lg h-[45%] hover:bg-primary transition-colors duration-300"></div>
              <div className="w-full bg-primary rounded-t-lg h-[30%]"></div>
            </div>
            <div className="flex justify-between mt-2 text-[10px] text-stone-400 font-bold uppercase tracking-widest">
              <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
            </div>
          </div>

          {/* Ask Bennett AI */}
          <div className="md:col-span-7 bg-primary rounded-xl p-8 relative overflow-hidden text-on-primary">
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                <h2 className="font-headline text-2xl font-bold">Ask Bennett AI</h2>
              </div>
              <p className="font-body text-on-primary-container/80 mb-8 max-w-md">&quot;Get personalized recommendations based on your current budget and macro goals.&quot;</p>
              <div className="relative">
                <input
                  className="w-full bg-white/10 border-none rounded-2xl py-5 pl-6 pr-16 text-white placeholder:text-white/50 focus:ring-2 focus:ring-white/30 backdrop-blur-md font-body text-lg"
                  placeholder="Suggest high protein food..."
                  type="text"
                />
                <button className="absolute right-3 top-3 w-12 h-12 bg-white text-primary rounded-xl flex items-center justify-center shadow-lg active:scale-90 transition-transform">
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                <span className="text-xs bg-white/10 px-3 py-1.5 rounded-full font-medium hover:bg-white/20 cursor-pointer transition-colors border border-white/5">Cheap dinner?</span>
                <span className="text-xs bg-white/10 px-3 py-1.5 rounded-full font-medium hover:bg-white/20 cursor-pointer transition-colors border border-white/5">Low carb options</span>
                <span className="text-xs bg-white/10 px-3 py-1.5 rounded-full font-medium hover:bg-white/20 cursor-pointer transition-colors border border-white/5">Meal prep help</span>
              </div>
            </div>
          </div>

          {/* Recent Bite */}
          <div className="md:col-span-5 bg-surface-container-lowest rounded-xl p-1 shadow-[0_20px_40px_rgba(43,100,108,0.06)] relative h-full flex flex-col">
            <div className="h-48 overflow-hidden rounded-t-lg relative">
              <img
                className="w-full h-full object-cover"
                alt="Fresh salad bowl with protein"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCANz9EzU6x_4rZ6MZoiu0vZI2qf1peghFmObIPTckm5RihUiJzGc2ks9_PpdUvjIuBc_IGNGE-g9I16M4XRhy5M8cjXcKgw0yTs2SNHSpyUaMquD4i_gCWn-fs6klZ_mz-ZhEk0lNkd-21xnHsyomLoXCQouwzqhW9Tgj_Xwoqz5Csjl5oBwkhH7wH9hc7w1ggsHE2CsHes7t_YM58wZMcGhlZC8sVvGWYmck6ecqQMjY-tX8SvB8TKl-T3YmxVT31l5nkN0hxwxE"
              />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-primary">Last Order</div>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-headline font-bold text-xl text-on-surface">Green Goddess Protein Bowl</h3>
                <span className="text-secondary font-bold">₹125</span>
              </div>
              <div className="flex gap-4 mb-4">
                <div className="flex items-center gap-1 text-stone-500 text-xs font-medium">
                  <span className="material-symbols-outlined text-sm">local_fire_department</span> 450 kcal
                </div>
                <div className="flex items-center gap-1 text-stone-500 text-xs font-medium">
                  <span className="material-symbols-outlined text-sm">fitness_center</span> 32g Protein
                </div>
              </div>
              <button className="w-full py-3 bg-surface-container-high hover:bg-surface-variant text-on-surface font-bold rounded-xl transition-colors active:scale-95 duration-200">Reorder This Bite</button>
            </div>
          </div>
        </div>

        {/* Campus Favorites */}
        <section className="mt-16 overflow-hidden">
          <h2 className="font-headline text-2xl font-bold mb-6 text-on-surface">Campus Favorites</h2>
          <div className="flex gap-6 overflow-x-auto pb-8 no-scrollbar -mx-2 px-2">
            {isLoading ? (
              <p>Loading favorites...</p>
            ) : menuItems.length === 0 ? (
              <p className="text-on-surface-variant opacity-50">No favorites found yet.</p>
            ) : (
              menuItems.map((item) => (
                <div key={item.id} className="min-w-[280px] bg-white rounded-xl p-4 shadow-sm border border-stone-100">
                  <div className="h-32 rounded-lg bg-surface-variant mb-4 overflow-hidden flex items-center justify-center text-primary/20">
                    <span className="material-symbols-outlined text-4xl">restaurant</span>
                  </div>
                  <h4 className="font-bold text-on-surface">{item.name}</h4>
                  <p className="text-xs text-stone-500 mb-3">{item.is_veg ? 'Veg' : 'Non-Veg'} • High Protein</p>
                  <div className="flex justify-between items-center">
                    <span className="text-primary font-extrabold">₹{item.price}</span>
                    <button 
                      onClick={() => addToTray(item)}
                      className="w-8 h-8 rounded-full bg-primary-fixed text-on-primary-fixed flex items-center justify-center hover:scale-110 transition-transform"
                    >
                      <span className="material-symbols-outlined text-sm">add</span>
                    </button>
                  </div>
                </div>
              ))
            )}
            <div className="min-w-[280px] bg-white rounded-xl p-4 shadow-sm border border-stone-100 opacity-50">
              <div className="h-32 rounded-lg bg-surface-variant mb-4 flex items-center justify-center">
                <span className="material-symbols-outlined text-4xl text-stone-300">more_horiz</span>
              </div>
              <Link href="/menu" className="font-bold text-stone-400">View All Campus Eats</Link>
            </div>
          </div>
        </section>
      </div>

      {/* TRAY MODAL */}
      {isTrayOpen && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center px-4 pb-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-md" onClick={() => setIsTrayOpen(false)}></div>
          <div className="bg-surface w-full max-w-lg rounded-[3rem] p-10 relative z-10 border border-white/10 shadow-2xl animate-in slide-in-from-bottom duration-500">
            <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-10"></div>
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-3xl font-black">Your Tray</h3>
              <span className="bg-primary/20 text-primary px-4 py-1 rounded-full text-xs font-bold">{totalItems} items</span>
            </div>
            
            <div className="space-y-4 max-h-64 overflow-y-auto mb-10 pr-2 no-scrollbar">
              {cart.map(c => (
                <div key={c.item.id} className="flex justify-between items-center bg-white/5 p-5 rounded-[1.5rem]">
                  <p className="font-bold text-on-surface">{c.item.name} <span className="text-on-surface/30 ml-2">x{c.qty}</span></p>
                  <p className="font-black text-primary">₹{c.item.price * c.qty}</p>
                </div>
              ))}
            </div>

            <div className="pt-8 border-t border-white/5">
              <div className="flex justify-between text-2xl font-black mb-8">
                <span>Total</span>
                <span className="text-primary">₹{totalPrice.toFixed(2)}</span>
              </div>
              <button
                onClick={handlePlaceOrder}
                disabled={isPlacingOrder}
                className="w-full py-5 bg-primary text-on-primary font-black rounded-2xl shadow-xl shadow-primary/20 active:scale-95 transition-transform uppercase tracking-widest disabled:opacity-50"
              >
                {isPlacingOrder ? 'Processing...' : 'Place Order'}
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomMobileNav activeTab="dashboard" />

      {/* Floating Action Button (FAB) */}
      <button
        onClick={() => setIsTrayOpen(true)}
        className="fixed bottom-24 right-6 md:bottom-12 md:right-12 w-16 h-16 bg-primary text-on-primary rounded-full shadow-[20px_20px_40px_rgba(43,100,108,0.2)] flex items-center justify-center active:scale-90 transition-transform z-50 group"
      >
        <span className="material-symbols-outlined text-3xl group-hover:rotate-90 transition-transform duration-300">add</span>
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 bg-secondary text-white text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-background">
            {totalItems}
          </span>
        )}
      </button>
    </main>
  );
}
