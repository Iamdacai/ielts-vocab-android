# 构建指南

## Debug APK (开发测试)
使用 GitHub Actions 自动构建 debug APK：
- 配置: `.github/workflows/android-build.yml`
- 命令: `./gradlew assembleDebug`
- 限制: 需要网络连接加载 JS bundle

## Release APK (完全离线)
手动创建 release APK 步骤：

### 1. 生成 JS Bundle
```bash
chmod +x scripts/create-release-bundle.sh
./scripts/create-release-bundle.sh
```

### 2. 构建 Release APK
```bash
chmod +x scripts/build-release.sh
./scripts/build-release.sh
```

### 3. 输出文件
- APK 路径: `android/app/build/outputs/apk/release/app-release.apk`
- 特性: 完全离线，无需网络连接

## 关键注意事项
- 不要手动修改 Babel 配置
- 不要添加 @react-native/babel-preset 依赖
- Debug APK 需要 Metro 服务器
- Release APK 包含预打包的 JS bundle