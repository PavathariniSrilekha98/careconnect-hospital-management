@echo off
title CareConnect Hospital Management System Launcher
echo ====================================================
echo Starting CareConnect Backend & Frontend Servers...
echo ====================================================
start "CareConnect Backend" "%~dp0run_backend.bat"
start "CareConnect Frontend" "%~dp0run_frontend.bat"
echo.
echo Both servers launched in dedicated terminal windows!
echo - Backend API:  http://localhost:8080
echo - Frontend App: http://localhost:5173
echo ====================================================
