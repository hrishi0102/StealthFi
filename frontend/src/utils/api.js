import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export async function generateProof(income, threshold) {
  try {
    const response = await api.post("/generate-proof", {
      income,
      threshold,
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error generating proof:",
      error.response?.data || error.message
    );
    throw error;
  }
}

export async function verifyProof(proof, publicSignals) {
  try {
    const response = await api.post("/verify-proof", {
      proof,
      publicSignals,
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error verifying proof:",
      error.response?.data || error.message
    );
    throw error;
  }
}

export const storePreferences = async (address, preferences) => {
  try {
    const response = await api.post("/nillion/preferences", {
      address,
      preferences,
    });
    return response.data;
  } catch (error) {
    console.error("Error storing preferences:", error);
    throw error;
  }
};

export const getPreferences = async (address) => {
  try {
    const response = await api.get(`/nillion/preferences/${address}`);
    return response.data;
  } catch (error) {
    console.error("Error getting preferences:", error);
    throw error;
  }
};

export const getRecommendations = async (preferences) => {
  try {
    const response = await api.post("/get-recommendations", preferences);
    return response.data;
  } catch (error) {
    console.error("Error getting recommendations:", error);
    throw error;
  }
};

// Add interceptors for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle network errors
    if (!error.response) {
      console.error("Network error:", error);
      throw new Error("Network error. Please check your connection.");
    }

    // Handle specific status codes
    switch (error.response.status) {
      case 400:
        throw new Error("Invalid request. Please check your input.");
      case 401:
        throw new Error("Unauthorized. Please authenticate.");
      case 404:
        throw new Error("Resource not found.");
      case 500:
        throw new Error("Server error. Please try again later.");
      default:
        throw error;
    }
  }
);

export default api;
