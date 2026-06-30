# Loyalty Card — Apple Wallet (TypeScript + Node.js)

Genera una tarjeta de fidelidad (`storeCard`) `.pkpass` para Apple Wallet.
Modular y parametrizado por `.env`: swap de certs dev -> reales de Apple sin tocar código.

## Setup (sin membresía Apple)

```bash
npm install
npm run certs:dev          # certs self-signed para dev
cp .env.example .env       # paths ya apuntan a certs/dev
# coloca PNGs en assets/ (ver tamaños abajo)
npm run generate           # -> output/loyalty.pkpass
npm run verify             # valida manifest + estructura
npm run typecheck
```

> Los certs dev permiten generar y validar el `.pkpass`, pero **no se instala en
> un iPhone real**. iOS solo acepta pases firmados con un cert Pass Type ID de Apple.

### Ver el render del pase (macOS)
Abre `output/loyalty.pkpass` con **Pass Viewer** (Xcode > Open Developer Tool, o
"Additional Tools for Xcode").

## Assets requeridos (`assets/`)
PNG, fondo transparente:
- `icon.png` (29×29) y `icon@2x.png` (58×58) — **obligatorio**
- `logo.png` (≤160×50) y `logo@2x.png`
- `strip.png` / `strip@2x.png` — opcional (banda superior)

## Estructura
- `src/config.ts` — lee `.env`, único punto de swap de certs
- `src/pass.model.ts` — tipos + factory del `pass.json` (campos loyalty)
- `src/generatePass.ts` — core: arma y firma el `.pkpass` en memoria
- `src/cli.ts` — genera `output/loyalty.pkpass` con datos de ejemplo
- `src/verify.ts` — valida hashes vs `manifest.json` (test sin iPhone)
- `scripts/gen-dev-certs.sh` — certs self-signed dev

## Pasar a producción
Ver `certs/README.md`. Resumen: obtener Pass Type ID + key + WWDR de Apple,
ponerlos en `certs/`, actualizar `.env`. `npm run generate` produce un `.pkpass`
instalable en iPhone. **Cero cambios de código.**

## Extensión futura (no incluida)
- Endpoint HTTP que sirva el `.pkpass` reusando `generatePass()`.
- Updates + APNs push (requiere cert adicional de Apple).
