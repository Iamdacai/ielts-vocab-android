# GitHub Actions Android 构建设置指南

## 步骤 1: 创建 GitHub 仓库
1. 登录 GitHub
2. 点击 "New repository"
3. 仓库名称：`ielts-vocab-android`
4. 选择 "Public"（免费）或 "Private"（需要付费计划）
5. 不要初始化 README、.gitignore 或 license
6. 点击 "Create repository"

## 步骤 2: 配置本地 Git
```bash
cd /home/admin/clawd/ielts-vocab-android
git init
git add .
git commit -m "Initial commit: IELTS Vocabulary Android App"
git remote add origin https://github.com/YOUR_USERNAME/ielts-vocab-android.git
git push -u origin main
```

## 步骤 3: 设置 GitHub Secrets（可选但推荐）
如果需要签名 APK 或访问私有依赖：
1. 进入仓库 Settings → Secrets and variables → Actions
2. 添加以下 secrets（如果需要）：
   - `KEYSTORE_FILE`：Base64 编码的 keystore 文件
   - `KEYSTORE_PASSWORD`：Keystore 密码
   - `KEY_ALIAS`：密钥别名
   - `KEY_PASSWORD`：密钥密码

## 步骤 4: 触发构建
推送代码后，GitHub Actions 会自动：
1. 安装 Node.js 和依赖
2. 安装 Android SDK
3. 构建 Android APK
4. 上传 APK 作为构建产物

## 构建产物
构建成功后，你可以在：
- Actions 标签页 → 最新工作流运行 → Artifacts
- 下载 `android-apk` 文件（包含 release APK）

## 注意事项
- 免费账户每月有 2000 分钟构建时间
- 每次构建大约消耗 10-15 分钟
- 构建失败时可以查看详细日志进行调试