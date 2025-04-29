// components/AdminLayout.jsx
import TopBar from './AdminNavbar';
import AdminSidebar from './AdminSidebar';

export default function AdminLayout({ children }) {
  return (
    <div 
      className="min-h-screen flex relative overflow-hidden"
      style={{
        backgroundImage: "url('/adminbg.jpg')", // Update with your image path
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Overlay to improve text readability if needed */}
      <div className="absolute inset-0 bg-black/10 z-0"></div>
      
      {/* Sidebar with glassmorphism effect */}
      <AdminSidebar />
      
      {/* Main content area */}
      <div className="flex-1 pl-64 z-10 relative"> {/* Added pl-64 to account for sidebar width */}
        {/* TopBar with glassmorphism effect */}
        <div className="sticky top-0 z-20">
          <TopBar className="bg-white/20 backdrop-blur-md border-b border-white/30 shadow-sm" />
        </div>
        
        {/* Content area - ensuring it's positioned over the background */}
        <main className="p-6 relative z-10">
          {children}
        </main>
      </div>
    </div>
  );
}