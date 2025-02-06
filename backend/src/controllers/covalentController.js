import { Agent, createTool } from "@covalenthq/ai-agent-sdk";
import {
  TokenBalancesTool,
  NFTHoldingsTool,
  TransactionHistoryTool,
} from "@covalenthq/ai-agent-sdk";

const agent = new Agent({
  name: "DeFi Advisor",
  model: {
    provider: "OPEN_AI",
    name: "gpt-4o-mini",
  },
  description:
    "Expert blockchain researcher analyzing DeFi opportunities and risks",
  tools: {
    tokenBalances: new TokenBalancesTool(process.env.GOLDRUSH_API_KEY),
    nftBalances: new NFTHoldingsTool(process.env.GOLDRUSH_API_KEY),
    transactions: new TransactionHistoryTool(process.env.GOLDRUSH_API_KEY),
  },
});

export const getAgentResponse = async (req, res) => {
  try {
    const { message, walletAddress } = req.body;

    const context = walletAddress
      ? `User wallet: ${walletAddress}. Use tools to analyze their holdings.`
      : "Provide general DeFi advice.";

    const result = await agent.run({
      input: `${context}\n\nUser message: ${message}`,
    });

    res.json({ response: result.output });
  } catch (error) {
    console.error("Agent error:", error);
    res.status(500).json({ error: "Failed to get response" });
  }
};
