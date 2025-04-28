import React from 'react';
import Link from 'next/link';
import { TbCategory, TbCategoryMinus, TbCategoryPlus } from "react-icons/tb";
import { RiDashboardLine } from "react-icons/ri";

export default function AdminSidebar() {
  return (
    <div className="w-64 h-full bg-white border-r border-gray-200 shadow-md fixed top-0 left-0 z-40">
      <div className="pt-6 pb-4 px-6">
        <Link href="/admin" className="text-2xl font-bold text-blue-600">ShopIT Admin</Link>
      </div>
      
      <aside
        id="admin-sidebar"
        className="h-screen overflow-y-auto px-4 py-6"
        aria-label="Admin Sidebar"
      >
        <ul className="space-y-4 font-medium text-black">
          <li>
            <Link
              href="#"
              className="flex items-center p-3 rounded-lg transition-all duration-200 hover:bg-gray-100 hover:text-blue-600 hover:scale-105"
            >
              <RiDashboardLine className="w-5 h-5 text-gray-600" />
              <span className="ml-3">Dashboard</span>
            </Link>
          </li>
          
          <li>
            <Link
              href="/admin/products"
              className="flex items-center p-3 rounded-lg transition-all duration-200 hover:bg-gray-100 hover:text-blue-600 hover:scale-110"
            >
              <TbCategory className="w-5 h-5 text-gray-600" />
              <span className="ml-3">Products</span>
            </Link>
          </li>
          
          <li>
            <Link
              href="/admin/categories"
              className="flex items-center p-3 rounded-lg transition-all duration-200 hover:bg-gray-100 hover:text-blue-600 hover:scale-110"
            >
              <TbCategoryPlus className="w-5 h-5 text-gray-600" />
              <span className="ml-3">Categories</span>
            </Link>
          </li>
          
          <li>
            <Link
              href="/admin/subcategory"
              className="flex items-center p-3 rounded-lg transition-all duration-200 hover:bg-gray-100 hover:text-blue-600 hover:scale-110"
            >
              <TbCategoryMinus className="w-5 h-5 text-gray-600" />
              <span className="ml-3">Subcategories</span>
            </Link>
          </li>
        </ul>
      </aside>
    </div>
  );
}