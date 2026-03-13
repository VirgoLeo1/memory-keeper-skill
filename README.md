# Memory Keeper Skill / 记忆守护者技能

[English](#english-version) | [中文](#中文版本)

---

## English Version

**Memory Keeper** is an automatic session archiving skill for OpenClaw with encryption support.

### Features

- **Auto Save** - Automatically archive complete chat history when session ends
- **Encrypted Storage** - AES-256-GCM encryption for sensitive data
- **Vector Search** - Semantic memory retrieval support
- **Auto Backup** - Daily automatic backup with auto-cleanup of expired data
- **Activity Bans** - Configurable operation restrictions

### Installation

1. Place the `memory-keeper` directory into OpenClaw's `skills/` directory
2. Ensure paths in `config.json` are configured correctly
3. Encryption key will be auto-created on first run

### Usage

#### Auto Save
Add to `HEARTBEAT.md`:
```bash
node skills/memory-keeper/save-chat.js <session-id>
```

#### Read Credentials
```javascript
const { get } = require('./skills/memory-keeper/store');
const apiKey = get('tavily_key');
```

### Configuration

```json
{
  "storageFile": "D:/.openclaw-backup/memory-keeper/secure-store.enc",
  "encryption": {
    "algorithm": "aes-256-gcm",
    "keyFile": "D:/.openclaw-backup/memory-keeper/enc-key.bin"
  },
  "bans": [],
  "logRetentionDays": 15,
  "backupRetentionDays": 30
}
```

### Security Notes

- All sensitive data is stored encrypted
- Keep `enc-key.bin` secure
- Backup `secure-store.enc` and `enc-key.bin` regularly
- Never commit key files to version control

---

## 中文版本

**Memory Keeper** 是专为 OpenClaw 设计的自动会话归档技能，支持加密存储。

### 功能特性

- **自动保存** - 会话结束时自动归档完整聊天记录
- **加密存储** - AES-256-GCM 加密敏感数据
- **向量化检索** - 支持语义级记忆检索
- **自动备份** - 每日自动备份，自动清理过期数据
- **活动禁令** - 可配置特定操作的限制规则

### 安装方法

1. 将 `memory-keeper` 目录放入 OpenClaw 的 `skills/` 目录
2. 确保 `config.json` 中的路径配置正确
3. 首次运行时会自动创建加密密钥

### 使用方式

#### 自动保存
在 `HEARTBEAT.md` 中添加：
```bash
node skills/memory-keeper/save-chat.js <session-id>
```

#### 读取凭证
```javascript
const { get } = require('./skills/memory-keeper/store');
const apiKey = get('tavily_key');
```

### 配置说明

```json
{
  "storageFile": "D:/.openclaw-backup/memory-keeper/secure-store.enc",
  "encryption": {
    "algorithm": "aes-256-gcm",
    "keyFile": "D:/.openclaw-backup/memory-keeper/enc-key.bin"
  },
  "bans": [],
  "logRetentionDays": 15,
  "backupRetentionDays": 30
}
```

### 安全说明

- 所有敏感数据以加密形式存储
- 妥善保管 `enc-key.bin` 密钥文件
- 定期备份 `secure-store.enc` 和 `enc-key.bin`
- 不要将密钥文件提交到版本控制

---

**License / 许可证**: Same as OpenClaw main project (与 OpenClaw 主项目保持一致)
