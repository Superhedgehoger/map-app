@echo off
chcp 65001 >nul
title GeoJSON 地图编辑器 - 本地服务器

echo ========================================
echo    GeoJSON 地图编辑器
echo ========================================
echo.
echo 正在启动本地服务器...
echo 服务器地址: http://localhost:8000
echo.
echo 提示：
echo - 浏览器将自动打开
echo - 关闭此窗口将停止服务器
echo - 按 Ctrl+C 可手动停止服务器
echo ========================================
echo.

:: 等待1秒后自动打开浏览器
timeout /t 1 /nobreak >nul
start http://localhost:8000/index.html

:: 启动 Python HTTP 服务器
python -m http.server 8000

pause
