const fs = require('fs');
const path = require('path');
require('dotenv').config();

const libDir = process.env.ORACLE_CLIENT_LIB_DIR;

console.log('--- Oracle Instant Client Check ---');

if (!libDir) {
    console.error('❌ ORACLE_CLIENT_LIB_DIR is NOT set in .env');
    console.log('You must set this variable to the path where you extracted the Instant Client.');
    process.exit(1);
}

console.log(`Checking path: ${libDir}`);

if (fs.existsSync(libDir)) {
    console.log('✅ Directory exists.');

    // Check for key files (Windows)
    const dllPath = path.join(libDir, 'oci.dll');
    if (fs.existsSync(dllPath)) {
        console.log('✅ Found oci.dll (looks like a valid Instant Client directory).');
        console.log('\nSUCCESS: Your path seems correct. Try running "npm start" now.');
    } else {
        console.warn('⚠️  Directory exists but "oci.dll" was not found.');
        console.warn('   Are you sure this is the correct folder? It should contain many .dll files.');
    }
} else {
    console.error('❌ Directory does NOT exist.');
    console.error('   Please check the path in .env. It must be the full absolute path.');
}
console.log('-----------------------------------');
