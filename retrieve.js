/**
 * retrieve.js
 * Load a stored chat log by session ID and print its content (or pipe to stdout).
 */
const path = require('path');
const fs = require('fs');
const store = require('./store');

const sessionId = process.argv[2];
if(!sessionId){
  console.error('Usage: node retrieve.js <sessionId>');
  process.exit(1);
}

try {
  const logPath = store.get(`chatLog:${sessionId}`);
  if(!fs.existsSync(logPath)) throw new Error('File not found');
  const data = fs.readFileSync(logPath,'utf8');
  console.log(data);
} catch(e){
  console.error('Failed to retrieve log:', e.message);
  process.exit(1);
}
