import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { createAppKit } from "@reown/appkit/react";
import {
  arbitrum,
  arbitrumSepolia,
  mainnet,
  polygon,
  sepolia,
} from "@reown/appkit/networks";
import { EthersAdapter } from "@reown/appkit-adapter-ethers";

// Configure AppKit
const projectId = "a0c03874a5caec0f3bdcd4de5cd862ae"; // Your project ID

const metadata = {
  name: "Private Investment Advisor",
  description: "AI-powered investment advice with privacy",
  url: "https://example.com",
  icons: ["https://your-icon-url.com"],
};

createAppKit({
  adapters: [new EthersAdapter()],
  networks: [mainnet, polygon, sepolia, arbitrumSepolia, arbitrum],
  metadata,
  projectId,
  features: {
    analytics: true,
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
