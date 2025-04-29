import React from 'react';
import { useUser, SignOutButton } from '@clerk/nextjs';
import { BiSearch } from 'react-icons/bi';

export default function AdminNavbar() {
  const { user } = useUser();
  
  return (
    <nav className="py-4 fixed top-0 left-64 right-0 z-30 bg-white/40 backdrop-blur-md border-b border-white/30 shadow-sm">
      <div className="container mx-auto px-6 flex justify-between items-center">
        <div className="relative">
          <BiSearch className="absolute left-3 top-2.5 text-black" />
          <input
            type="search"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 bg-white/40 backdrop-blur-sm text-black border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent placeholder-white/70"
          />
        </div>
        
        <div className="flex items-center space-x-4">
          <span className="text-black font-medium">Welcome, {user?.firstName}</span>
          <SignOutButton>
            <button className="bg-white/20 hover:bg-white/40  px-4 py-2 rounded-xl transition-all duration-200 backdrop-blur-sm  text-black border border-white/40">
              Log Out
            </button>
          </SignOutButton>
        </div>
      </div>
    </nav>
  );
}