import { SecretVaultWrapper } from "nillion-sv-wrappers";
import { orgConfig } from "./orgConfig.js";
import schema from "./schema.json" assert { type: "json" };

async function main() {
  try {
    const org = new SecretVaultWrapper(
      orgConfig.nodes,
      orgConfig.orgCredentials
    );
    await org.init();

    // create a new collection schema
    const newSchema = await org.createSchema(schema, "Investment Preferences");
    console.log("📚 New Schema:", newSchema);
    console.log("👀 Schema ID:", newSchema[0].result.data);
  } catch (error) {
    console.error("❌ Failed to use SecretVaultWrapper:", error);
    process.exit(1);
  }
}

main();
