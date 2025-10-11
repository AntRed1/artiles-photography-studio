const fs = require('fs');
const path = require('path');

// Leer package.json para obtener la versión
const packageJsonPath = path.resolve(__dirname, '../package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Crear objeto de versión con timestamp de build
const versionInfo = {
  version: packageJson.version,
  buildDate: new Date().toISOString(),
  buildTimestamp: Date.now(),
  environment: process.env.NODE_ENV || 'development',
};

// Escribir en public/version.json
const versionJsonPath = path.resolve(__dirname, '../public/version.json');
fs.writeFileSync(versionJsonPath, JSON.stringify(versionInfo, null, 2));

console.log('✅ Version info updated:', versionInfo);
console.log(`📦 Version: ${versionInfo.version}`);
console.log(
  `📅 Build Date: ${new Date(versionInfo.buildDate).toLocaleString('es-ES')}`
);
console.log(`🌍 Environment: ${versionInfo.environment}`);
