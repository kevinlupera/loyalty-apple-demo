import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { PKPass } from "passkit-generator";
import { config } from "./config.js";
import { buildPassJson, type LoyaltyData } from "./pass.model.js";

const ASSETS_DIR = new URL("../assets/", import.meta.url).pathname;

/** Carga todos los PNG de assets/ como buffers (icon, logo, strip, @2x...). */
function loadAssets(): Record<string, Buffer> {
  const buffers: Record<string, Buffer> = {};
  for (const file of readdirSync(ASSETS_DIR)) {
    if (file.endsWith(".png")) buffers[file] = readFileSync(join(ASSETS_DIR, file));
  }
  if (!buffers["icon.png"]) {
    throw new Error("assets/icon.png es obligatorio (29x29). Ver README.");
  }
  return buffers;
}

/**
 * Genera el .pkpass en memoria. Sin I/O de salida -> testeable y reutilizable
 * (ej: un endpoint HTTP futuro puede llamar esto directo).
 */
export async function generatePass(data: LoyaltyData): Promise<Buffer> {
  const passJson = Buffer.from(JSON.stringify(buildPassJson(data)));

  const pass = new PKPass(
    { "pass.json": passJson, ...loadAssets() },
    {
      signerCert: config.certificates.signerCert,
      signerKey: config.certificates.signerKey,
      signerKeyPassphrase: config.certificates.signerKeyPassphrase,
      wwdr: config.certificates.wwdr,
    },
  );

  return pass.getAsBuffer();
}
