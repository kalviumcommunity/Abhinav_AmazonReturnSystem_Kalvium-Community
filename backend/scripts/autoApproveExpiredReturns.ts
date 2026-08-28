import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { runAutoApprovalSweep } from "../src/lib/autoApprove";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const result = await runAutoApprovalSweep(prisma);
  console.log(`Auto-approved ${result.count} expired return request(s)`);
  for (const id of result.approvedIds) {
    console.log(`  - ${id}`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
