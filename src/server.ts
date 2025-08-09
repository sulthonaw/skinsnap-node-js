import app from "@/app.ts";
import { config } from "@/config/index.ts";
import { prisma } from "@/prisma/client.ts";

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log("✅ Database connected successfully!");

    app.listen(config.port, () => {
      console.log(`🚀 Server is running on http://localhost:${config.port}`);
    });
  } catch (error) {
    console.error("❌ Failed to connect to the database", error);
    process.exit(1);
  } finally {
    process.on("beforeExit", async () => {
      await prisma.$disconnect();
    });
  }
};

startServer();
