import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center" 
      style={{ backgroundImage: "url('/downloadbg.jpg')" }}
    >
      <div className="p-6 bg-white/30 backdrop-blur-md rounded-lg shadow-xl border border-white/40">
        <SignIn 
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "bg-transparent shadow-none",
              headerTitle: "text-xl font-bold text-center text-gray-800",
              headerSubtitle: "text-center text-sm text-gray-700",
              formButtonPrimary: "bg-blue-600/90 hover:bg-blue-700 text-white",
              socialButtonsBlockButton: "bg-white/70 border border-gray-200 text-gray-700 hover:bg-white/90",
              footerAction: "text-center text-sm text-gray-700",
              formFieldInput: "bg-white/70 border-gray-200",
              formFieldLabel: "text-gray-700",
              formFieldLabelRow: "text-gray-700"
            }
          }}
        />
      </div>
    </div>
  );
}