import { readFileSync } from "node:fs";
import "dotenv/config";

/** Lee una env var obligatoria o lanza error claro. */
function env(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Falta la variable de entorno ${name}. Copia .env.example a .env`);
  return v;
}

/** Carga un archivo de cert a Buffer; error claro si no existe. */
function loadCert(name: string): Buffer {
  const path = env(name);
  try {
    return readFileSync(path);
  } catch {
    throw new Error(`No se pudo leer el certificado ${name}=${path}. ¿Corriste 'npm run certs:dev'?`);
  }
}

/**
 * Único punto de swap dev -> producción.
 * Swap a certs reales de Apple = editar solo .env, sin tocar código.
 */
export const config = {
  passTypeIdentifier: env("PASS_TYPE_IDENTIFIER"),
  teamIdentifier: env("PASS_TEAM_IDENTIFIER"),
  organizationName: env("PASS_ORG_NAME"),
  colors: {
    background: process.env.PASS_BG_COLOR ?? "rgb(30,30,40)",
    foreground: process.env.PASS_FG_COLOR ?? "rgb(255,255,255)",
    label: process.env.PASS_LABEL_COLOR ?? "rgb(180,180,190)",
  },
  certificates: {
    signerCert: loadCert("WALLET_SIGNER_CERT"),
    signerKey: loadCert("WALLET_SIGNER_KEY"),
    signerKeyPassphrase: process.env.WALLET_SIGNER_KEY_PASSPHRASE,
    wwdr: loadCert("WALLET_WWDR_CERT"),
  },
};

export type Config = typeof config;
