#!/bin/bash
echo ""
echo "========================================"
echo "  SabdhaSathi - Nepali Dictionary"
echo "========================================"
echo ""

# Try python3 first, then python2, then node
if command -v python3 &>/dev/null; then
    echo "Starting server on port 8080..."
    xdg-open "http://localhost:8080" 2>/dev/null || open "http://localhost:8080" 2>/dev/null &
    python3 -m http.server 8080
elif command -v python &>/dev/null; then
    echo "Starting server on port 8080..."
    xdg-open "http://localhost:8080" 2>/dev/null || open "http://localhost:8080" 2>/dev/null &
    python -m http.server 8080
elif command -v node &>/dev/null; then
    echo "Starting server on port 8080..."
    xdg-open "http://localhost:8080" 2>/dev/null || open "http://localhost:8080" 2>/dev/null &
    node -e "require('http').createServer((req,res)=>{require('fs').readFile('.'+require('url').parse(req.url).pathname.replace(/%20/g,' '),(e,d)=>{if(e){res.writeHead(404);res.end()}else{res.writeHead(200);res.end(d)}})}).listen(8080,()=>console.log('Server running at http://localhost:8080'))"
else
    echo "No server found (python or node required)."
    echo "Trying to open directly in browser..."
    if command -v xdg-open &>/dev/null; then
        xdg-open "$(dirname "$0")/index.html"
    elif command -v open &>/dev/null; then
        open "$(dirname "$0")/index.html"
    else
        echo "Open index.html manually in a browser."
    fi
fi
