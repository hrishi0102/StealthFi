import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { generateProof, verifyProof } from "../utils/api";
import { useAppKitAccount } from "@reown/appkit/react";
import {
  LockKeyhole,
  CheckCircle2,
  ArrowRight,
  DollarSign,
} from "lucide-react";

const INCOME_THRESHOLD = 50000;

const IncomeVerification = ({ onVerified }) => {
  const [income, setIncome] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [verificationComplete, setVerificationComplete] = useState(false);
  const { address } = useAppKitAccount();
  const navigate = useNavigate();

  const handleVerification = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userIncome = parseInt(income);
      const proofResponse = await generateProof(userIncome, INCOME_THRESHOLD);
      const verificationResponse = await verifyProof(
        proofResponse.proof,
        proofResponse.publicSignals
      );

      if (verificationResponse.isValid) {
        localStorage.setItem(`verified_${address}`, "true");
        setVerificationComplete(true);
      } else {
        setError(
          "Income verification failed. Please ensure you meet the minimum requirements."
        );
      }
    } catch (err) {
      setError("An error occurred during verification. Please try again.");
      console.error("Verification error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEnterDapp = () => {
    onVerified();
    navigate("/home");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="max-w-md w-full space-y-8 p-8 bg-gray-800 rounded-lg border border-gray-700 shadow-xl">
        {/* Icon & Header */}
        <div className="flex flex-col items-center">
          <div className="h-16 w-16 bg-indigo-500/10 rounded-full flex items-center justify-center mb-6">
            <LockKeyhole className="h-8 w-8 text-indigo-400" />
          </div>
          <h2 className="text-center text-3xl font-extrabold text-white">
            ZK-Income Verification
          </h2>
          <p className="mt-4 text-center text-gray-400">
            Please verify your annual income using zero-knowledge proofs
          </p>
          <p className="mt-2 text-center text-sm text-indigo-400 font-medium">
            Minimum requirement: ${INCOME_THRESHOLD.toLocaleString()}
          </p>
        </div>

        {!verificationComplete ? (
          <form className="mt-8 space-y-6" onSubmit={handleVerification}>
            <div className="relative">
              <label htmlFor="income" className="sr-only">
                Annual Income
              </label>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign className="h-5 w-5 text-gray-500" />
              </div>
              <input
                id="income"
                name="income"
                type="number"
                required
                className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-600 
                         rounded-lg bg-gray-700 text-gray-100 placeholder-gray-400
                         focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                         transition duration-150 ease-in-out"
                placeholder="Enter your annual income"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                disabled={loading}
              />
            </div>

            {error && (
              <div className="flex items-center justify-center space-x-2 text-red-400 bg-red-900/20 p-3 rounded-lg">
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm">{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !income}
              className={`group relative w-full flex items-center justify-center px-4 py-3 border
                       border-transparent text-sm font-medium rounded-lg text-white
                       transition-all duration-150 ease-in-out transform hover:scale-[1.02]
                       ${
                         loading || !income
                           ? "bg-gray-600 cursor-not-allowed"
                           : "bg-indigo-600 hover:bg-indigo-700 shadow-lg hover:shadow-indigo-500/30"
                       }`}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Verifying...
                </span>
              ) : (
                "Verify Income"
              )}
            </button>
          </form>
        ) : (
          <div className="mt-8 space-y-8">
            {/* Success Animation */}
            <div className="flex flex-col items-center pt-4 pb-8">
              <div className="relative">
                <div className="h-24 w-24 rounded-full bg-green-500/10 flex items-center justify-center">
                  <CheckCircle2 className="h-12 w-12 text-green-400" />
                </div>
                <div className="absolute -top-2 -right-2">
                  <div className="h-6 w-6 rounded-full bg-green-500 animate-ping" />
                  <div className="h-6 w-6 rounded-full bg-green-500 absolute top-0" />
                </div>
              </div>

              <h3 className="mt-6 text-xl font-semibold text-white">
                Verification Successful!
              </h3>
              <p className="mt-2 text-gray-400 text-center">
                Your income has been verified using zero-knowledge proofs. You
                can now access the platform.
              </p>
            </div>

            <button
              onClick={handleEnterDapp}
              className="w-full flex items-center justify-center px-4 py-3 border border-transparent
                       rounded-lg text-sm font-medium text-white bg-green-600 hover:bg-green-700
                       transition-all duration-150 ease-in-out transform hover:scale-[1.02]
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500
                       focus:ring-offset-gray-800 shadow-lg hover:shadow-green-500/30"
            >
              Enter the Dapp
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default IncomeVerification;
