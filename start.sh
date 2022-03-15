#!/bin/bash

if ! [ -d "node_modules" ]; then
    echo "Installing dependencies...";
    npm install
fi

if ! [ -f "config.json" ]; then
    echo "Please create a config.json file based on the example given.";
    read -n 1;
    exit
fi

node index.js