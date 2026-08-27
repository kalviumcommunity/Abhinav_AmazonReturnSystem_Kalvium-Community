import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const passwordHash = await bcrypt.hash("password123", 10);

  // Seed SELLER test user
  await prisma.user.upsert({
    where: { email: "seller@example.com" },
    update: {},
    create: {
      email: "seller@example.com",
      passwordHash,
      name: "Demo Seller",
      role: "SELLER",
    },
  });

  // Seed CUSTOMER_SUPPORT test user
  await prisma.user.upsert({
    where: { email: "support@example.com" },
    update: {},
    create: {
      email: "support@example.com",
      passwordHash,
      name: "Demo Support Agent",
      role: "CUSTOMER_SUPPORT",
    },
  });

  console.log("✅ Seeded users: seller@example.com (SELLER), support@example.com (CUSTOMER_SUPPORT)");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
