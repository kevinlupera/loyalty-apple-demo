import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { buildPassJson, type LoyaltyData } from "./pass.model.js";

// Preview HTML de la tarjeta sin firma (PassViewer rechaza self-signed).
// Aproxima el layout storeCard: header, primary, secondary, QR-placeholder.
// ponytail: render aproximado, no pixel-perfect de iOS. Suficiente para iterar diseño.

const sample: LoyaltyData = {
  serialNumber: `loyalty-${Date.now()}`,
  memberName: "Kevin Lupera",
  points: 1250,
  tier: "Gold",
  barcodeMessage: "MEMBER-0001",
};

const p = buildPassJson(sample) as any;
const logo = (() => {
  try {
    return `data:image/png;base64,${readFileSync(new URL("../assets/logo.png", import.meta.url)).toString("base64")}`;
  } catch {
    return "";
  }
})();

const row = (f: any) =>
  `<div class="field"><span class="label">${f.label ?? ""}</span><span class="value">${f.value ?? ""}</span></div>`;

const sc = p.storeCard;
const html = `<!doctype html><meta charset="utf-8"><title>Preview ${p.description}</title>
<style>
  body{background:#f0f0f3;font-family:-apple-system,system-ui,sans-serif;display:grid;place-items:center;min-height:100vh;margin:0}
  .pass{width:320px;border-radius:14px;padding:16px;color:${p.foregroundColor};background:${p.backgroundColor};box-shadow:0 8px 30px rgba(0,0,0,.25)}
  .top{display:flex;justify-content:space-between;align-items:center;margin-bottom:18px}
  .top img{height:34px}.org{font-weight:600}
  .field{display:flex;flex-direction:column;margin:10px 0}
  .label{font-size:10px;letter-spacing:.5px;color:${p.labelColor}}
  .value{font-size:20px;font-weight:600}
  .secondary{display:flex;gap:24px}
  .qr{margin-top:18px;background:#fff;color:#000;border-radius:8px;padding:14px;text-align:center;font:13px monospace}
  .note{margin-top:14px;font-size:11px;color:#888;text-align:center}
</style>
<div class="pass">
  <div class="top">
    ${logo ? `<img src="${logo}">` : `<span class="org">${p.organizationName}</span>`}
    ${(sc.headerFields ?? []).map(row).join("")}
  </div>
  ${(sc.primaryFields ?? []).map(row).join("")}
  <div class="secondary">${(sc.secondaryFields ?? []).map(row).join("")}</div>
  <div class="qr">▦ QR<br>${p.barcodes?.[0]?.message ?? ""}</div>
</div>
<div class="note">Preview aproximado · serial ${p.serialNumber}</div>`;

mkdirSync("output", { recursive: true });
writeFileSync("output/preview.html", html);
console.log("OK -> output/preview.html");
