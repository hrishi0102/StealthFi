import { SecretVaultWrapper } from "nillion-sv-wrappers";
import dotenv from "dotenv";
dotenv.config();

const secretKey = process.env.NILLION_ORG_SECRET_KEY;
const orgDid = process.env.NILLION_ORG_DID;

const orgConfig = {
  orgCredentials: {
    secretKey: secretKey,
    orgDid: orgDid,
  },
  nodes: [
    {
      url: "https://nildb-zy8u.nillion.network",
      did: "did:nil:testnet:nillion1fnhettvcrsfu8zkd5zms4d820l0ct226c3zy8u",
    },
    {
      url: "https://nildb-rl5g.nillion.network",
      did: "did:nil:testnet:nillion14x47xx85de0rg9dqunsdxg8jh82nvkax3jrl5g",
    },
    {
      url: "https://nildb-lpjp.nillion.network",
      did: "did:nil:testnet:nillion167pglv9k7m4gj05rwj520a46tulkff332vlpjp",
    },
  ],
};

class NillionService {
  constructor() {
    this.collection = null;
    this.initialized = false;
    this.SCHEMA_ID = "02cb5e89-6528-4baa-9f36-758756cac686";
  }

  async init() {
    if (this.initialized) return true;

    try {
      this.collection = new SecretVaultWrapper(
        orgConfig.nodes,
        orgConfig.orgCredentials,
        this.SCHEMA_ID
      );
      await this.collection.init();
      this.initialized = true;
      return true;
    } catch (error) {
      console.error("Failed to initialize Nillion:", error);
      throw error;
    }
  }

  async storePreferences(address, preferences) {
    if (!address) throw new Error("Address is required");

    try {
      await this.init();
      const data = [
        {
          _id: crypto.randomUUID(),
          wallet_address: address,
          risk_tolerance: { $allot: preferences.riskTolerance },
          investment_horizon: { $allot: preferences.investmentHorizon },
          preferred_sectors: {
            $allot: JSON.stringify(preferences.preferredSectors),
          },
          investment_goals: {
            $allot: JSON.stringify(preferences.investmentGoals),
          },
        },
      ];

      const result = await this.collection.writeToNodes(data);
      return result;
    } catch (error) {
      console.error("Failed to store preferences:", error);
      throw error;
    }
  }

  async getPreferences(address) {
    await this.init();
    const result = await this.collection.readFromNodes({
      wallet_address: address,
    });

    if (!result || !result[0]) return null;

    // Transform the data before sending it to frontend
    return {
      risk_tolerance: result[0].risk_tolerance,
      investment_horizon: result[0].investment_horizon,
      preferred_sectors: result[0].preferred_sectors,
      investment_goals: result[0].investment_goals,
    };
  }
}

const nillionService = new NillionService();
export default nillionService;
