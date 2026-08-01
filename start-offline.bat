@echo off
title SabdhaSathi - Starting...
echo.
echo ========================================
echo   SabdhaSathi - Nepali Dictionary
echo ========================================
echo.
echo Starting local server...
echo.

REM Try Python 3 first, then Python 2, then Node.js
where py >nul 2>&1 && (
    echo Found: py launcher
    start "" http://localhost:8080
    py -3 -m http.server 8080
    goto :end
)

where python3 >nul 2>&1 && (
    echo Found: python3
    start "" http://localhost:8080
    python3 -m http.server 8080
    goto :end
)

where python >nul 2>&1 && (
    echo Found: python
    start "" http://localhost:8080
    python -m http.server 8080
    goto :end
)

where node >nul 2>&1 && (
    echo Found: node
    start "" http://localhost:8080
    node -e "require('http').createServer((req,res)=>{require('fs').readFile('.'+require('url').parse(req.url).pathname.replace(/%20/g,' '),(e,d)=>{if(e){res.writeHead(404);res.end()}else{res.writeHead(200);res.end(d)}})}).listen(8080,()=>console.log('Server running at http://localhost:8080'))"
    goto :end
)

REM Fallback: open the HTML file directly (works for dictionary, not OCR)
echo No server found. Opening directly (OCR scanner unavailable offline)...
start "" "%~dp0index.html"

:end
echo.
echo Press Ctrl+C to stop the server.
