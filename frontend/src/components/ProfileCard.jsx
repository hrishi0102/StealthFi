import React, { useState } from "react";
import {
  User,
  CheckCircle,
  Copy,
  ExternalLink,
  Shield,
  Lock,
  Database,
} from "lucide-react";

const ProfileCard = ({ address }) => {
  const [copySuccess, setCopySuccess] = useState(false);

  const copyAddress = async () => {
    await navigator.clipboard.writeText(address);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-xl p-6">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="h-12 w-12 bg-indigo-500/10 rounded-full flex items-center justify-center">
          <User className="h-6 w-6 text-indigo-400" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-white">Your Profile</h3>
          <p className="text-sm text-gray-400">Verified Investor Dashboard</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Wallet Address */}
        <div>
          <p className="text-sm text-gray-400 mb-2">Wallet Address</p>
          <div className="flex items-center space-x-2">
            <code className="bg-gray-900/50 px-3 py-2 rounded-lg flex-grow text-indigo-300 font-mono">
              {address}
            </code>
            <button
              onClick={copyAddress}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              title="Copy address"
            >
              {copySuccess ? (
                <CheckCircle className="h-5 w-5 text-green-400" />
              ) : (
                <Copy className="h-5 w-5 text-gray-400" />
              )}
            </button>
            <a
              href={`https://explorer.base.org/address/${address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              title="View on explorer"
            >
              <ExternalLink className="h-5 w-5 text-gray-400" />
            </a>
          </div>
        </div>

        {/* Status */}
        <div>
          <p className="text-sm text-gray-400 mb-2">Status</p>
          <div className="flex items-center space-x-2 text-green-400">
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">Verified Investor</span>
          </div>
        </div>

        {/* Privacy Features */}
        <div className="space-y-4 pt-4 border-t border-gray-700">
          <div className="flex items-start space-x-3">
            <Shield className="h-5 w-5 text-indigo-400 mt-1 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-300">
                Your income verification is secured using zero-knowledge proofs,
                ensuring your financial data remains completely private while
                maintaining verifiable proof of qualification.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Database className="h-5 w-5 text-indigo-400 mt-1 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-300">
                All sensitive financial data is encrypted and distributed across
                multiple secure nodes using advanced privacy-preserving
                technology, ensuring maximum security and confidentiality.
              </p>
            </div>
          </div>
        </div>

        {/* Security Badge */}
        <div className="bg-indigo-500/10 rounded-lg p-4 flex items-center space-x-3">
          <Lock className="h-6 w-6 text-indigo-400" />
          <p className="text-sm text-indigo-300">
            Your data is protected with enterprise-grade privacy technology
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
