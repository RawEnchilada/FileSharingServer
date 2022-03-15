@echo off

if not exist node_modules\ (
    echo "Installing dependencies..."
    npm install
)
if not exist config.json (
    echo "Please create a config.json file based on the example given."
    pause
    exit
)

node index.js