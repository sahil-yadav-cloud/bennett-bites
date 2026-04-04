"use client";

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const email = studentId.includes('@') ? studentId : `${studentId}@bennett.edu.in`;
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        alert(error.message);
      } else {
        router.push('/');
      }
    } catch (e) {
      alert(e instanceof Error ? e.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-login-background min-h-screen flex items-center justify-center p-6 selection:bg-login-primary-container selection:text-login-on-primary-container font-headline relative overflow-hidden">
      {/* Blurred Background Elements */}
      <div className="fixed inset-0 overflow-hidden -z-10 pointer-events-none">
        <div className="absolute -top-[10%] -left-[5%] w-[40%] h-[40%] bg-login-primary/10 rounded-full blur-[120px]"></div>
        <div className="absolute top-[60%] -right-[10%] w-[50%] h-[50%] bg-login-secondary/10 rounded-full blur-[150px]"></div>
      </div>

      {/* Main Login Container */}
      <main className="w-full max-w-lg relative group">
        {/* Branding & Easter Egg */}
        <div className="flex flex-col items-center mb-8 relative cursor-default">
          <h1 className="text-4xl font-extrabold text-login-primary italic tracking-tighter transition-all duration-300 group-hover:tracking-tight">
            Bennett Bites
          </h1>
          <p className="text-login-on-surface-variant font-medium tracking-wide text-sm mt-1 uppercase opacity-60">Campus Delivery Reinvented</p>
        </div>

        {/* Glass Card */}
        <div className="bg-white/65 backdrop-blur-[40px] border border-login-outline-variant/20 rounded-xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
          {/* Welcome Header */}
          <div className="mb-10 text-center">
            <div className="inline-flex items-center gap-3 mb-2">
              <h2 className="text-3xl font-extrabold text-login-on-surface tracking-tight">Welcome Back</h2>
              <span className="text-3xl inline-block transition-transform duration-500 hover:rotate-[20deg] origin-bottom-right">👋</span>
            </div>
            <p className="text-login-on-surface-variant/80 font-medium">Ready for your next campus craving?</p>
          </div>

          {/* Login Form */}
          <form className="space-y-6" onSubmit={handleLogin}>
            {/* Student ID Field */}
            <div className="space-y-2">
              <label className="block text-xs font-extrabold text-login-on-surface-variant uppercase tracking-[0.1em] ml-1">Student ID</label>
              <div className="relative group/input">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-login-outline group-focus-within/input:text-login-primary transition-colors">badge</span>
                </div>
                <input
                  className="w-full h-14 pl-12 pr-4 bg-login-surface-container-high/40 rounded-lg border-none focus:ring-2 focus:ring-login-primary/20 focus:bg-login-surface-container-lowest transition-all duration-300 font-semibold text-login-on-surface placeholder:text-login-outline-variant"
                  placeholder="e.g. 2023CS001"
                  type="text"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-extrabold text-login-on-surface-variant uppercase tracking-[0.1em]">Password</label>
                <Link href="#" className="text-xs font-bold text-login-primary hover:opacity-70 transition-opacity">Forgot?</Link>
              </div>
              <div className="relative group/input">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-login-outline group-focus-within/input:text-login-primary transition-colors">lock</span>
                </div>
                <input
                  className="w-full h-14 pl-12 pr-4 bg-login-surface-container-high/40 rounded-lg border-none focus:ring-2 focus:ring-login-primary/20 focus:bg-login-surface-container-lowest transition-all duration-300 font-semibold text-login-on-surface placeholder:text-login-outline-variant"
                  placeholder="••••••••"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 mt-4 bg-gradient-to-br from-login-primary to-login-primary-container text-login-on-primary font-extrabold rounded-xl shadow-lg shadow-login-primary/20 hover:scale-[0.98] active:scale-[0.92] transition-all duration-300 hover:shadow-[0_0_20px_rgba(254,170,0,0.4)] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
              <span className="material-symbols-outlined text-xl">arrow_forward</span>
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-10 flex items-center py-1">
            <div className="flex-grow border-t border-login-outline-variant/20"></div>
            <span className="flex-shrink mx-4 text-[10px] font-black text-login-outline-variant uppercase tracking-[0.2em]">or continue with</span>
            <div className="flex-grow border-t border-login-outline-variant/20"></div>
          </div>

          {/* SSO Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => supabase.auth.signInWithOAuth({ provider: 'google' })}
              className="flex items-center justify-center gap-3 h-14 bg-login-surface-container-lowest/50 backdrop-blur-[40px] border border-login-outline-variant/20 rounded-lg hover:scale-[0.98] active:scale-[0.92] transition-all duration-300 group"
            >
              <img
                alt="Google Logo"
                className="w-5 h-5 opacity-80 group-hover:opacity-100 transition-opacity"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAaDcn6zxa6wYmQM8offv1k6iKgHlzFQtYxkmztu_jIE-NvTDviwJffoXLDpHr_nGOnvLwkS67oqn6tZO9JjYTUjPZCjMeSXRanVWwskdmpEkc0ne6pPga83ZA8wufy29NcUYLZ9hvMvh4J05rKUYBc6K7k0pr5EMc0OXAQiWz151zVq3bmEL8MmINnl4K15uT4hm_mpWqPvfJm5W7wFokHrGF8DNhjYBs5Cm4zOnhysvCtholUz9tJ4RAShw8Lz1CG1HN3_lCxa80"
              />
              <span className="text-sm font-bold text-login-on-surface tracking-tight">Google</span>
            </button>
            <button
              onClick={() => alert("Azure SSO integration pending.")}
              className="flex items-center justify-center gap-3 h-14 bg-login-surface-container-lowest/50 backdrop-blur-[40px] border border-login-outline-variant/20 rounded-lg hover:scale-[0.98] active:scale-[0.92] transition-all duration-300 group"
            >
              <span className="material-symbols-outlined text-login-secondary text-2xl">school</span>
              <span className="text-sm font-bold text-login-on-surface tracking-tight">Campus ID</span>
            </button>
          </div>
        </div>

        {/* Footer Link */}
        <div className="mt-10 text-center">
          <p className="text-login-on-surface-variant font-medium">
            New to Bennett Bites?
            <Link href="#" className="ml-2 text-login-primary font-extrabold hover:underline underline-offset-4 decoration-2 transition-all">Create an account</Link>
          </p>
        </div>

        {/* Decorative Artifacts */}
        <div className="absolute -top-6 -right-6 w-20 h-20 bg-login-secondary-container rounded-lg rotate-[15deg] -z-20 opacity-40 blur-sm"></div>
        <div className="absolute -bottom-4 -left-8 w-24 h-24 bg-login-tertiary-container rounded-full -z-20 opacity-30 blur-sm"></div>
      </main>
    </div>
  );
}
