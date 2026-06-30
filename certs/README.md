# certs/

## Dev (sin membresía Apple)
```
npm run certs:dev
```
Genera `signerCert.pem`, `signerKey.pem`, `wwdr.pem` self-signed. Solo para
generar/validar el `.pkpass` localmente. **No instalables en iPhone real.**

## Producción (con membresía Apple Developer)
1. Crear un **Pass Type ID** en el portal Apple Developer.
2. Crear/descargar el certificado, exportarlo desde Keychain como `.p12`.
3. Convertir a PEM:
   ```
   openssl pkcs12 -in cert.p12 -clcerts -nokeys -out signerCert.pem
   openssl pkcs12 -in cert.p12 -nocerts -out signerKey.pem
   ```
4. Descargar el **Apple WWDR** cert (G4) y convertir a PEM:
   ```
   openssl x509 -inform der -in AppleWWDRCAG4.cer -out wwdr.pem
   ```
5. Colocar los 3 PEM aquí y actualizar las vars en `.env`
   (`PASS_TYPE_IDENTIFIER`, `PASS_TEAM_IDENTIFIER`, paths de certs, passphrase).

Sin cambios de código: solo `.env`.
