# Memory Keeper Skill

安全、自动的会话记忆管理技能，专为 OpenClaw 设计。

## 功能特性

- **自动保存** - 会话结束时自动归档完整聊天记录
- **加密存储** - AES-256-GCM 加密敏感数据
- **向量化检索** - 支持语义级记忆检索
- **自动备份** - 每日自动备份，自动清理过期数据
- **活动禁令** - 可配置特定操作的限制规则

## 安装

1. 将 `memory-keeper` 目录放入 OpenClaw 的 `skills/` 目录
2. 确保 `config.json` 中的路径配置正确
3. 首次运行时会自动创建加密密钥

## 目录结构

```
memory-keeper/
├── README.md           # 本文件
├── SKILL.md            # OpenClaw 技能描述
├── config.json         # 配置文件
├── store.js            # 加密 KV 存储
├── save-chat.js        # 保存会话历史
├── retrieve.js         # 检索历史记录
├── vector-sync.js      # 向量化同步
├── backup.js           # 自动备份
├── prune.js            # 清理过期数据
├── enforce.js          # 活动禁令执行
└── on-session-start.js # 会话启动钩子
```

## 使用方式

### 自动保存

在 `HEARTBEAT.md` 中添加：

```bash
node skills/memory-keeper/save-chat.js <session-id>
```

或在会话启动时自动触发（通过 `on-session-start.js`）

### 读取凭证

```javascript
const { get } = require('./skills/memory-keeper/store');
const apiKey = get('tavily_key');
```

### 配置禁令

在 `config.json` 中配置活动禁令：

```json
{
  "bans": [
    {
      "activity": "moltbook_post",
      "disallowed": ["browser.open", "browser.navigate"],
      "allowed": ["api.call"]
    }
  ]
}
```

## 配置说明

### config.json

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

| 字段 | 说明 |
|------|------|
| `storageFile` | 加密存储文件路径 |
| `encryption.algorithm` | 加密算法（固定为 aes-256-gcm） |
| `encryption.keyFile` | 密钥文件路径（自动生成） |
| `logRetentionDays` | 日志保留天数 |
| `backupRetentionDays` | 备份保留天数 |

## 数据目录

```
D:/.openclaw-backup/memory-keeper/
├── logs/               # 会话日志存档
├── secure-store.enc    # 加密 KV 存储
└── enc-key.bin         # 加密密钥（32 字节）
```

## 命令行工具

### 保存会话

```bash
node skills/memory-keeper/save-chat.js <session-id>
```

### 检索记录

```bash
node skills/memory-keeper/retrieve.js <session-id>
```

### 备份数据

```bash
node skills/memory-keeper/backup.js
```

### 清理过期数据

```bash
node skills/memory-keeper/prune.js
```

## 安全说明

- 所有敏感数据以加密形式存储
- 密钥文件 `enc-key.bin` 需妥善保管
- 建议定期备份 `secure-store.enc` 和 `enc-key.bin`
- 不要将密钥文件提交到版本控制

## 开发笔记

- 基于 OpenClaw 2026.3.11+ 版本
- 需要 Node.js 18+
- 向量化功能需要 ChromaDB（可选）

## 许可证

与 OpenClaw 主项目保持一致
