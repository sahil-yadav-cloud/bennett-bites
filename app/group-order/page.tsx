"use client";

import { useState } from 'react';
import TopNavBar from '@/src/components/layout/TopNavBar';
import SideNavBar from '@/src/components/layout/SideNavBar';
import BottomMobileNav from '@/src/components/layout/BottomMobileNav';

export default function GroupOrderPage() {
  const [splitStrategy, setSplitStrategy] = useState<'equal' | 'item'>('equal');

  const friends = [
    {
      name: 'Alex',
      role: 'Host',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBzg1Vk9rPr9cFYQoUvF9YsxIUGK3bkGzWs4nqB-S-fjhTgaW-SRTRdn8tfqiLgOkpR7rJXKLalWTJgfhZ9l4WlN-ILoprekX2tNfOoyJv7cLr9u0aLjEzmrMZGaFVmfTLqujrAhGPwezCPjMtALittXsVoluEYg7AHdQVuBDPeYMyA5te7wc0xwUk1nRsq6sxiGiVZZj1uXCesG7i1DFY2LdkVvj_NEOiLa8yegrGfc2RCjk8TH85CtClpiFqxTj6qwEDLENO-KvQ',
      total: 24.50,
      items: [
        { name: 'Avocado Sourdough Crunch', desc: 'Extra chili flakes, poached egg', price: 14.00 },
        { name: 'Iced Lavender Matcha', desc: 'Oat milk, light ice', price: 6.50 },
        { name: 'Truffle Parm Fries', desc: 'Shared portion', price: 4.00 }
      ],
      status: 'Ready to order'
    },
    {
      name: 'Sam',
      role: 'Guest',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB84lSgc2a54AMtqyJNF1dirw9QtQ4lT91sXzkwaGgfhIBq5ckPDRGnzGXM8gUwv-SS4A4NyggNxU0-kdIPGotubuARRV1NDYvehbQgvizC4rnB6WA_m6EV-BKJOSWxT1d4biVCuuD3wRA_XCynaE-aXddZBqfQcQfTZCS-0EavXlCdKh1cE4xHyt1sqDyABwBF54mwOIoTUSnWxkBDLn69vJVzQClqxndcQB_lSCjarhu0S2DoGkTXy0paVQBkJR-AqVTa38bgprw',
      total: 18.20,
      items: [
        { name: 'Korean Fried Chicken Bowl', desc: 'Brown rice, extra kimchi', price: 15.00 },
        { name: 'Pecan Tart', desc: 'Warm', price: 3.20 }
      ],
      status: 'Active Now',
      isEditing: true
    }
  ];

  return (
    <main className="min-h-screen bg-background text-on-surface font-body relative overflow-x-hidden">
      <TopNavBar />
      <SideNavBar />

      <main className="pt-28 pb-20 px-6 max-w-7xl mx-auto lg:ml-72">
        {/* Header Section */}
        <header className="mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-5xl font-extrabold font-headline tracking-tight text-primary mb-2">Campus Shared Cart</h1>
              <p className="text-lg text-tertiary-container max-w-md">Collaborating on a feast for the study session. Split the cost, share the joy.</p>
            </div>
            <div className="flex gap-4">
              <button className="flex items-center gap-2 bg-white text-primary border border-outline-variant/30 px-6 py-3 rounded-full font-semibold shadow-sm hover:translate-y-[-2px] transition-all">
                <span className="material-symbols-outlined text-xl">person_add</span>
                Invite Friends
              </button>
              <button className="bg-primary text-on-primary px-8 py-3 rounded-full font-bold shadow-[0_20px_40px_rgba(43,100,108,0.1)] hover:opacity-90 transition-all flex items-center gap-2">
                Checkout
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </div>
        </header>

        {/* Split Strategy Toggle */}
        <section className="mb-12 bg-surface-container-low p-2 rounded-full inline-flex gap-2 font-headline">
          <button
            onClick={() => setSplitStrategy('equal')}
            className={`${splitStrategy === 'equal' ? 'bg-primary text-on-primary shadow-md' : 'text-tertiary hover:bg-surface-container-high'} px-8 py-2.5 rounded-full font-semibold text-sm transition-all`}
          >
            Equal Split
          </button>
          <button
            onClick={() => setSplitStrategy('item')}
            className={`${splitStrategy === 'item' ? 'bg-primary text-on-primary shadow-md' : 'text-tertiary hover:bg-surface-container-high'} px-8 py-2.5 rounded-full font-semibold text-sm transition-all`}
          >
            Item-based Split
          </button>
        </section>

        {/* Bento Grid of Friends' Carts */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {friends.map((friend, i) => (
            <div key={i} className="md:col-span-4 group">
              <div className={`rounded-xl p-8 border transition-all hover:translate-y-[-4px] ${friend.isEditing ? 'bg-surface-container-low border-white/20 hover:bg-white/90 hover:shadow-xl' : 'bg-white/80 backdrop-blur-lg shadow-[0_20px_40px_rgba(43,100,108,0.06)] border-white/50'}`}>
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-full border-2 overflow-hidden ${friend.role === 'Host' ? 'border-secondary' : 'border-primary-container'}`}>
                      <img alt={friend.name} className="w-full h-full object-cover" src={friend.avatar} />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl text-on-surface">{friend.name}</h3>
                      <span className={`text-xs font-bold tracking-widest uppercase ${friend.role === 'Host' ? 'text-secondary' : 'text-primary'}`}>{friend.role}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-tertiary uppercase tracking-wider font-bold">Total</p>
                    <p className="text-xl font-extrabold text-primary">₹{friend.total.toFixed(2)}</p>
                  </div>
                </div>
                <div className="space-y-6">
                  {friend.items.map((item, j) => (
                    <div key={j} className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-bold text-on-surface">{item.name}</h4>
                        <p className="text-sm text-tertiary">{item.desc}</p>
                      </div>
                      <span className="font-bold text-on-surface-variant">₹{item.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-10 pt-6 border-t border-outline-variant/10 flex justify-between items-center">
                  {friend.isEditing ? (
                    <span className="text-xs bg-primary-fixed text-on-primary-fixed px-3 py-1 rounded-full font-bold">Active Now</span>
                  ) : (
                    <button className="text-primary text-sm font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-lg">edit</span> Edit
                    </button>
                  )}
                  <span className={`text-xs text-tertiary-container ${!friend.isEditing && 'italic'}`}>{friend.isEditing ? 'Editing...' : friend.status}</span>
                </div>
              </div>
            </div>
          ))}

          {/* Pending Friend */}
          <div className="md:col-span-4">
            <div className="bg-surface-container-high/50 rounded-xl p-8 border-2 border-dashed border-outline-variant/30 flex flex-col items-center justify-center min-h-[380px] text-center">
              <div className="w-20 h-20 bg-surface-variant rounded-full flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-4xl text-tertiary">hourglass_empty</span>
              </div>
              <h3 className="font-bold text-2xl text-on-surface mb-2">Jordan</h3>
              <p className="text-tertiary mb-8">Still browsing the menu...</p>
              <button className="bg-white border border-outline-variant text-tertiary px-6 py-2 rounded-full font-bold text-sm hover:bg-primary hover:text-white transition-all">
                Nudge Jordan
              </button>
            </div>
          </div>

          {/* Summary Card */}
          <div className="md:col-span-12 mt-12">
            <div className="bg-primary rounded-xl p-10 text-on-primary relative overflow-hidden">
              <div className="absolute -right-20 -top-20 w-80 h-80 bg-primary-container rounded-full blur-[80px] opacity-40"></div>
              <div className="absolute -left-20 -bottom-20 w-60 h-60 bg-secondary-container rounded-full blur-[80px] opacity-20"></div>
              <div className="relative z-10 grid md:grid-cols-4 gap-12 items-center">
                <div className="md:col-span-2">
                  <h2 className="text-4xl font-extrabold font-headline tracking-tighter mb-4">Final Bite Breakdown</h2>
                  <p className="text-on-primary-container opacity-80 text-lg">Subtotal: ₹427 • Delivery: ₹25 • Fees: ₹18</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
                  <p className="text-sm font-bold uppercase tracking-widest opacity-70 mb-1">Each Pays ({splitStrategy === 'equal' ? 'Equal' : 'Item-based'})</p>
                  <p className="text-4xl font-extrabold">₹156</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold uppercase tracking-widest opacity-70 mb-1">Group Total</p>
                  <p className="text-5xl font-extrabold text-secondary-fixed">₹470</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Suggested Addition */}
        <section className="mt-24 mb-12 flex flex-col md:flex-row gap-12 items-center">
          <div className="md:w-1/3">
            <span className="text-secondary font-bold tracking-widest uppercase text-sm mb-4 block">The &quot;Cherry on Top&quot;</span>
            <h2 className="text-4xl font-extrabold font-headline leading-tight text-on-surface mb-6">Missing something sweet?</h2>
            <p className="text-tertiary-container text-lg">Add a Campus Dozen to the order—30% off when ordered as a group.</p>
          </div>
          <div className="md:w-2/3 flex gap-6 overflow-x-auto pb-8 no-scrollbar -mx-4 px-4">
            {[
              { name: 'Warm Chunk Cookies', desc: 'Pack of 6, baked fresh', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDsztaXnzTScCvekDetS25kj2Zz3WZ5a67sBcRLhsVBMT1-2nI7FsokpbIcSmHyzAsov7JmLwCbKgGDmAvcGaAfuRGtgqWyGxm6VGhYT0h4o4vSW256En3Q9pvrq6wB7V4gAXz7iQJfysZjzS1bnz0fURrmgOqDSWuBsAUJNebW1YW_65cV-4obBkWkM5bQa6xNMofR9cYuctmC52a3tbKxMaaZAX2AYIkjjDxZ-_OEclzJS9jPb-Lb6jiPZzgEJIYvcnfJi8T8vO8' },
              { name: 'Fudge Brownie Tray', desc: 'Serves 4-6 students', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD0PWy0VqmW-i-kxrfXRN02-OvFfBVMaXm6aUpu6wasRDEwpC5ud3f59Ek785b5KN3OC0vE2JcPCW-hveaOFXHVsZppm4u3MLkbfAEbppncDZh8SpqXvsUw4LlHb5Zo5cW_Po8hsgkiBlzF0D4eZFb8r-zHszCw4xYe17BPCffMtWv_WY36Fj59KSd9cUdCKgm-GTOaVKNHckZo6g2Xi40OTzfDfK0wwmTyT_YifvMd0bS4C7HxrPQaYxeiK9d-MiqhtMFZaiOFVyM' }
            ].map((addon, i) => (
              <div key={i} className="flex-none w-72 bg-white rounded-xl p-6 shadow-sm border border-outline-variant/10">
                <div className="h-40 bg-surface-container rounded-lg mb-4 overflow-hidden">
                  <img alt={addon.name} className="w-full h-full object-cover" src={addon.img} />
                </div>
                <h4 className="font-bold text-lg mb-1">{addon.name}</h4>
                <p className="text-sm text-tertiary mb-4">{addon.desc}</p>
                <button className="w-full bg-secondary-fixed text-on-secondary-fixed py-3 rounded-full font-bold text-sm">Add to Shared Basket</button>
              </div>
            ))}
          </div>
        </section>
      </main>

      <BottomMobileNav />
    </main>
  );
}
