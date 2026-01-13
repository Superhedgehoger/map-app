# 双仓库同步指南

## 仓库地址

| 仓库 | 地址 | 说明 |
|------|------|------|
| **Geomap-app** | https://github.com/Superhedgehoger/Geomap-app | 主仓库（全功能） |
| **Geomap-app-lite** | https://github.com/Superhedgehoger/Geomap-app-lite | 轻量版（无事件） |

---

## Lite 版本删除内容

以下内容在 Lite 版中**永久删除**：

### HTML (index.html)
以下内容**已删除**：
- `#eventTrackerPanel` 整个面板
- 右键菜单中的 "📋 事件追踪器" 选项
- 属性编辑器中的 "事件追踪器" 按钮

### JavaScript (script.js)
以下函数**已删除**：
```
openEventTracker()
closeEventTracker()
createNewEvent()
saveCurrentEvent()
saveMarkerEvents()
renderEventList()
openEventTrackerForLayerId()
openEventTrackerFromMenu()
openEventTrackerFromDrawer()
```

---

## 同步判断规则

### ✅ 应同步到 Lite
- 地图核心（绘制、编辑、导入导出）
- 图层管理、标记样式
- 表格视图、统计功能
- UI/UX 优化、Bug 修复

### ❌ 不同步到 Lite
- 任何 `event` / `事件` 相关功能
- `feature.properties.events` 数据结构

---

## 同步操作步骤

### 当 Geomap-app 有更新时

```powershell
# 1. 查看主仓库最近提交
cd c:\Users\DJY\Documents\AnGoogle\Geomap-app
git log --oneline -5

# 2. 判断是否需要同步（参照上方规则）

# 3. 手动复制需要同步的文件到 Lite
cd c:\Users\DJY\Documents\AnGoogle\Geomap-app-lite
# 复制文件后检查是否有事件相关代码，如有则删除

# 4. 提交并推送
git add .
git commit -m "sync: 从主仓库同步xxx功能"
git push
```

---

*更新日期：2026-01-12*
