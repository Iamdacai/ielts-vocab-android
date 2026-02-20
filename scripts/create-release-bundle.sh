#!/bin/bash

# 创建 assets 目录
mkdir -p android/app/src/main/assets

# 生成 JS bundle - 使用 Expo 的 Metro 配置
npx expo export --platform android --output-dir android/app/src/main/assets --dev false

# 确保 bundle 文件存在
if [ -f "android/app/src/main/assets/index.android.bundle" ]; then
    echo "✅ Bundle generated successfully!"
else
    echo "❌ Bundle generation failed!"
    exit 1
fi

# 复制 assets（如果有）
if [ -d "android/app/src/main/assets/assets" ]; then
    cp -r android/app/src/main/assets/assets/* android/app/src/main/res/
    echo "✅ Assets copied successfully!"
fi