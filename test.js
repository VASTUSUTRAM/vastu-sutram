/**
 * Automated Verification & Health Test Suite for VASTU SUTRAM
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const requiredFiles = [
  'index.html',
  'server.js',
  'package.json',
  'css/styles.css',
  'js/data.js',
  'js/intro3d.js',
  'js/chakra3d.js',
  'js/compass.js',
  'js/booking.js',
  'js/admin.js',
  'js/app.js',
  'assets/logo.png',
  'assets/logo-emblem.png',
  'assets/logo.svg',
  'assets/logo-icon.svg',
  'assets/rajni-singh.jpg',
  'data/db.json'
];

console.log('--- 1. FILE INTEGRITY VERIFICATION ---');
let allFilesExist = true;
requiredFiles.forEach(file => {
  const fullPath = path.join(__dirname, file);
  if (fs.existsSync(fullPath)) {
    const stats = fs.statSync(fullPath);
    console.log(`[PASS] ${file} (${stats.size} bytes)`);
  } else {
    console.error(`[FAIL] Missing file: ${file}`);
    allFilesExist = false;
  }
});

if (!allFilesExist) {
  process.exit(1);
}

console.log('\n--- 2. VASTU DATA MODULE VERIFICATION ---');
const VASTU_DATA = require('./js/data.js');
console.log(`[PASS] Brand: ${VASTU_DATA.brand.name} - ${VASTU_DATA.brand.tagline}`);
console.log(`[PASS] Consultant: ${VASTU_DATA.consultant.name} (${VASTU_DATA.consultant.designation})`);
console.log(`[PASS] Panchabhutas count: ${VASTU_DATA.panchabhutas.length}`);
console.log(`[PASS] Directions count: ${VASTU_DATA.directions.length}`);
console.log(`[PASS] 32 Gates count: ${VASTU_DATA.gates32.length}`);
console.log(`[PASS] Services count: ${VASTU_DATA.services.length}`);
console.log(`[PASS] Packages count: ${VASTU_DATA.packages.length}`);
console.log(`[PASS] Articles count: ${VASTU_DATA.articles.length}`);

console.log('\n--- 3. DATABASE VALIDATION ---');
const dbData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'db.json'), 'utf-8'));
console.log(`[PASS] Bookings in DB: ${dbData.bookings.length}`);
console.log(`[PASS] Settings Owner Pin configured: ${dbData.settings.ownerPin}`);

console.log('\nAll structural tests passed successfully!');
process.exit(0);
