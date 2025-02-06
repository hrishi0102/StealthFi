import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAppKitAccount } from "@reown/appkit/react";

const Navbar = () => {
  const { address } = useAppKitAccount();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/home" className="text-xl font-bold text-white">
              Investment Advisor
            </Link>

            <div className="ml-10 flex items-center space-x-4">
              <Link
                to="/home"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive("/home")
                    ? "bg-gray-900 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                Home
              </Link>
              <Link
                to="/agent-chat"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive("/agent-chat")
                    ? "bg-gray-900 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                Onchain Agent
              </Link>
              <Link
                to="/chat-defi"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive("/agent-chat")
                    ? "bg-gray-900 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                Defi Agent
              </Link>
            </div>
          </div>

          <div className="flex items-center">
            <div className="bg-gray-900 px-4 py-2 rounded-md">
              <span className="text-gray-400 text-sm mr-2">Connected:</span>
              <span className="text-gray-200 text-sm font-medium">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
