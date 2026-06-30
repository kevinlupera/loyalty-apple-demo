import { mkdirSync, writeFileSync } from "node:fs";
import { generatePass } from "./generatePass.js";
import type { LoyaltyData } from "./pass.model.js";

// Datos de ejemplo. Reemplazar por datos reales / args / DB según necesites.
const sample: LoyaltyData = {
  serialNumber: `loyalty-${Date.now()}`,
  memberName: "Kevin Lupera",
  points: 1250,
  tier: "Gold",
  barcodeMessage: "MEMBER-0001",
};

const buffer = await generatePass(sample);

mkdirSync("output", { recursive: true });
writeFileSync("output/loyalty.pkpass", buffer);
console.log(`OK -> output/loyalty.pkpass (${buffer.length} bytes)`);
