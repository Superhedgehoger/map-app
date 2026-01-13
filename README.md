# GeoJSON 地图编辑器 (Lite 版)

[![Version](https://img.shields.io/badge/version-v2.9.1--lite-green.svg)](CHANGELOG.md)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

> ⚠️ **隐私声明**：本项目不包含任何真实或测试业务数据，仅提供代码结构与功能实现。

> 📢 **Lite 版本说明**：本版本为轻量版，**永久不包含事件追踪器功能**。所有相关的 UI 入口、逻辑代码及数据字段已完全剥离，确保极简体验。如需完整功能，请使用 [Geomap-app](https://github.com/Superhedgehoger/Geomap-app) 主仓库。

一个功能完整的 **GeoJSON 地图编辑器**，类似 [geojson.io](https://geojson.io)，基于 Leaflet 构建。

## ✨ 核心功能

- **绘图工具** - 标记、折线、多边形、矩形、圆形（Leaflet.draw）
- **GeoJSON 导入/导出** - 完整格式支持
- **Excel 导入/导出** - 支持 `.xlsx` 格式
- **图层管理** - 显示/隐藏/重命名/删除图层
- **表格视图** - Tabulator 集成，虚拟滚动
- **时间轴快照** - 保存/加载不同时间点的地图状态
- **组合标记** - 同坐标多标记自动合并，放射展开（Spiderfy）
- **四向联动** - Table / 地图 / 图层面板 / 属性编辑器

## ❌ 不包含的功能

- 事件追踪器（Event Tracker）- 完整版专属

## 🚀 快速开始

```powershell
# 启动本地服务器
python server.py

# 或使用简单 HTTP 服务
python -m http.server 8000
```

浏览器访问：`http://localhost:8000`

## 📁 项目结构

```
Geomap-app-lite/
├── index.html              # 主入口
├── script.js               # 核心逻辑
├── style.css               # 样式
├── timeline-manager.js     # 时间轴快照模块
├── table-view.js           # 表格视图模块
├── marker-group.js         # 组合标记模块
├── server.py               # 本地服务器
├── SYNC_GUIDE.md           # 与主版本同步指南
└── updatedocs/             # 开发文档
    ├── API_REFERENCE.md    # API 参考
    └── DEVELOPER_GUIDE.md  # 开发指南
```

## 📖 文档

| 文档 | 说明 |
|------|------|
| [CHANGELOG.md](CHANGELOG.md) | 完整版本更新日志 |
| [SYNC_GUIDE.md](SYNC_GUIDE.md) | 与主版本同步指南 |
| [updatedocs/API_REFERENCE.md](updatedocs/API_REFERENCE.md) | API 参考 |

## 🔗 相关链接

- [Geomap-app 完整版](https://github.com/Superhedgehoger/Geomap-app) - 包含事件追踪器

## 📄 License

MIT License
