// backend/src/services/agentService.js
import {
  AgentKit,
  CdpWalletProvider,
  wethActionProvider,
  walletActionProvider,
  erc20ActionProvider,
  cdpApiActionProvider,
  cdpWalletActionProvider,
  pythActionProvider,
} from "@coinbase/agentkit";
import fs from "fs";
import { getLangChainTools } from "@coinbase/agentkit-langchain";
import { ChatOpenAI } from "@langchain/openai";
import { MemorySaver } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import dotenv from "dotenv";

dotenv.config();

let cachedAgent = null;
let cachedConfig = null;
const WALLET_DATA_FILE = "wallet_data.txt";

export async function initializeAgent() {
  try {
    if (cachedAgent && cachedConfig) {
      return { agent: cachedAgent, config: cachedConfig };
    }

    // Validate required environment variables
    if (!process.env.CDP_API_KEY_NAME || !process.env.CDP_API_KEY_PRIVATE_KEY) {
      throw new Error(
        "Missing required CDP API credentials in environment variables"
      );
    }

    //Initialze a Groq API client
    const llm = new ChatOpenAI({
      model: "llama3-70b-8192",
      apiKey: process.env.LLAMA_API_KEY,
      configuration: {
        baseURL: "https://api.groq.com/openai/v1",
      },
    });

    let walletDataStr = null;
    if (fs.existsSync(WALLET_DATA_FILE)) {
      try {
        walletDataStr = fs.readFileSync(WALLET_DATA_FILE, "utf8");
        console.log("Loaded existing wallet data");
      } catch (error) {
        console.error("Error reading wallet data:", error);
      }
    }

    // Configure CDP wallet provider
    const walletConfig = {
      apiKeyName: process.env.CDP_API_KEY_NAME,
      apiKeyPrivateKey: process.env.CDP_API_KEY_PRIVATE_KEY?.replace(
        /\\n/g,
        "\n"
      ),
      cdpWalletData: walletDataStr || undefined,
      networkId: "base-sepolia",
      // mnemonicPhrase: process.env.MNEMONIC_PHRASE,
    };

    // Create wallet provider directly without looking for JSON file
    const walletProvider = await CdpWalletProvider.configureWithWallet(
      walletConfig
    );

    const agentkit = await AgentKit.from({
      walletProvider,
      actionProviders: [
        wethActionProvider(),
        pythActionProvider(),
        walletActionProvider(),
        erc20ActionProvider(),
        cdpApiActionProvider({
          apiKeyName: process.env.CDP_API_KEY_NAME,
          apiKeyPrivateKey: process.env.CDP_API_KEY_PRIVATE_KEY?.replace(
            /\\n/g,
            "\n"
          ),
        }),
        cdpWalletActionProvider({
          apiKeyName: process.env.CDP_API_KEY_NAME,
          apiKeyPrivateKey: process.env.CDP_API_KEY_PRIVATE_KEY?.replace(
            /\\n/g,
            "\n"
          ),
        }),
      ],
    });

    const tools = await getLangChainTools(agentkit);
    const memory = new MemorySaver();
    const agentConfig = {
      configurable: { thread_id: "CDP AgentKit Chatbot" },
    };

    const agent = createReactAgent({
      llm,
      tools,
      checkpointSaver: memory,
      messageModifier: `
            You are a helpful agent that can interact onchain using the Coinbase Developer Platform AgentKit.
            If you ever need funds, you can request them from the faucet if you are on network ID 'base-sepolia'.
            If not, you can provide your wallet details and request funds from the user.Before executing your first action, get the wallet details to see what network 
            you're on. If there is a 5XX (internal) HTTP error code, ask the user to try again later.
          `,
    });

    const exportedWallet = await walletProvider.exportWallet();
    fs.writeFileSync(WALLET_DATA_FILE, JSON.stringify(exportedWallet));
    console.log("Wallet data saved");

    cachedAgent = agent;
    cachedConfig = agentConfig;

    return { agent, config: agentConfig };
  } catch (error) {
    console.error("Error initializing agent:", error);
    throw error;
  }
}
