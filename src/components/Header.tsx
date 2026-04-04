"use client";

export default function Header() {
  return (
    <header className="fixed top-0 w-full z-40 bg-background/60 backdrop-blur-xl border-b border-white/5 px-6 h-20 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-teal-500 p-[1px]">
          <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-xl">person</span>
          </div>
        </div>
        <div>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Good Morning</p>
          <p className="text-sm font-light text-on-background">Bennett Student</p>
        </div>
      </div>

      <div className="flex gap-4">
        <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-primary transition-colors">
          <span className="material-symbols-outlined">search</span>
        </button>
        <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-primary transition-colors">
          <span className="material-symbols-outlined text-[20px]">tune</span>
        </button>
      </div>
    </header>
  );
}