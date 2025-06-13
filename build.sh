#!/bin/bash
echo "Building Forever E-commerce for Render..."

# Clean console logs for production
npm run clean-logs

# Build frontend
echo "Building frontend..."
cd frontend
npm install
npm run build
cd ..

echo "Frontend build complete!"

# Backend setup
echo "Setting up backend..."
cd backend
npm install
cd ..

echo "Build complete!"