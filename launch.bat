@echo off
title Nomess — Editorial Second Brain
cd /d "%~dp0"
echo ============================================================
echo   Launching Nomess Desktop (Tauri v2 + Rust)
echo ============================================================
npm run tauri -- dev
pause
