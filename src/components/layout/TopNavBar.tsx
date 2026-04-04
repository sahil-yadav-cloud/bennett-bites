import Link from 'next/link';

export default function TopNavBar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl shadow-[0_20px_40px_rgba(43,100,108,0.06)] bg-gradient-to-b from-stone-100/10 to-transparent">
      <div className="flex justify-between items-center w-full px-6 py-4 max-w-7xl mx-auto">
        <Link href="/" className="text-2xl font-extrabold text-teal-800 tracking-tighter font-headline">
          Bennett Bites
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <Link href="/menu" className="text-stone-500 font-medium font-body hover:bg-stone-100/50 transition-colors duration-300 px-3 py-1 rounded-full">
            Menu
          </Link>
          <Link href="/past-orders" className="text-stone-500 font-medium font-body hover:bg-stone-100/50 transition-colors duration-300 px-3 py-1 rounded-full">
            Past Orders
          </Link>
          <Link href="/" className="text-teal-800 font-bold border-b-2 border-teal-600 font-body px-3 py-1">
            Dashboard
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <button className="material-symbols-outlined text-stone-600 p-2 hover:bg-stone-100/50 rounded-full transition-all active:scale-95">
            notifications
          </button>
          <Link href="/cart" className="material-symbols-outlined text-stone-600 p-2 hover:bg-stone-100/50 rounded-full transition-all active:scale-95">
            shopping_cart
          </Link>
          <div className="w-10 h-10 rounded-full bg-surface-container-high overflow-hidden border-2 border-primary-container/20">
            <img
              className="w-full h-full object-cover"
              alt="User Profile"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBdfmzZhU9G-Rgeb5kptRX5qoMifmIj6l7f7LREIr0YTWurZfVSjXkZW3vAikCvnqWnPt7-sYExthEtRrgc6QDAZjdcxNQ9XVXfFhoyO3FXFHlbJx6pqgS_cduXCfYKqMmo5t6JZqbnLQgjeIKHsF85QUS4HV_dKVQl0OcKXTWGpKuqAd27dSDglkD6ve8_GKM0zZhsIoAUSt9FCYLr05XYx-8-idFatpUv2wdypStS70vyRI9i60Q6yPzVDFGiM6WeHgery4go-To"
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
