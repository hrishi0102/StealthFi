import express from "express";
import cors from "cors";
import { groth16 } from "snarkjs";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import agentRoutes from "./routes/agentRoutes.js";
import nillionRoutes from "./routes/nillionRoutes.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.set("json replacer", (_, value) =>
  typeof value === "bigint" ? value.toString() : value
);

app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 3001;
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const zkeyPath = "../../zk-proof/output/incomeProof_0001.zkey";
const vkey = JSON.parse(
  fs.readFileSync("../../zk-proof/output/verification_key.json")
);

app.post("/api/generate-proof", async (req, res) => {
  try {
    const { income, threshold } = req.body;
    const { proof, publicSignals } = await groth16.fullProve(
      { income, threshold },
      "../../zk-proof/output/incomeProof_js/incomeProof.wasm",
      zkeyPath
    );
    console.log("Proof generated:", proof, publicSignals);
    res.json({ proof, publicSignals });
  } catch (error) {
    console.error("Error generating proof:", error);
    res.status(500).json({ error: "Error generating proof" });
  }
});

app.post("/api/verify-proof", async (req, res) => {
  try {
    const { proof, publicSignals } = req.body;
    const isValid = await groth16.verify(vkey, publicSignals, proof);
    const isAboveThreshold = publicSignals[0] === "1";
    console.log("Proof verified:", isValid, isAboveThreshold);
    res.json({ isValid: isValid && isAboveThreshold });
  } catch (error) {
    console.error("Error verifying proof:", error);
    res.status(500).json({ error: "Error verifying proof" });
  }
});

app.use("/api/nillion", nillionRoutes);
app.use("/api/agent", agentRoutes);

app.post("/api/get-recommendations", async (req, res) => {
  try {
    const {
      riskTolerance,
      investmentHorizon,
      preferredSectors,
      investmentGoals,
    } = req.body;

    // Convert risk levels and horizons to readable text
    const riskLevels = ["Conservative", "Moderate", "Aggressive"];
    const horizons = ["Short-term", "Medium-term", "Long-term"];

    const prompt = `As an DeFI AI investment advisor, provide personalized investment recommendations for cryptocurrencies, stablecoins, and the different DeFi products based on the following criteria:

    Investment Profile:
    - Risk Tolerance: ${riskLevels[riskTolerance - 1]}
    - Investment Horizon: ${horizons[investmentHorizon - 1]}
    - Preferred Sectors: ${preferredSectors.join(", ")}
    - Investment Goals: ${investmentGoals.join(", ")}

    Please provide:
    1. Asset allocation strategy suitable for this profile
    2. Specific sectors to focus on from the preferred sectors
    3. Risk management tips tailored to the risk tolerance level
    
    Keep the response professional, actionable, and focused on practical investment advice.`;

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ recommendations: text });
  } catch (error) {
    console.error("Error generating recommendations:", error);
    res.status(500).json({
      error: "Failed to generate recommendations",
      details: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
