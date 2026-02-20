#!/bin/bash

set -e

echo "🚀 Starting Release APK Build..."

# Step 1: Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Step 2: Create assets directory
echo "📁 Creating assets directory..."
mkdir -p android/app/src/main/assets

# Step 3: Generate JS bundle
echo "⚡ Generating JS bundle..."
npx react-native bundle \
  --platform android \
  --dev false \
  --entry-file index.js \
  --bundle-output android/app/src/main/assets/index.android.bundle \
  --assets-dest android/app/src/main/res

# Step 4: Build release APK
echo "🔨 Building release APK..."
cd android
chmod +x ./gradlew
./gradlew assembleRelease --no-daemon --max-workers=2

echo "✅ Release APK built successfully!"
echo "APK location: android/app/build/outputs/apk/release/app-release.apk"