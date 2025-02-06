import React, { useState, useEffect } from "react";
import { useAppKit } from "@reown/appkit/react";
import { motion } from "framer-motion";
import {
  Shield,
  Lock,
  Brain,
  Wallet,
  ChevronRight,
  BarChart,
  Key,
  Database,
  MessageSquare,
} from "lucide-react";

const LandingPage = ({ onConnect }) => {
  const { open } = useAppKit();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleConnect = async () => {
    try {
      await open();
    } catch (error) {
      console.error("Connection error:", error);
    }
  };

  const features = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: "ZK-Proof Verification",
      description:
        "Verify your income privately using zero-knowledge proofs without revealing sensitive data",
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: "AI-Powered Advice",
      description:
        "Get personalized DeFi investment recommendations from our advanced AI advisor",
    },
    {
      icon: <Database className="w-6 h-6" />,
      title: "Private Data Storage",
      description:
        "Your data is encrypted and stored securely across decentralized Nillion nodes",
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Interactive Chat",
      description:
        "Engage with our AI agent for real-time DeFi insights and market analysis",
    },
  ];

  const steps = [
    {
      icon: <Wallet />,
      title: "Connect Wallet",
      description: "Securely connect your wallet using Reown AppKit",
    },
    {
      icon: <Key />,
      title: "Income Verification",
      description: "Privately verify your income using ZK-proofs",
    },
    {
      icon: <BarChart />,
      title: "Set Preferences",
      description: "Define your investment preferences and risk tolerance",
    },
    {
      icon: <Brain />,
      title: "Get AI Insights",
      description: "Receive personalized DeFi recommendations",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navbar */}
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled ? "bg-gray-900/95 backdrop-blur-md" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                StealthFi
              </span>
            </div>
            <button
              onClick={handleConnect}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200"
            >
              Connect Wallet
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl sm:text-6xl font-bold mb-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Your Private AI DeFi Advisor
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Navigate the DeFi landscape with confidence using AI-powered
              insights while keeping your financial data private and secure.
            </p>
            <button
              onClick={handleConnect}
              className="px-8 py-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200 text-lg font-semibold flex items-center gap-2 mx-auto"
            >
              Get Started <ChevronRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 bg-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Powerful Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-6 rounded-xl bg-gray-800/50 backdrop-blur-sm hover:bg-gray-700/50 transition-colors duration-200"
              >
                <div className="w-12 h-12 rounded-lg bg-indigo-600/20 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                <div className="p-6 rounded-xl bg-gray-800/50 backdrop-blur-sm">
                  <div className="w-12 h-12 rounded-full bg-indigo-600/20 flex items-center justify-center mb-4">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-400">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 right-0 w-8 h-0.5 bg-indigo-600/20 transform translate-x-4" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-20 px-4 bg-gray-800/50">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">Powered By</h2>
          <div className="flex flex-wrap justify-center gap-8">
            {["Circom", "SnarkJS", "Nillion", "Covalent", "Gemini", "GAIA"].map(
              (tech, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="px-6 py-3 rounded-lg bg-gray-800 text-sm font-semibold"
                >
                  {tech}
                </motion.div>
              )
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-800">
        <div className="max-w-7xl mx-auto text-center text-gray-400">
          <p>© 2024 StealthFi. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
