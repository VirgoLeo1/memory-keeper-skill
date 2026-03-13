/**
 * Hook script executed by OpenClaw when a new session is created.
 * It retrieves the previous session's full chat history (if any) and
 * delegates to save-chat.js for persistent storage.
 */
const { spawnSync } = require('child_process');
// OpenClaw provides the previous session ID via env var OPENCLAW_PREV_SESSION
const prevSession = process.env.OPENCLAW_PREV_SESSION;
if(!prevSession){
  console.log('No previous session – nothing to archive.');
  process.exit(0);
}
// Call the archive script with the previous session ID
const result = spawnSync('node', ['skills/memory-keeper/save-chat.js', prevSession], { stdio: 'inherit' });
process.exit(result.status);
