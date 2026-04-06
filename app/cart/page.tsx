"use client";

import { useState } from 'react';
import TopNavBar from '@/src/components/layout/TopNavBar';
import SideNavBar from '@/src/components/layout/SideNavBar';
import BottomMobileNav from '@/src/components/layout/BottomMobileNav';
import Link from 'next/link';
import { useCart } from '@/src/context/CartContext';
import { useRouter } from 'next/navigation';
import { placeOrder } from '@/src/lib/orderUtils';

export default function CartPage() {
  const router = useRouter();
  const { cart, updateQty, totalPrice, clearCart } = useCart();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const subtotal = totalPrice;
  const delivery = 2.99;
  const tax = subtotal * 0.06;
  const total = subtotal + delivery + tax;

  return (
    <div className="bg-surface font-body text-on-surface antialiased min-h-screen relative overflow-x-hidden">
      <TopNavBar />
      <SideNavBar />

      <main className="pt-28 pb-20 px-6 max-w-7xl mx-auto lg:ml-72">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Content Area: Items & Splitting */}
          <div className="flex-1 space-y-12">
            {/* Header */}
            <header className="space-y-2">
              <h1 className="text-5xl font-headline font-extrabold text-on-surface tracking-tight">Your Selection</h1>
              <p className="text-stone-500 text-lg">Curated campus flavors, ready for checkout.</p>
            </header>

            {/* Cart Items Section */}
            <section className="space-y-6">
              {cart.map((c) => (
                <div key={c.item.id} className="bg-surface-container-lowest rounded-xl p-8 shadow-[0_20px_40px_rgba(43,100,108,0.06)] flex flex-col sm:flex-row items-center gap-8 group transition-all duration-500 hover:translate-y-[-4px]">
                  <div className="w-32 h-32 rounded-lg overflow-hidden flex-shrink-0 bg-surface-container">
                    <img
                      alt={c.item.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      src={c.item.image_url || "https://lh3.googleusercontent.com/aida-public/AB6AXuAHxyuTbmhXsXTMnwWSOtahPYtZP5x6WjAsQvE2u3L5yZ05ziOEsP7nIW6MCOTMt2nWCu0lXfv75x1wGvU6zs4La8JKFIqFZebxV_3kvbTtrPY7ErO1KDU4JGIU7jRc0DkReKSobDiSr0RBjFSGTWqKraXZ7cQTCdcnSLfk9QpmYh0iPe-aSDvmDanZimvlrTUEWWcZJO8PJRqbSb3_B5nW-44lOtOfqs4fQQ4DhjnTlL7Ur6j2EGEEWspkWhNwVF0LOmpM0o8UPmQ"}
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <span className="text-secondary font-semibold text-xs tracking-widest uppercase">{c.item.category || 'Signature Bites'}</span>
                    <h3 className="text-2xl font-headline font-bold text-on-surface">{c.item.name}</h3>
                    <p className="text-stone-500 text-sm">{c.item.description || 'Curated campus flavor.'}</p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center bg-surface-container-low rounded-full p-1 border border-outline-variant/10">
                      <button
                        onClick={() => updateQty(c.item.id, -1)}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container-highest text-primary transition-colors"
                      >
                        <span className="material-symbols-outlined text-lg">remove</span>
                      </button>
                      <span className="px-4 font-bold text-on-surface">{c.qty}</span>
                      <button
                        onClick={() => updateQty(c.item.id, 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container-highest text-primary transition-colors"
                      >
                        <span className="material-symbols-outlined text-lg">add</span>
                      </button>
                    </div>
                    <span className="text-xl font-headline font-bold text-teal-800">₹{(c.item.price * c.qty).toFixed(2)}</span>
                  </div>
                </div>
              ))}
              {cart.length === 0 && (
                <div className="text-center py-12 opacity-50 font-bold">Your tray is empty.</div>
              )}
            </section>

            {/* Split with Friends Section */}
            <section className="bg-surface-container-low rounded-xl p-10 space-y-8">
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <h2 className="text-3xl font-headline font-bold text-on-surface">Split with Friends</h2>
                  <p className="text-stone-500 font-body">Sharing is campus tradition. Split the bill instantly.</p>
                </div>
                <button className="text-primary font-bold flex items-center gap-2 hover:opacity-80 transition-opacity">
                  <span className="material-symbols-outlined">person_add</span>
                  <span>Add Friend</span>
                </button>
              </div>
              <div className="flex flex-wrap gap-6">
                {/* Friend Avatar 1 */}
                <div className="flex flex-col items-center gap-3">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full p-1 border-2 border-primary/20 bg-surface">
                      <img
                        alt="Sarah"
                        className="w-full h-full rounded-full object-cover"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuA2XfwAMOoANsaId2hpr7EoZ16dd-fB5dttk1ZCHegTvIbw3Iu8V5lGKE0DJnSmaamasQe2GQfRWZFg-TzFhq7gkO5X5xc-RH-w8Bu6oLCG2IngqoXiiY8bujO4cvc93LpNcPM-N-Pd2ntSUj3fEBlXYy73r1Qu_Q6WvxaUhR-4BdEVwtZJKYuKZ15htXAMUtFD0apu-lIIi3160usTdg2BY0wqflvkI7Yz-e2zq6gHKDpcj2pQFkIw6EkdFROr1OMRi4NSXdITIj8"
                      />
                    </div>
                    <div className="absolute -top-1 -right-1 bg-primary text-white p-1 rounded-full shadow-lg">
                      <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-on-surface">Sarah</span>
                </div>
                {/* Friend Avatar 2 */}
                <div className="flex flex-col items-center gap-3">
                  <div className="w-20 h-20 rounded-full p-1 border-2 border-transparent bg-surface">
                    <img
                      alt="Marcus"
                      className="w-full h-full rounded-full object-cover grayscale opacity-60"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBTmWUUheZCT3IRXe9oh7x_BOfzjz6c-9ro3JftHD-dZNPiFHqJQ9ty7vjbvJSz4YIWpKPExSSEW1utbHm4mJzuc8lp4KANddFx_igUjhe9rGqj7iD6D_b_j55HMlrDwWpSGAJVu6x0Pvd8w6JPJvX87GlIiG-xIE9hkF9wiUuJD_aOINWj_qH4kZpZA0zXBLKkDrvw7AduPh_gyfSuwp2zMElQQtgZCLbWxFzz-WzjCiTFNFbGS80Yu2-loujiW-GtUsgyzUXs160"
                    />
                  </div>
                  <span className="text-sm font-medium text-stone-500">Marcus</span>
                </div>
                {/* Friend Avatar 3 */}
                <div className="flex flex-col items-center gap-3">
                  <div className="w-20 h-20 rounded-full p-1 border-2 border-transparent bg-surface">
                    <img
                      alt="James"
                      className="w-full h-full rounded-full object-cover grayscale opacity-60"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCLCrhUcBALD3Z8BWAnHHD4HMfICP7AdQGZCkUNJL8z26s_d39iXcHX5xu56M-Npg_jJzmsvABGiZ3FF65j_QpZf3aEzqdRyKljF1UZ9nX6hIIVvxpLFKCdCAePoQ5X8WKdUWHt5-KeQjxmxxVprreoxP3sxQGMIiZW5BdfyJVbkVLriAfMGoFImmMjx-lG5oPVzNkc3d5W34aUrKH6xKbtvhBCsQM4y_7l48hfFbO7taonBYVR7du-ah1aa--F6aVG3mB3nb4IC2Q"
                    />
                  </div>
                  <span className="text-sm font-medium text-stone-500">James</span>
                </div>
                {/* Empty Slot */}
                <button className="w-20 h-20 rounded-full border-2 border-dashed border-outline-variant flex items-center justify-center text-outline-variant hover:border-primary hover:text-primary transition-all duration-300">
                  <span className="material-symbols-outlined text-3xl">add</span>
                </button>
              </div>
            </section>
          </div>

          {/* Sidebar: Order Summary */}
          <aside className="lg:w-96 space-y-6">
            <div className="bg-surface-container-highest rounded-xl p-10 sticky top-32 shadow-[0_40px_80px_rgba(0,0,0,0.05)] border border-white/40">
              <h2 className="text-2xl font-headline font-extrabold text-on-surface mb-8 tracking-tight">Order Summary</h2>
              <div className="space-y-4 mb-10">
                <div className="flex justify-between items-center text-stone-600 font-body">
                  <span>Subtotal</span>
                  <span className="font-semibold text-on-surface">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-stone-600 font-body">
                  <span>Campus Delivery</span>
                  <span className="font-semibold text-on-surface">₹{delivery.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-stone-600 font-body">
                  <span>Tax</span>
                  <span className="font-semibold text-on-surface">₹{tax.toFixed(2)}</span>
                </div>
                <div className="pt-6 mt-6 border-t border-outline-variant/30 flex justify-between items-end">
                  <div className="flex flex-col">
                    <span className="text-xs uppercase tracking-widest text-secondary font-bold">Total Amount</span>
                    <span className="text-4xl font-headline font-extrabold text-teal-800 tracking-tighter">₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <button
                  onClick={async () => {
                    if (cart.length === 0) return;
                    setIsPlacingOrder(true);
                    try {
                      const order = await placeOrder(undefined, cart, total);
                      clearCart();
                      router.push(`/order-status/${order.id}`);
                    } catch (e) {
                      console.error(e);
                      alert("Order failed.");
                    } finally { setIsPlacingOrder(false); }
                  }}
                  disabled={isPlacingOrder || cart.length === 0}
                  className="w-full bg-gradient-to-br from-primary to-primary-container text-on-primary py-5 rounded-full font-headline font-bold text-lg shadow-[0_10px_20px_rgba(43,100,108,0.2)] active:scale-95 transition-all duration-200 hover:shadow-[0_15px_30px_rgba(43,100,108,0.3)] flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  <span>{isPlacingOrder ? 'Processing...' : 'Place Order'}</span>
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
                <p className="text-center text-stone-500 text-xs font-body px-4">
                  By placing this order, you agree to our <Link href="#" className="underline underline-offset-2">Campus Dining Terms</Link>.
                </p>
              </div>
            </div>
            {/* Reward Section */}
            <div className="bg-secondary-container/20 rounded-xl p-6 border border-secondary-container/30 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              </div>
              <div>
                <h4 className="font-headline font-bold text-on-secondary-container">Campus Rewards</h4>
                <p className="text-sm text-on-secondary-container/80 font-medium">Earn +45 points with this bite.</p>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <BottomMobileNav activeTab="cart" />
    </div>
  );
}
