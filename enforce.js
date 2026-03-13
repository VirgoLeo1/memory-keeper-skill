const cfg = require('./config.json');

function mustNotUse(action, activity){
  const rule = cfg.bans.find(b=>b.activity===activity);
  if(!rule) return;
  if(rule.disallowed.includes(action)){
    const allowed = rule.allowed.join(', ');
    throw new Error(`Forbidden: "${action}" is not allowed in activity "${activity}". Use ${allowed} instead.`);
  }
}

module.exports = { mustNotUse };