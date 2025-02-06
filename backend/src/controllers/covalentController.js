// controllers/agentController.js
import pkg from "@covalenthq/ai-agent-sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";

const {
  TokenBalancesTool,
  NFTBalancesTool,
  TransactionsTool,
  HistoricalTokenPriceTool,
} = pkg;

class DeFiAdvisor {
  constructor() {
    // Initialize Gemini
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });

    // Initialize blockchain tools
    const apiKey = process.env.GOLDRUSH_API_KEY;
    this.tools = {
      tokens: new TokenBalancesTool(apiKey),
      nfts: new NFTBalancesTool(apiKey),
      transactions: new TransactionsTool(apiKey),
      prices: new HistoricalTokenPriceTool(apiKey),
    };
  }

  async fetchWalletData(address) {
    if (!address) return null;

    try {
      const [tokens, nfts, transactions] = await Promise.allSettled([
        this.tools.tokens.getTokenBalances(address),
        this.tools.nfts.getNFTHoldings(address),
        this.tools.transactions.getTransactionHistory(address, { limit: 5 }),
      ]);

      return {
        tokens: tokens.status === "fulfilled" ? tokens.value : [],
        nfts: nfts.status === "fulfilled" ? nfts.value : [],
        recentTransactions:
          transactions.status === "fulfilled" ? transactions.value : [],
      };
    } catch (error) {
      console.error("Error fetching wallet data:", error);
      return null;
    }
  }

  formatWalletData(data) {
    if (!data) return "";

    let summary = "\nWallet Analysis:\n";

    if (data.tokens?.length) {
      summary += "\nToken Holdings:\n";
      data.tokens.forEach((token) => {
        summary += `- ${token.symbol || "Unknown"}: ${token.balance || 0} `;
        if (token.quote_rate) {
          summary += `(~$${(token.balance * token.quote_rate).toFixed(2)})\n`;
        }
      });
    }

    if (data.nfts?.length) {
      summary += "\nNFT Holdings:\n";
      data.nfts.forEach((nft) => {
        summary += `- ${
          nft.collection_name || "Unknown Collection"
        }: Token ID ${nft.token_id}\n`;
      });
    }

    if (data.recentTransactions?.length) {
      summary += "\nRecent Transactions:\n";
      data.recentTransactions.forEach((tx) => {
        summary += `- ${tx.type || "Transaction"} on ${new Date(
          tx.timestamp
        ).toLocaleDateString()}\n`;
      });
    }

    return summary;
  }

  async generateResponse(message, walletAddress) {
    try {
      const walletData = await this.fetchWalletData(walletAddress);
      const walletSummary = this.formatWalletData(walletData);

      const prompt = `You are an expert DeFi and blockchain advisor. Your role is to provide professional,
well-researched advice about cryptocurrency investments, DeFi protocols, and blockchain technology.

${walletSummary}

User Question: ${message}

Please provide a detailed response that:
1. Is professional and accurate
2. Considers current market conditions
3. Includes risk management advice
4. Provides actionable steps
5. References wallet data when relevant
6. Explains technical concepts clearly

Response format:
- Start with a direct answer
- Include relevant analysis
- End with practical recommendations`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Error generating response:", error);
      throw new Error("Failed to generate advice. Please try again.");
    }
  }
}

const advisor = new DeFiAdvisor();

export const getAgentResponse = async (req, res) => {
  try {
    const { message, walletAddress } = req.body;

    if (!message) {
      return res.status(400).json({
        error: "Message is required",
      });
    }

    const response = await advisor.generateResponse(message, walletAddress);
    res.json({ response });
  } catch (error) {
    console.error("Agent error:", error);
    res.status(500).json({
      error: "Failed to get response",
      details: error.message,
    });
  }
};
