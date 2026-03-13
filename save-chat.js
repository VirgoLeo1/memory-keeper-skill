/**
 * save-chat.js
 * Retrieves the full chat history of a given session ID and stores it in the
 * memory-keeper logs folder. It also registers the file path in the secure KV so
 * other parts of the system can locate it later.
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const store = require('./store');

const sessionId = process.argv[2];
if (!sessionId) {
  console.error('Usage: node save-chat.js <sessionId>');
  process.exit(1);
}

// 1. Get session info to find the .jsonl file path
let sessionInfo;
try {
  const raw = execSync(`openclaw sessions --json --active 1440`, { encoding: 'utf8' });
  const sessions = JSON.parse(raw);
  sessionInfo = sessions.sessions?.find(s => s.key === sessionId || s.sessionId === sessionId);
} catch (e) {
  console.error('Failed to fetch session info:', e.message);
  process.exit(1);
}

if (!sessionInfo) {
  console.error('Session not found:', sessionId);
  process.exit(1);
}

// 2. Read the .jsonl file directly
const jsonlPath = sessionInfo.transcriptPath || 
  path.join('C:\\Users\\33512\\.openclaw\\agents\\main\\sessions', `${sessionInfo.sessionId}.jsonl`);

if (!fs.existsSync(jsonlPath)) {
  console.error('Session file not found:', jsonlPath);
  process.exit(1);
}

const jsonlContent = fs.readFileSync(jsonlPath, 'utf8');
const lines = jsonlContent.split('\n').filter(line => line.trim());
const messages = lines.map(line => JSON.parse(line));

// 3. Build file path: logs/YYYY-MM-DD_<sessionId>.json
const now = new Date();
const datePart = now.toISOString().slice(0, 10);
const fileName = `${datePart}_${sessionId.replace(/[:\\]/g, '-')}.json`;
const logsDir = path.resolve('D:/.openclaw-backup/memory-keeper/logs');
if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });
const filePath = path.join(logsDir, fileName);

fs.writeFileSync(filePath, JSON.stringify(messages, null, 2), { encoding: 'utf8' });
console.log('Chat saved to', filePath);

// 4. Register in KV for quick lookup
try {
  store.set(`chatLog:${sessionId}`, filePath);
} catch (e) {
  console.warn('Failed to register in KV store:', e.message);
}
