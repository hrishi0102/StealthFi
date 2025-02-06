import React from "react";
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { Wallet } from "lucide-react";

const ConnectWallet = () => {
  const { open } = useAppKit();
  const { isConnected } = useAppKitAccount();

  const handleConnect = async () => {
    try {
      await open();
      if (isConnected) {
        localStorage.setItem("walletConnected", "true");
      }
    } catch (error) {
      console.error("Connection error:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="max-w-md w-full space-y-8 p-8 bg-gray-800 rounded-lg border border-gray-700 shadow-xl">
        {/* Logo/Icon */}
        <div className="flex justify-center">
          <div className="h-16 w-16 bg-indigo-500/10 rounded-full flex items-center justify-center">
            <Wallet className="h-8 w-8 text-indigo-400" />
          </div>
        </div>

        {/* Header Text */}
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-white">
            Private Investment Advisor
          </h2>
          <p className="mt-4 text-center text-gray-400">
            Your personal AI-powered investment assistant
          </p>
          <p className="mt-2 text-center text-sm text-gray-500">
            Connect your wallet to get started
          </p>
        </div>

        {/* Connect Button */}
        <div className="mt-8">
          <button
            onClick={handleConnect}
            className="group relative w-full flex items-center justify-center px-4 py-3 border border-transparent 
                     text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 
                     focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 
                     focus:ring-offset-gray-800 transform transition-all duration-150 hover:scale-[1.02]
                     shadow-[0_0_15px_rgba(79,70,229,0.1)]"
          >
            <Wallet className="h-4 w-4 mr-2" />
            Connect Wallet
          </button>
        </div>

        {/* Footer Text */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            By connecting your wallet, you agree to our Terms of Service and
            Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConnectWallet;
