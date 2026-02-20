#!/bin/bash

echo "🚀 Setting up GitHub Actions for Android build..."

# Create .github directory if it doesn't exist
mkdir -p .github/workflows

# Copy the workflow file
cp .github/workflows/android-build.yml .github/workflows/

# Update package.json to include build script
npm pkg set scripts.build-android="cd android && ./gradlew assembleRelease"

echo "✅ GitHub Actions setup complete!"
echo ""
echo "Next steps:"
echo "1. Push your code to a GitHub repository"
echo "2. The workflow will automatically trigger on push to main branch"
echo "3. Check Actions tab for build progress"
echo "4. Download APK from workflow artifacts when complete"