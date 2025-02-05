import api from "./api";

// For Nillion DATA STORAGE
class NillionService {
  constructor() {
    this.initialized = false;
  }

  async init() {
    if (this.initialized) return true;
    this.initialized = true;
    return true;
  }

  // For storing data in nillion node
  async storePreferences(address, preferences) {
    try {
      const response = await api.post("/nillion/preferences", {
        address,
        preferences,
      });
      return response.data;
    } catch (error) {
      console.error("Failed to store preferences:", error);
      throw error;
    }
  }

  // For getting data from nillion node
  async getPreferences(address) {
    try {
      const response = await api.get(`/nillion/preferences/${address}`);
      return response.data;
    } catch (error) {
      console.error("Failed to get preferences:", error);
      throw error;
    }
  }
}

export const nillionService = new NillionService();
