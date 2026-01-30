# GeoJSON Map Editor (Lite) | GeoJSON 地图编辑器 (Lite 版本)

<div align="center">

[![Version](https://img.shields.io/badge/version-v2.14.0-blue.svg)](CHANGELOG.md)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![GitHub](https://img.shields.io/badge/github-Geomap--app--lite-181717.svg?logo=github)](https://github.com/Superhedgehoger/Geomap-app-lite)

**[English](#english) | [简体中文](#简体中文)**

</div>

---

<a name="english"></a>
## English

> ⚠️ **Privacy Notice**: This project does not contain any real or test business data, only code structure and functionality.

**Lite version** of the GeoJSON Map Editor - A lightweight map editing tool focused on core functionality, without the Event Tracker module.

### 🔄 Comparison with Full Version

| Feature | Full Version | Lite Version |
|---------|:------------:|:------------:|
| Drawing & Editing | ✅ | ✅ |
| Layer Management | ✅ | ✅ |
| Timeline Snapshots | ✅ | ✅ |
| Box Selection | ✅ | ✅ |
| Radius Rings | ✅ | ✅ |
| Data Import/Export | ✅ | ✅ |
| Event Tracker | ✅ | ❌ |

### ✨ Core Features

- **Drawing Tools** - Markers, polylines, polygons, rectangles, circles
- **Icon Customization** - 30+ Font Awesome icons + color picker
- **Property Editor** - Real-time sidebar editing
- **Layer Management** - Folder organization, visibility control, batch operations
- **Timeline Snapshots** - Save/load map states
- **Box Selection** - Shift+drag to select multiple markers
- **Radius Rings** - Display coverage areas around markers (1.5km ~ 10km)
- **Data Import/Export** - GeoJSON, Excel, CSV support

### 🚀 Quick Start

#### Live Demo
🔗 **[https://superhedgehoger.github.io/Geomap-app-lite/](https://superhedgehoger.github.io/Geomap-app-lite/)**

#### Run Locally
```bash
git clone https://github.com/Superhedgehoger/Geomap-app-lite.git
cd Geomap-app-lite
python server.py
```
Visit: `http://localhost:8000`

### 🔗 Related Projects

Need full features (including Event Tracker)?  
🔗 **[Geomap-app (Full Version)](https://github.com/Superhedgehoger/Geomap-app)**

### 📝 License

MIT License - See [LICENSE](LICENSE) file

---

<a name="简体中文"></a>
## 简体中文

> ⚠️ **隐私声明**：本项目不包含任何真实或测试业务数据，仅提供代码结构与功能实现。

GeoJSON 地图编辑器的 **轻量级版本** - 专注核心地图编辑功能，不含事件追踪器模块。

### 🔄 与完整版对比

| 功能 | 完整版 | Lite 版本 |
|------|:------:|:---------:|
| 绘图与编辑 | ✅ | ✅ |
| 图层管理 | ✅ | ✅ |
| 时间轴快照 | ✅ | ✅ |
| 框选工具 | ✅ | ✅ |
| 范围圈 | ✅ | ✅ |
| 数据导入导出 | ✅ | ✅ |
| 事件追踪器 | ✅ | ❌ |

### ✨ 核心功能

- **绘图工具** - 标记、折线、多边形、矩形、圆形
- **图标自定义** - 30+ Font Awesome 图标 + 颜色选择器
- **属性编辑器** - 侧边栏实时编辑
- **图层管理** - 文件夹组织、显隐控制、批量操作
- **时间轴快照** - 保存/加载地图状态
- **框选工具** - Shift+拖动选择多个标记
- **范围圈** - 显示标记覆盖范围（1.5km ~ 10km）
- **数据导入导出** - 支持 GeoJSON、Excel、CSV

### 🚀 快速开始

#### 在线体验
🔗 **[https://superhedgehoger.github.io/Geomap-app-lite/](https://superhedgehoger.github.io/Geomap-app-lite/)**

#### 本地运行
```bash
git clone https://github.com/Superhedgehoger/Geomap-app-lite.git
cd Geomap-app-lite
python server.py
```
浏览器访问：`http://localhost:8000`

### 📖 使用指南

#### 添加标记
1. 点击左侧工具栏的 📍 标记工具
2. 在地图上点击添加标记
3. 右键编辑属性

#### 添加范围圈
1. **Ctrl+点击** 标记打开属性编辑器
2. 在"范围圈"区块选择半径（1.5km、2km、3km、5km、10km）
3. 地图上立即显示覆盖范围

### 🔗 相关项目

需要完整功能（包括事件追踪器）？请访问：  
🔗 **[Geomap-app (完整版)](https://github.com/Superhedgehoger/Geomap-app)**

### 📝 License

MIT License - 详见 [LICENSE](LICENSE) 文件

---

## 🙏 Acknowledgments | 致谢

- [Leaflet](https://leafletjs.com/) - Excellent open-source map library | 优秀的开源地图库
- [geojson.io](https://geojson.io) - Inspiration source | 灵感来源
