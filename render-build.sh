#!/usr/bin/env bash
# Render build script
set -e

# Install Node.js dependencies
echo "📦 Installing Node.js dependencies..."
npm install

# Push database schema
echo "🗄️  Pushing database schema..."
npm run db:push

echo "✅ Build complete!"
echo "⚠️  Note: PDF processing is disabled (requires GraphicsMagick/Ghostscript - not available on free tier)"
