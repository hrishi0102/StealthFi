import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAppKitAccount, useAppKit } from "@reown/appkit/react";
import ConnectWallet from "./components/ConnectWallet";
import IncomeVerification from "./components/IncomeVerification";
import Dashboard from "./components/Dashboard";
import AgentChatPage from "./pages/AgentChatPage";
import Navbar from "./components/Navbar";
import ChatInterface from "./pages/ChatInterface";
import LandingPage from "./pages/LandingPage";

function App() {
  const { address, isConnected } = useAppKitAccount();
  const { open } = useAppKit();
  const [isVerified, setIsVerified] = useState(false);

  // Check for saved verification status
  useEffect(() => {
    if (isConnected && address) {
      const savedVerification = localStorage.getItem(`verified_${address}`);
      if (savedVerification === "true") {
        setIsVerified(true);
      }
    }
  }, [isConnected, address]);

  // Attempt to restore connection on page load
  useEffect(() => {
    const attemptReconnect = async () => {
      try {
        const lastConnected = localStorage.getItem("walletConnected");
        if (lastConnected === "true" && !isConnected) {
          await open();
        }
      } catch (error) {
        console.error("Failed to reconnect wallet:", error);
      }
    };

    attemptReconnect();
  }, []);

  // Save connection status
  useEffect(() => {
    if (isConnected) {
      localStorage.setItem("walletConnected", "true");
    } else {
      localStorage.removeItem("walletConnected");
      setIsVerified(false); // Reset verification when disconnected
    }
  }, [isConnected]);

  return (
    <Router>
      {!isConnected ? (
        <ConnectWallet />
      ) : !isVerified ? (
        <IncomeVerification onVerified={() => setIsVerified(true)} />
      ) : (
        <div className="min-h-screen bg-gray-100">
          {/* <Navbar /> */}
          <Routes>
            <Route path="/landing" element={<LandingPage />} />
            <Route path="/home" element={<Dashboard />} />
            <Route path="/agent-chat" element={<AgentChatPage />} />
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/chat-defi" element={<ChatInterface />} />
          </Routes>
        </div>
      )}
    </Router>
  );
}

export default App;
