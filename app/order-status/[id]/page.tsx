"use client";

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface Order {
  id: string;
  status: string;
  total_amount: number;
  pickup_token: string;
  pickup_location: string;
}

interface OrderItem {
  id: string;
  menu_items: {
    name: string;
    image_url: string;
    description: string;
  } | null;
  quantity: number;
  price_at_time: number;
}

export default function OrderStatusPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      const { data: orderData } = await supabase
        .from('orders')
        .select('*')
        .eq('id', id)
        .single();

      if (orderData) {
        setOrder(orderData as Order);
      }

      const { data: itemsData } = await supabase
        .from('order_items')
        .select('*, menu_items(*)')
        .eq('order_id', id);

      if (itemsData) {
        setItems(itemsData as unknown as OrderItem[]);
      }
      setLoading(false);
    }
    fetchOrder();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center opacity-50 font-bold">Loading order status...</div>;

  return (
    <main className="bg-surface font-body text-on-surface min-h-screen relative overflow-x-hidden">
      <header className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl">
        <div className="flex justify-between items-center w-full px-6 py-6 max-w-7xl mx-auto">
          <Link href="/" className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-stone-100/50 transition-colors duration-300 active:scale-95">
            <span className="material-symbols-outlined text-on-surface">close</span>
          </Link>
          <div className="text-center">
            <h1 className="font-headline font-extrabold text-xl text-teal-800 tracking-tighter">Order Status</h1>
            <p className="text-xs text-stone-500 font-medium">Bennett Bites • Campus Central</p>
          </div>
          <button className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-stone-100/50 transition-colors duration-300 active:scale-95">
            <span className="material-symbols-outlined text-on-surface">help_outline</span>
          </button>
        </div>
      </header>

      <main className="pt-28 pb-12 px-6 max-w-3xl mx-auto">
        {/* Live Status Hero */}
        <section className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-50 text-teal-800 mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-600"></span>
            </span>
            <span className="text-xs font-bold uppercase tracking-widest">
              {order?.status === 'preparing' ? 'Preparing Your Bite' : order?.status === 'ready' ? 'Ready for Pickup' : 'Order Confirmed'}
            </span>
          </div>
          <h2 className="font-headline font-bold text-4xl text-on-surface mb-4 leading-tight">
            {order?.status === 'preparing' ? 'Your order is being \ncrafted with care.' : 'Your bite is \nready for you.'}
          </h2>
          <p className="text-stone-500 text-lg max-w-md mx-auto">Estimated pickup in <span className="text-primary font-bold">8-12 minutes</span> at the {order?.pickup_location || 'Library Cafe Hub'}.</p>
        </section>

        {/* Soft Progress Bar */}
        <div className="mb-16 px-4">
          <div className="relative h-2 w-full bg-surface-container-high rounded-full overflow-hidden">
            <div className={`absolute top-0 left-0 h-full ${order?.status === 'ready' ? 'w-full' : 'w-2/3'} bg-gradient-to-r from-primary to-primary-container rounded-full transition-all duration-1000`}></div>
          </div>
          <div className="flex justify-between mt-6">
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-tighter text-primary">Confirmed</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className={`w-10 h-10 rounded-full ${order?.status === 'preparing' || order?.status === 'ready' ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-stone-400'} flex items-center justify-center ${order?.status === 'preparing' && 'ring-4 ring-primary/10'}`}>
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>restaurant</span>
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-tighter ${order?.status === 'preparing' || order?.status === 'ready' ? 'text-primary' : 'text-stone-400'}`}>Preparing</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className={`w-10 h-10 rounded-full ${order?.status === 'ready' ? 'bg-primary text-on-primary ring-4 ring-primary/10' : 'bg-surface-container-high text-stone-400'} flex items-center justify-center`}>
                <span className="material-symbols-outlined text-sm">shopping_bag</span>
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-tighter ${order?.status === 'ready' ? 'text-primary' : 'text-stone-400'}`}>Ready</span>
            </div>
          </div>
        </div>

        {/* Token & QR Card */}
        <div className="bg-surface-container-lowest rounded-xl p-8 shadow-[0_20px_40px_rgba(43,100,108,0.06)] relative overflow-hidden group">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-secondary-container/10 rounded-full blur-3xl"></div>
          <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
            {/* QR Code Side */}
            <div className="w-48 h-48 p-4 bg-white rounded-lg shadow-sm flex items-center justify-center border border-on-surface/5">
              <img
                alt="Order QR Code"
                className="w-full h-full opacity-90"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAtrTx84n6uAcg5tH_avXZ7evEL5FJl_retIHX_e4lJrYPsJtyFqxSL1njZGXaOmIQ1kJzWDIZmoPbN3t6VZEICrreIZOKxlKNo6Aj3rrZ3K-YU8W-ch6pWu5oVTAYwevW7U4VrAD_xU4fEjge2NvhetZz6BIC9fWe22XqUdQO0bsPkXDrTst5q0f03NJ8q2sYZlyThuBvp2m7oqPZCilv1GbZsquAeMbEHsgjHMhPX7HSntbAIuenMQ3r5z3pYNMigd8ZL8vGKCFc"
              />
            </div>
            {/* Minimalist Pickup Token */}
            <div className="flex-1 text-center md:text-left">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary mb-1">Pickup Token</p>
              <h3 className="font-headline font-extrabold text-5xl text-teal-900 tracking-tighter mb-4">{order?.pickup_token || 'BB-8821-X'}</h3>
              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                <span className="px-3 py-1 bg-surface-container-high rounded-full text-[11px] font-semibold text-on-surface-variant flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">pin_drop</span> {order?.pickup_location || 'Main Quad'}
                </span>
                <span className="px-3 py-1 bg-surface-container-high rounded-full text-[11px] font-semibold text-on-surface-variant flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">timer</span> Now
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary Bento */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/40 backdrop-blur-xl p-8 rounded-xl border border-white/20 shadow-sm">
            <h4 className="font-headline font-bold text-lg mb-6">Your Selection</h4>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-surface-variant flex items-center justify-center overflow-hidden">
                      <img alt={item.menu_items?.name || 'Item'} className="w-full h-full object-cover" src={item.menu_items?.image_url || ''} />
                    </div>
                    <div>
                      <p className="text-sm font-bold">{item.menu_items?.name || 'Unknown Item'}</p>
                      <p className="text-[10px] text-stone-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold">₹{(item.price_at_time * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 pt-6 border-t border-stone-200/30 flex justify-between items-end">
              <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Total Charged</span>
              <span className="text-xl font-headline font-extrabold text-primary">₹{order?.total_amount.toFixed(2)}</span>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="bg-primary text-on-primary p-6 rounded-xl flex-1 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:rotate-12 transition-transform">
                <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              </div>
              <h4 className="font-headline font-bold mb-2">Campus Rewards</h4>
              <p className="text-xs opacity-90 mb-4">This order earned you <span className="font-bold">{(order?.total_amount || 0) / 10} Alchemist Points</span>. You&apos;re 32 points away from a free Bite!</p>
              <button className="bg-white/20 hover:bg-white/30 transition-colors text-[10px] font-bold uppercase py-2 px-4 rounded-full w-fit">
                View Wallet
              </button>
            </div>
            <div className="bg-secondary-fixed text-on-secondary-fixed p-6 rounded-xl relative overflow-hidden">
              <div className="flex items-start gap-4">
                <span className="material-symbols-outlined text-secondary">location_on</span>
                <div>
                  <h4 className="font-headline font-bold text-sm mb-1">Pick up Location</h4>
                  <p className="text-xs leading-relaxed opacity-80">{order?.pickup_location}, South Wing. Look for the teal &quot;Bennett Bites&quot; pillar.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <footer className="mt-16 flex flex-col items-center gap-6">
          <button className="flex items-center gap-3 text-stone-500 hover:text-primary transition-colors duration-300">
            <span className="material-symbols-outlined text-lg">share</span>
            <span className="text-xs font-bold uppercase tracking-widest">Share Order Progress</span>
          </button>
          <div className="text-center">
            <p className="text-[10px] text-stone-400 font-medium">Order ID: #{order?.id.split('-')[0].toUpperCase()}</p>
            <p className="text-[10px] text-stone-400 font-medium">Bennett Bites © 2024 • The Curated Campus</p>
          </div>
        </footer>
      </main>
    </main>
  );
}
