@echo off
chcp 65001 >nul
set /p DOMAIN=Вставь адрес сайта без слэша в конце (пример: https://dey6.ru): 
if "%DOMAIN%"=="" exit /b 1
powershell -NoProfile -ExecutionPolicy Bypass -Command "$old='https://YOUR-DOMAIN.example'; $new='%DOMAIN%'; Get-ChildItem -Recurse -File | Where-Object { $_.Extension -in '.html','.xml','.txt','.webmanifest' -or $_.Name -eq 'manifest.webmanifest' } | ForEach-Object { $p=$_.FullName; $c=[IO.File]::ReadAllText($p); if($c.Contains($old)){ [IO.File]::WriteAllText($p,$c.Replace($old,$new),(New-Object Text.UTF8Encoding($false))) } }"
echo.
echo Готово. Canonical, Open Graph, sitemap и RSS настроены на %DOMAIN%
pause
