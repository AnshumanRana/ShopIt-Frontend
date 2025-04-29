import { SignUp } from '@clerk/nextjs';
import React from 'react';

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
      <div className="bg-white/30 backdrop-blur-md p-8 rounded-xl shadow-lg border border-white/30 w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Create Account</h1>
          <p className="text-sm text-gray-600 mt-2">Join ShopIT to start shopping or selling</p>
        </div>
        
        <div className="clerk-signup-container">
          <SignUp
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "bg-transparent shadow-none",
                header: "hidden",
                footer: "text-center text-sm text-gray-600",
                formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200",
                formFieldInput: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/70",
                formFieldLabel: "text-gray-700 font-medium",
                socialButtonsBlockButton: "border border-gray-300 hover:bg-gray-50 font-medium rounded-lg py-2 transition-all duration-200",
                socialButtonsProviderIcon: "w-5 h-5 mr-2",
                dividerLine: "bg-gray-300",
                dividerText: "text-gray-500 px-2",
                formFieldAction: "text-blue-600 hover:text-blue-800",
                formFieldErrorText: "text-red-500 text-sm mt-1",
                identityPreviewText: "text-gray-700",
                identityPreviewEditButton: "text-blue-600 hover:text-blue-800",
              }
            }}
            redirectUrl="/dashboard"
            signInUrl="/sign-in"
          />
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <a href="/sign-in" className="text-blue-600 hover:text-blue-800 font-medium">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}