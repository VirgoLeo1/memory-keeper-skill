/**
 * vector-sync.js
 * Reads the newly saved chat log and pushes embeddings into a local ChromaDB
 * collection for semantic search. This is a thin wrapper around the
 * `nomic-embed-text` model; you can replace it with any other embedder.
 */
const fs = require('fs');
const path = require('path');
const { Client } = require('chromadb'); // assume chromadb package installed
const embed = require('nomic-embed-text'); // placeholder import

(async () => {
  const args = process.argv.slice(2);
  if(args.length===0){
    console.error('Usage: node vector-sync.js <logFilePath>');
    process.exit(1);
  }
  const logPath = args[0];
  if(!fs.existsSync(logPath)){
    console.error('Log file not found:', logPath);
    process.exit(1);
  }
  const data = JSON.parse(fs.readFileSync(logPath,'utf8'));
  // flatten messages into a single string per message
  const texts = data.map(m=>`${m.role||'unknown'}: ${m.content||''}`);
  const embeddings = await embed.embedTexts(texts);
  const client = await Client.create({path:'memory-tree/vector-db'});
  const collection = await client.getOrCreateCollection({name:'chat_logs'});
  await collection.add({ids:texts.map((_,i)=>`${path.basename(logPath)}_${i}`),embeddings,metadatas:data});
  console.log('Vector sync completed for', logPath);
})();