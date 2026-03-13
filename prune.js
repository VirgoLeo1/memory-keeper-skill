const fs = require('fs');
const path = require('path');
const cfg = require('./config.json');

function daysBetween(date){
  const now = Date.now();
  return (now - date.getTime()) / (1000*60*60*24);
}

// 1. Clean old chat logs (> cfg.logRetentionDays)
const logsDir = path.resolve('memory-tree','logs');
if(fs.existsSync(logsDir)){
  const files = fs.readdirSync(logsDir);
  files.forEach(f=>{
    const fp = path.join(logsDir,f);
    const stat = fs.statSync(fp);
    if(daysBetween(stat.mtime) > (cfg.logRetentionDays||15)){
      fs.unlinkSync(fp);
      console.log('Deleted old log', f);
    }
  });
}

// 2. Clean old backup zip (> cfg.backupRetentionDays)
const backupDir = path.resolve('memory-tree','backup');
if(fs.existsSync(backupDir)){
  const backs = fs.readdirSync(backupDir);
  backs.forEach(f=>{
    const fp = path.join(backupDir,f);
    const stat = fs.statSync(fp);
    if(daysBetween(stat.mtime) > (cfg.backupRetentionDays||30)){
      fs.unlinkSync(fp);
      console.log('Deleted old backup', f);
    }
  });
}
