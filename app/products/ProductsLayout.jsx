// // app/products/layout.jsx
// import ClientSidebar from '../Components/ClientSidebar';

// export default function ProductsLayout({ children }) {
//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="container mx-auto px-4 py-8">
//         <div className="flex flex-col md:flex-row gap-8">
//           {/* Sidebar only visible on desktop */}
//           <div className="hidden md:block">
//             <ClientSidebar />
//           </div>
          
//           {/* Main Content */}
//           <div className="flex-1">
//             {children}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }