const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Compress the entire memory-tree directory into a dated zip
const today = new Date().toISOString().slice(0,10);
const src = path.resolve('memory-tree');
const dst = path.join('memory-tree','backup', `${today}.zip`);
// Ensure backup folder exists
fs.mkdirSync(path.dirname(dst), {recursive:true});

try {
  execSync(`powershell -Command "Compress-Archive -Path '${src}\*' -DestinationPath '${dst}' -Force"`, {stdio:'inherit'});
  console.log('Backup created at', dst);
} catch(e){
  console.error('Backup failed:', e.message);
}
