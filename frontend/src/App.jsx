import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAppKitAccount } from "@reown/appkit/react";
import ConnectWallet from "./components/ConnectWallet";
import IncomeVerification from "./components/IncomeVerification";
import Dashboard from "./components/Dashboard";
import AgentChatPage from "./pages/AgentChatPage";
import Navbar from "./components/Navbar";
import ChatInterface from "./pages/ChatInterface";

function App() {
  const { isConnected } = useAppKitAccount();
  const [isVerified, setIsVerified] = React.useState(false);

  return (
    <Router>
      {!isConnected ? (
        <ConnectWallet />
      ) : !isVerified ? (
        <IncomeVerification onVerified={() => setIsVerified(true)} />
      ) : (
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <Routes>
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
