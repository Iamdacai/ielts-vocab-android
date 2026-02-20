#!/bin/bash
set -e

echo "Generating JavaScript bundle for Android..."

# Use Expo CLI to generate the bundle
npx expo export --platform android --dev false --output-dir android/app/src/main/assets

# Ensure the assets directory exists
mkdir -p android/app/src/main/assets

echo "Bundle generation completed successfully!"