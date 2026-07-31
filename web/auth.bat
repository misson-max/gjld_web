@echo off
chcp 65001 >nul
echo ========================================
echo   GitHub 授权工具
echo ========================================
echo.
echo 请确认你已登录 GitHub 账号 misson-max
echo.
echo 正在获取验证码...
cd /d D:\web
node auth.js
pause
