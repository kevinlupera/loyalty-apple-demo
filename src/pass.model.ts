import { config } from "./config.js";

/** Datos dinámicos de una tarjeta de fidelidad. */
export interface LoyaltyData {
  serialNumber: string;
  memberName: string;
  points: number;
  tier: string;
  /** Contenido del código QR (ej: id de miembro o URL). */
  barcodeMessage: string;
}

/**
 * Construye el objeto pass.json (tipo storeCard) a partir de los datos
 * dinámicos + config. passkit-generator añade los campos de firma.
 */
export function buildPassJson(data: LoyaltyData) {
  return {
    formatVersion: 1,
    passTypeIdentifier: config.passTypeIdentifier,
    teamIdentifier: config.teamIdentifier,
    organizationName: config.organizationName,
    serialNumber: data.serialNumber,
    description: `Tarjeta de fidelidad - ${config.organizationName}`,
    backgroundColor: config.colors.background,
    foregroundColor: config.colors.foreground,
    labelColor: config.colors.label,
    storeCard: {
      headerFields: [
        { key: "tier", label: "NIVEL", value: data.tier },
      ],
      primaryFields: [
        { key: "points", label: "PUNTOS", value: data.points },
      ],
      secondaryFields: [
        { key: "member", label: "MIEMBRO", value: data.memberName },
      ],
    },
    barcodes: [
      {
        format: "PKBarcodeFormatQR",
        message: data.barcodeMessage,
        messageEncoding: "iso-8859-1",
      },
    ],
  };
}
