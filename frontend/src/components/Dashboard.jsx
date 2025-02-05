import React, { useState } from "react";
import { useAppKitAccount } from "@reown/appkit/react";
import InvestmentForm from "../components/InvestmentForm";
import Recommendations from "../components/Recommendations";
import { User, CheckCircle, Copy, ExternalLink } from "lucide-react";
import ProfileCard from "./ProfileCard";

const Dashboard = () => {
  const { address } = useAppKitAccount();
  const [preferences, setPreferences] = useState({
    riskTolerance: 1,
    investmentHorizon: 1,
    preferredSectors: [],
    investmentGoals: [],
  });

  const [copySuccess, setCopySuccess] = useState(false);

  const handlePreferencesUpdate = (newPreferences) => {
    setPreferences(newPreferences);
  };

  const copyAddress = async () => {
    await navigator.clipboard.writeText(address);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Upper Section - Profile and Investment Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Profile Card */}
          <ProfileCard address={address} />

          {/* Investment Form Card */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-6">
              Investment Preferences
            </h3>
            <InvestmentForm
              onPreferencesUpdate={handlePreferencesUpdate}
              currentPreferences={preferences}
            />
          </div>
        </div>

        {/* Lower Section - AI Recommendations */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-white">
                AI Investment Recommendations
              </h3>
              <p className="text-sm text-gray-400 mt-1">
                Personalized investment strategies based on your preferences
              </p>
            </div>
          </div>
          <div className="bg-gray-900/50 rounded-lg">
            <Recommendations
              preferences={preferences}
              onError={(error) => console.error("Recommendation error:", error)}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
