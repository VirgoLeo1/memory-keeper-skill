# Memory Keeper 技能

## 目标
- 安全、低 token 的凭证与关键数据存储
- 自动归档完整聊天记录，防止误点新会话导致数据丢失
- 活动级禁令（如 "moltbook_post" 只能使用 API）
- 向量化同步以便语义检索

## 主要文件
- `config.json` – 存储路径、加密密钥、禁令列表
- `on-session-start.js` – 会话创建时自动保存聊天记录
- `save-chat.js` – 调用内部日志归档脚本并写入 KV
- `vector-sync.js` – 将日志向量化并写入本地 ChromaDB
- `backup.js` / `prune.js` – 每日压缩备份并清理 15 天前的旧记录
- `store.js` – 加密 KV（参考旧 gaia-core 实现）

## 使用方式
1. **部署**：将 `memory-keeper` 目录放入 `skills/`，确保 `config.json` 指向合法的加密密钥文件。
2. **自动保存**：系统在每次创建新会话时会运行 `on-session-start.js`，自动把前一次会话完整日志保存到 `memory-keeper/logs/` 并同步向量。
3. **读取凭证**：在子代理或插件中 `const {get}=require('./skills/memory-keeper/store'); const apiKey=get('tavily_key');`
4. **禁令**：在需要受限的代码前调用 `require('./skills/memory-keeper/enforce').mustNotUse(action, activity)`。
5. **备份**：`HEARTBEAT.md` 已加入 `node skills/memory-keeper/backup.js` 与 `prune.js`，保证每日安全备份。

## 配置示例（config.json）
```json
{
  "storageFile": "D:/.openclaw-backup/memory-keeper/secure-store.enc",
  "encryption": {
    "algorithm": "aes-256-gcm",
    "keyFile": "D:/.openclaw-backup/memory-keeper/enc-key.bin"
  },
  "bans": [
    {
      "activity": "moltbook_post",
      "disallowed": ["browser.open", "browser.navigate"],
      "allowed": ["api.call"]
    }
  ]
}
```

## 注意
- 所有敏感数据只以 **ID** 形式在对话中出现，实际值保存在加密 KV 中。
- 删除旧的 gaia-core / gaia-memory / gaia-tools 目录后，请在 `HEARTBEAT.md` 中移除对应脚本引用，改为使用本技能。
- 如需手动恢复聊天记录，可运行 `node skills/memory-keeper/retrieve.js <session-id>`。
