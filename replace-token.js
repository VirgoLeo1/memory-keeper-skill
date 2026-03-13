/**
 * replace-token.js
 * Simple utility to update a stored secret (e.g., github, X API token).
 * Usage: node replace-token.js <secretId> <newValue>
 */
const store = require('./store');
const [,,id,newVal] = process.argv;
if(!id||!newVal){
  console.error('Usage: node replace-token.js <id> <newValue>');
  process.exit(1);
}
store.set(id,newVal);
console.log(`Secret "${id}" updated.`);
