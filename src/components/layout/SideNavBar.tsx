import Link from 'next/link';

export default function SideNavBar() {
  return (
    <aside className="hidden lg:flex fixed left-0 top-0 h-full w-72 flex-col py-8 z-[60] bg-stone-50/95 backdrop-blur-2xl rounded-r-lg border-r border-stone-200/20 shadow-[40px_0_80px_rgba(0,0,0,0.05)]">
      <div className="px-8 mb-12">
        <h2 className="text-xl font-bold text-teal-800 font-headline">Bennett Bites</h2>
        <p className="text-xs text-stone-500 font-medium">The Curated Campus</p>
      </div>
      <nav className="flex-1 space-y-2">
        <Link href="/menu" className="flex items-center gap-4 text-stone-600 px-6 py-3 hover:translate-x-2 transition-all duration-300 ease-out">
          <span className="material-symbols-outlined">restaurant</span>
          <span className="font-body text-sm tracking-wide">Menu</span>
        </Link>
        <Link href="/group-order" className="flex items-center gap-4 bg-teal-50 text-teal-800 rounded-full mx-4 px-4 py-3 font-semibold shadow-sm">
          <span className="material-symbols-outlined">groups</span>
          <span className="font-body text-sm tracking-wide">Group Order</span>
        </Link>
        <Link href="/past-orders" className="flex items-center gap-4 text-stone-600 px-6 py-3 hover:translate-x-2 transition-all duration-300 ease-out">
          <span className="material-symbols-outlined">history</span>
          <span className="font-body text-sm tracking-wide">Past Orders</span>
        </Link>
        <Link href="/saved" className="flex items-center gap-4 text-stone-600 px-6 py-3 hover:translate-x-2 transition-all duration-300 ease-out">
          <span className="material-symbols-outlined">bookmark</span>
          <span className="font-body text-sm tracking-wide">Saved Bites</span>
        </Link>
        <Link href="/rewards" className="flex items-center gap-4 text-stone-600 px-6 py-3 hover:translate-x-2 transition-all duration-300 ease-out">
          <span className="material-symbols-outlined">auto_awesome</span>
          <span className="font-body text-sm tracking-wide">Campus Rewards</span>
        </Link>
      </nav>
      <div className="px-6 mt-auto">
        <Link href="/menu" className="block w-full bg-primary text-on-primary py-4 rounded-full font-bold shadow-lg active:opacity-80 transition-opacity text-center">
          Order Now
        </Link>
      </div>
    </aside>
  );
}
