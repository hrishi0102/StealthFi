import React, { useState, useEffect } from "react";
import { getRecommendations } from "../utils/api";
import { Loader, AlertCircle, LineChart, Target, Shield } from "lucide-react";

const Recommendations = ({ preferences, onError }) => {
  const [recommendations, setRecommendations] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (
      !preferences ||
      !Object.keys(preferences).length ||
      !preferences.preferredSectors?.length ||
      !preferences.investmentGoals?.length
    ) {
      setLoading(false);
      return;
    }

    let isMounted = true;
    const fetchRecommendations = async () => {
      setLoading(true);
      try {
        const { recommendations } = await getRecommendations(preferences);
        if (isMounted) {
          setRecommendations(recommendations);
        }
      } catch (error) {
        console.error("Error fetching recommendations:", error);
        onError?.(error.message);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchRecommendations();

    return () => {
      isMounted = false;
    };
  }, [
    preferences?.riskTolerance,
    preferences?.investmentHorizon,
    preferences?.preferredSectors?.join(","),
    preferences?.investmentGoals?.join(","),
  ]);

  const parseMarkdown = (text) => {
    if (!text) return [];

    // Split into main sections
    const sections = text.split(/(?=\*\*\d+\. )/);

    return sections
      .map((section) => {
        const lines = section.split("\n");
        const title = lines[0].replace(/\*\*/g, "").trim();
        const content = lines
          .slice(1)
          .join("\n")
          .replace(/\*\*/g, "") // Remove bold markers
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean)
          .map((line) => {
            if (line.startsWith("*")) {
              return {
                type: "bullet",
                content: line.substring(1).trim(),
              };
            }
            return {
              type: "text",
              content: line,
            };
          });

        return {
          title,
          content,
        };
      })
      .filter((section) => section.title);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-gray-800/50 rounded-lg">
        <Loader className="h-8 w-8 text-indigo-400 animate-spin" />
        <p className="mt-4 text-gray-400">Generating recommendations...</p>
      </div>
    );
  }

  if (!preferences || !Object.keys(preferences).length) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-gray-800/50 rounded-lg">
        <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
        <p className="text-gray-400 text-center">
          Please set your investment preferences
          <br />
          to receive recommendations.
        </p>
      </div>
    );
  }

  const parsedRecommendations = parseMarkdown(recommendations);

  const getIconForSection = (title) => {
    if (title.includes("Asset Allocation"))
      return <LineChart className="h-6 w-6" />;
    if (title.includes("Sectors")) return <Target className="h-6 w-6" />;
    if (title.includes("Risk")) return <Shield className="h-6 w-6" />;
    return null;
  };

  return (
    <div className="space-y-8">
      {recommendations ? (
        parsedRecommendations.map((section, index) => (
          <div
            key={index}
            className="bg-gray-800 rounded-lg p-6 border border-gray-700 shadow-lg"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="text-indigo-400">
                {getIconForSection(section.title)}
              </div>
              <h3 className="text-lg font-semibold text-white">
                {section.title}
              </h3>
            </div>

            <div className="space-y-3">
              {section.content.map((item, itemIndex) => (
                <div
                  key={itemIndex}
                  className={`${
                    item.type === "bullet"
                      ? "flex items-start"
                      : "text-gray-400"
                  }`}
                >
                  {item.type === "bullet" && (
                    <>
                      <div className="h-1.5 w-1.5 rounded-full bg-indigo-400 mt-2 mr-3 flex-shrink-0" />
                      <span className="text-gray-300">{item.content}</span>
                    </>
                  )}
                  {item.type === "text" && (
                    <p className="text-gray-400">{item.content}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="flex flex-col items-center justify-center h-64 bg-gray-800/50 rounded-lg">
          <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-400 text-center">
            No recommendations available.
            <br />
            Try updating your preferences.
          </p>
        </div>
      )}
    </div>
  );
};

export default Recommendations;
