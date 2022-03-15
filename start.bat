if not exist node_modules\ (
    echo "Installing dependencies..."
    npm install
)

node index.js