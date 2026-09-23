import "dotenv/config";
import { definePrismaConfig } from "prisma/config";
import { defineConfig as ormConfig } from "@prisma/orm-postgres/config";

export default definePrismaConfig({
  orm: ormConfig({
    contract: "./prisma/contract.prisma",
    db: {
      connection: (globalThis as { process?: { env?: Record<string, string | undefined> } })
        .process?.env?.["DATABASE_URL"]!,
    },
  }),

  skills: {
    agents: ["claude", "cursor", "agents", "devin"],
  },
});