#!/bin/bash

# Create an empty yarn.lock file to mark this as a standalone project
touch yarn.lock

# Now install dependencies using npm instead (more reliable in this case)
echo "Installing dependencies with npm..."
npm install

# Install Three.js related packages
echo "Installing Three.js related packages..."
npm install three @react-three/fiber @react-three/postprocessing @react-spring/three
npm install -D @types/three

echo "Installation complete! You can now run 'npm run dev' to start the development server."

