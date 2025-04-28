// components/AdminLayout.jsx
import TopBar from './AdminNavbar';
import AdminSidebar from './AdminSidebar';

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen flex bg-gray-100">
      <AdminSidebar />
      <div className="flex-1">
        <TopBar />
        
      </div>
    </div>
  );
}