import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function clearDatabase() {
  console.log("Clearing all data from database...\n");

  // Disable foreign key checks so we can truncate in any order
  await prisma.$executeRawUnsafe("SET FOREIGN_KEY_CHECKS = 0");

  const tables = [
    "product_tags",
    "price_tiers",
    "products",
    "colors",
    "growers",
    "origins",
    "tags",
    "user_sessions",
    "user_roles",
    "users",
  ];

  for (const table of tables) {
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE \`${table}\``);
    console.log(`  Cleared: ${table}`);
  }

  await prisma.$executeRawUnsafe("SET FOREIGN_KEY_CHECKS = 1");

  console.log("\nAll data cleared successfully.");
}

clearDatabase()
  .catch((e) => {
    console.error("Failed to clear database:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
