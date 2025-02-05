import nillionService from "../services/nillionService.js";

const serializeBigInt = (data) => {
  return JSON.parse(
    JSON.stringify(data, (_, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );
};

export const getPreferences = async (req, res) => {
  try {
    const { address } = req.params;
    if (!address) {
      return res.status(400).json({ error: "Address is required" });
    }

    const preferences = await nillionService.getPreferences(address);

    //NO PREFERENCES, RETURN DEFAULTS
    if (!preferences) {
      return res.json({
        risk_tolerance: 1,
        investment_horizon: 1,
        preferred_sectors: "[]",
        investment_goals: "[]",
      });
    }

    res.json(preferences);
  } catch (error) {
    console.error("Error getting preferences:", error);
    res.status(500).json({
      error: "Failed to get preferences",
      details: error.message,
    });
  }
};

export const storePreferences = async (req, res) => {
  try {
    const { address, preferences } = req.body;
    if (!address || !preferences) {
      return res
        .status(400)
        .json({ error: "Address and preferences are required" });
    }

    const result = await nillionService.storePreferences(address, preferences);
    res.json(result);
  } catch (error) {
    console.error("Error storing preferences:", error);
    res
      .status(500)
      .json({ error: error.message || "Failed to store preferences" });
  }
};
