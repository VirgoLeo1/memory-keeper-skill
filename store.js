const fs = require('fs');
const crypto = require('crypto');
const cfg = require('./config.json');

function loadStore(){
  if(!fs.existsSync(cfg.storageFile)) return {};
  const data = fs.readFileSync(cfg.storageFile);
  const iv = data.slice(0,12);
  const tag = data.slice(data.length-16);
  const enc = data.slice(12, -16);
  const key = fs.readFileSync(cfg.encryption.keyFile);
  const decipher = crypto.createDecipheriv(cfg.encryption.algorithm, key, iv);
  decipher.setAuthTag(tag);
  const plain = Buffer.concat([decipher.update(enc), decipher.final()]);
  return JSON.parse(plain.toString('utf8'));
}

function saveStore(store){
  const key = fs.readFileSync(cfg.encryption.keyFile);
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(cfg.encryption.algorithm, key, iv);
  const enc = Buffer.concat([cipher.update(JSON.stringify(store)), cipher.final()]);
  const tag = cipher.getAuthTag();
  const payload = Buffer.concat([iv, enc, tag]);
  fs.writeFileSync(cfg.storageFile, payload);
}

module.exports = {
  set: (id, value) => {
    const store = loadStore();
    store[id] = value;
    saveStore(store);
    return id;
  },
  get: (id) => {
    const store = loadStore();
    if(!(id in store)) throw new Error(`Missing secret "${id}"`);
    return store[id];
  },
  del: (id) => {
    const store = loadStore();
    delete store[id];
    saveStore(store);
  }
};