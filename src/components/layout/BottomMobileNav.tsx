import Link from 'next/link';

interface BottomMobileNavProps {
  activeTab?: string;
}

export default function BottomMobileNav({ activeTab = 'dashboard' }: BottomMobileNavProps) {
  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full bg-white/70 backdrop-blur-xl z-[60] flex justify-around items-center py-4 px-2 shadow-[0_-20px_40px_rgba(0,0,0,0.05)]">
      <Link href="/" className={`flex flex-col items-center gap-1 ${activeTab === 'dashboard' ? 'text-teal-800 font-semibold bg-teal-50 px-4 py-2 rounded-full' : 'text-stone-500'}`}>
        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>analytics</span>
        <span className="text-[10px]">Dashboard</span>
      </Link>
      <Link href="/menu" className={`flex flex-col items-center gap-1 ${activeTab === 'menu' ? 'text-teal-800' : 'text-stone-500'}`}>
        <span className="material-symbols-outlined">restaurant</span>
        <span className="text-[10px]">Menu</span>
      </Link>
      <Link href="/past-orders" className={`flex flex-col items-center gap-1 ${activeTab === 'history' ? 'text-teal-800' : 'text-stone-500'}`}>
        <span className="material-symbols-outlined">history</span>
        <span className="text-[10px]">History</span>
      </Link>
      <Link href="/ai" className={`flex flex-col items-center gap-1 ${activeTab === 'ai' ? 'text-teal-800' : 'text-stone-500'}`}>
        <span className="material-symbols-outlined">auto_awesome</span>
        <span className="text-[10px]">AI</span>
      </Link>
      <Link href="/settings" className={`flex flex-col items-center gap-1 ${activeTab === 'settings' ? 'text-teal-800' : 'text-stone-500'}`}>
        <span className="material-symbols-outlined">tune</span>
        <span className="text-[10px]">Settings</span>
      </Link>
    </div>
  );
}
