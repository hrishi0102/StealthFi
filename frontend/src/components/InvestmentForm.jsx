import React, { useState, useEffect } from "react";
import { useAppKitAccount } from "@reown/appkit/react";
import { nillionService } from "../utils/nillion";
import { Loader, Briefcase, Clock, BarChart3, Target } from "lucide-react";

const RISK_LEVELS = ["Conservative", "Moderate", "Aggressive"];
const INVESTMENT_HORIZONS = ["Short-term", "Medium-term", "Long-term"];
const SECTORS = [
  "Technology",
  "Healthcare",
  "Finance",
  "Energy",
  "Real Estate",
];
const GOALS = ["Growth", "Income", "Preservation", "Speculation"];

const InvestmentForm = ({ onPreferencesUpdate }) => {
  const { address } = useAppKitAccount();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [localPreferences, setLocalPreferences] = useState({
    riskTolerance: 1,
    investmentHorizon: 1,
    preferredSectors: [],
    investmentGoals: [],
  });

  useEffect(() => {
    loadPreferences();
  }, [address]);

  useEffect(() => {
    if (!loading) {
      onPreferencesUpdate?.(localPreferences);
    }
  }, [loading, localPreferences, onPreferencesUpdate]);

  const loadPreferences = async () => {
    try {
      await nillionService.init();
      const savedPrefs = await nillionService.getPreferences(address);
      if (savedPrefs) {
        setLocalPreferences({
          riskTolerance: parseInt(savedPrefs.risk_tolerance) || 1,
          investmentHorizon: parseInt(savedPrefs.investment_horizon) || 1,
          preferredSectors: savedPrefs.preferred_sectors
            ? JSON.parse(savedPrefs.preferred_sectors)
            : [],
          investmentGoals: savedPrefs.investment_goals
            ? JSON.parse(savedPrefs.investment_goals)
            : [],
        });
      }
    } catch (error) {
      console.error("Error loading preferences:", error);
      setLocalPreferences({
        riskTolerance: 1,
        investmentHorizon: 1,
        preferredSectors: [],
        investmentGoals: [],
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await nillionService.storePreferences(address, localPreferences);
    } catch (error) {
      console.error("Error saving preferences:", error);
    } finally {
      setSaving(false);
    }
  };

  const handlePreferenceChange = (key, value) => {
    setLocalPreferences((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader className="h-8 w-8 text-indigo-400 animate-spin" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Risk Tolerance */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <BarChart3 className="h-5 w-5 text-indigo-400" />
          <label className="block text-sm font-medium text-gray-200">
            Risk Tolerance
          </label>
        </div>
        <select
          value={localPreferences.riskTolerance}
          onChange={(e) =>
            handlePreferenceChange("riskTolerance", parseInt(e.target.value))
          }
          className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg
                   text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500
                   focus:border-transparent transition-all duration-200"
        >
          {RISK_LEVELS.map((level, index) => (
            <option key={level} value={index + 1} className="bg-gray-700">
              {level}
            </option>
          ))}
        </select>
      </div>

      {/* Investment Horizon */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Clock className="h-5 w-5 text-indigo-400" />
          <label className="block text-sm font-medium text-gray-200">
            Investment Horizon
          </label>
        </div>
        <select
          value={localPreferences.investmentHorizon}
          onChange={(e) =>
            handlePreferenceChange(
              "investmentHorizon",
              parseInt(e.target.value)
            )
          }
          className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg
                   text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500
                   focus:border-transparent transition-all duration-200"
        >
          {INVESTMENT_HORIZONS.map((horizon, index) => (
            <option key={horizon} value={index + 1} className="bg-gray-700">
              {horizon}
            </option>
          ))}
        </select>
      </div>

      {/* Preferred Sectors */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Briefcase className="h-5 w-5 text-indigo-400" />
          <label className="block text-sm font-medium text-gray-200">
            Preferred Sectors
          </label>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {SECTORS.map((sector) => (
            <label
              key={sector}
              className={`flex items-center p-3 rounded-lg border cursor-pointer
                       transition-all duration-200 ${
                         localPreferences.preferredSectors.includes(sector)
                           ? "bg-indigo-500/20 border-indigo-500"
                           : "bg-gray-700/50 border-gray-600 hover:border-gray-500"
                       }`}
            >
              <input
                type="checkbox"
                checked={localPreferences.preferredSectors.includes(sector)}
                onChange={(e) => {
                  const updated = e.target.checked
                    ? [...localPreferences.preferredSectors, sector]
                    : localPreferences.preferredSectors.filter(
                        (s) => s !== sector
                      );
                  handlePreferenceChange("preferredSectors", updated);
                }}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 
                         border-gray-500 rounded bg-gray-700"
              />
              <span className="ml-2 text-sm text-gray-200">{sector}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Investment Goals */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Target className="h-5 w-5 text-indigo-400" />
          <label className="block text-sm font-medium text-gray-200">
            Investment Goals
          </label>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {GOALS.map((goal) => (
            <label
              key={goal}
              className={`flex items-center p-3 rounded-lg border cursor-pointer
                       transition-all duration-200 ${
                         localPreferences.investmentGoals.includes(goal)
                           ? "bg-indigo-500/20 border-indigo-500"
                           : "bg-gray-700/50 border-gray-600 hover:border-gray-500"
                       }`}
            >
              <input
                type="checkbox"
                checked={localPreferences.investmentGoals.includes(goal)}
                onChange={(e) => {
                  const updated = e.target.checked
                    ? [...localPreferences.investmentGoals, goal]
                    : localPreferences.investmentGoals.filter(
                        (g) => g !== goal
                      );
                  handlePreferenceChange("investmentGoals", updated);
                }}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 
                         border-gray-500 rounded bg-gray-700"
              />
              <span className="ml-2 text-sm text-gray-200">{goal}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={saving}
        className={`w-full flex items-center justify-center px-4 py-3 rounded-lg
                 text-sm font-medium text-white transform transition-all duration-200
                 ${
                   saving
                     ? "bg-gray-600 cursor-not-allowed"
                     : "bg-indigo-600 hover:bg-indigo-700 hover:scale-[1.02] shadow-lg hover:shadow-indigo-500/30"
                 }`}
      >
        {saving ? (
          <span className="flex items-center">
            <Loader className="animate-spin -ml-1 mr-2 h-5 w-5" />
            Saving...
          </span>
        ) : (
          "Save Preferences"
        )}
      </button>
    </form>
  );
};

export default InvestmentForm;
