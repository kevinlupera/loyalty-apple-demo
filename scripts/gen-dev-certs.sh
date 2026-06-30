#!/usr/bin/env bash
# Genera certificados self-signed para DESARROLLO.
# DEV ONLY: el .pkpass firmado con estos NO es instalable en un iPhone real.
# Para producción, reemplazar por el cert Pass Type ID + key + WWDR de Apple.
set -euo pipefail

cd "$(dirname "$0")/.."
mkdir -p certs
cd certs

PASSPHRASE="dev-passphrase"

echo "==> Generando WWDR dummy (CA local)..."
openssl req -x509 -newkey rsa:2048 -nodes \
  -keyout wwdr.key -out wwdr.pem -days 3650 \
  -subj "/CN=Dev WWDR/O=DevLocal"

echo "==> Generando clave + cert del signer (cifrada con passphrase)..."
openssl genrsa -aes256 -passout "pass:${PASSPHRASE}" -out signerKey.pem 2048
openssl req -new -key signerKey.pem -passin "pass:${PASSPHRASE}" \
  -out signer.csr -subj "/CN=Dev Pass Signer/O=DevLocal"
openssl x509 -req -in signer.csr \
  -CA wwdr.pem -CAkey wwdr.key -CAcreateserial \
  -out signerCert.pem -days 3650

rm -f signer.csr wwdr.key wwdr.srl

echo "OK -> certs/signerCert.pem, certs/signerKey.pem, certs/wwdr.pem"
echo "Passphrase: ${PASSPHRASE} (coincide con WALLET_SIGNER_KEY_PASSPHRASE en .env.example)"
