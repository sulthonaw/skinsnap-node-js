import "dotenv/config";

export const config = {
  port: process.env.PORT || 3000,
  corsOrigin: process.env.CORS_ORIGIN || "*",
  databaseUrl: process.env.DATABASE_URL,
  jwt: {
    secret: process.env.JWT_SECRET || "default-secret",
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    redirectUri: process.env.GOOGLE_OAUTH_REDIRECT_URI || "",
  },
  geminiApiKey: process.env.GEMINI_API_KEY || "",
};

if (!config.databaseUrl || !config.google.clientId || !config.google.clientSecret || !config.geminiApiKey) {
  console.error("FATAL ERROR: Missing critical environment variables.");
  process.exit(1);
}
