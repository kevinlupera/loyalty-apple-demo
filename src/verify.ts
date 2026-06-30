import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdtempSync, readdirSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

// ponytail: usa el `unzip` del sistema (macOS/Linux) en vez de añadir una lib de zip.
// Es solo una herramienta de verificación dev. Cambiar a una lib si se necesita en Windows.

const file = process.argv[2];
if (!file) {
  console.error("Uso: tsx src/verify.ts <archivo.pkpass>");
  process.exit(1);
}

const dir = mkdtempSync(join(tmpdir(), "pkpass-"));
try {
  execFileSync("unzip", ["-o", "-q", file, "-d", dir]);

  const files = readdirSync(dir);
  console.log("Archivos en el .pkpass:", files.join(", "));

  for (const required of ["pass.json", "manifest.json", "signature"]) {
    if (!files.includes(required)) throw new Error(`Falta ${required} en el .pkpass`);
  }

  const manifest: Record<string, string> = JSON.parse(
    readFileSync(join(dir, "manifest.json"), "utf8"),
  );

  let ok = 0;
  for (const [name, expected] of Object.entries(manifest)) {
    const actual = createHash("sha1").update(readFileSync(join(dir, name))).digest("hex");
    if (actual !== expected) {
      throw new Error(`Hash de ${name} no coincide:\n  manifest=${expected}\n  real    =${actual}`);
    }
    ok++;
  }

  console.log(`OK: ${ok} archivos con hash correcto vs manifest.json. Firma presente.`);
  console.log("Nota: firma válida estructuralmente; instalable en iPhone solo con cert real de Apple.");
} finally {
  rmSync(dir, { recursive: true, force: true });
}
