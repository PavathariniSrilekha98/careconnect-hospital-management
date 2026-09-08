@echo off
title CareConnect - React Frontend
cd /d "%~dp0frontend"
echo ====================================================
echo Starting CareConnect Frontend on port 5173
echo ====================================================
call npm run dev
pause
