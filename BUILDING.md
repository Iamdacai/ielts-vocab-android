# 构建指南

## GitHub Actions 自动构建

### 成功配置要点
- 使用 `./gradlew assembleDebug` 构建 debug APK
- 不要手动添加 babel-preset 依赖
- 不要创建自定义 Babel 配置文件
- 保持 package.json 依赖简单

### 构建产物
- **APK 路径**: `android/app/build/outputs/apk/debug/app-debug.apk`
- **APK 类型**: Debug 版本
- **运行要求**: 首次启动需要网络连接

## 本地构建

```bash
# 安装依赖
npm ci

# 构建 APK
cd android
./gradlew assembleDebug
```

## 注意事项

### Debug APK 限制
Debug APK 在首次启动时需要从 Metro 服务器加载 JavaScript bundle。如果需要完全离线的 APK，请使用 EAS Build 服务。

### 避免的常见错误
1. ❌ 不要手动添加 `@react-native/babel-preset` 依赖
2. ❌ 不要创建 `.babelrc` 或 `babel.config.js` 文件  
3. ❌ 不要尝试手动运行 `react-native bundle` 命令
4. ❌ 不要修改 Expo 的默认 Babel 配置

### 正确的依赖管理
- 让 Expo 自动处理 React Native 和 Babel 依赖
- 只在必要时添加第三方库依赖
- 使用 `npm ci` 确保依赖一致性