#!/bin/bash

# Remove existing node_modules and lock files to start fresh
rm -rf node_modules
rm -f package-lock.json
rm -f yarn.lock

# Install yarn if not already installed
if ! command -v yarn &> /dev/null; then
    echo "Installing yarn..."
    npm install -g yarn
fi

# Install dependencies using yarn
echo "Installing dependencies with yarn..."
yarn install

# Install specific Three.js related packages
echo "Installing Three.js related packages..."
yarn add three @react-three/fiber @react-three/postprocessing
yarn add @react-spring/three
yarn add -D @types/three

echo "Installation complete! You can now run 'yarn dev' to start the development server."

