@echo off
title CareConnect - Spring Boot Backend
cd /d "%~dp0backend"
echo ====================================================
echo Starting CareConnect Spring Boot Backend on port 8080
echo ====================================================
call mvnw.cmd spring-boot:run
pause
