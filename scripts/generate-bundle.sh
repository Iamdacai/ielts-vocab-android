#!/bin/bash

set -e

echo "🚀 Generating React Native bundle..."

# Create assets directory if it doesn't exist
mkdir -p android/app/src/main/assets

# Generate the bundle
npx react-native bundle \
  --platform android \
  --dev false \
  --entry-file index.js \
  --bundle-output android/app/src/main/assets/index.android.bundle \
  --assets-dest android/app/src/main/res

echo "✅ Bundle generated successfully!"
echo "Bundle location: android/app/src/main/assets/index.android.bundle"