@echo off
echo ==========================================
echo   STARTING IMBALAN KERJA APP (LOCAL)
echo ==========================================

echo [1/3] Memastikan Database Siap...
call npx prisma db push

echo [2/3] Membuka Browser...
start http://localhost:3000

echo [3/3] Menjalankan Server...
echo Tekan CTRL+C untuk berhenti.
call npm run dev

pause
