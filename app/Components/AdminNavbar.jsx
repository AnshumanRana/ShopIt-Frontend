import React from 'react';
import { useUser, SignOutButton } from '@clerk/nextjs';
import { BiSearch } from 'react-icons/bi';

export default function AdminNavbar() {
  const { user } = useUser();

  return (
    <nav className="bg-white shadow-md py-4 fixed top-0 left-64 right-0 z-30">
      <div className="container mx-auto px-6 flex justify-between items-center">
        <div className="relative">
          <BiSearch className="absolute left-3 top-2.5 text-gray-400" />
          <input 
            type="search" 
            placeholder="Search..." 
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div className="flex items-center space-x-4">
          <span className="text-gray-700">Welcome, {user?.firstName}</span>
          <SignOutButton>
            <button className="bg-blue-500 text-white hover:bg-blue-600 px-4 py-2 rounded-xl transition-all duration-200">
              Log Out
            </button>
          </SignOutButton>
        </div>
      </div>
    </nav>
  );
}