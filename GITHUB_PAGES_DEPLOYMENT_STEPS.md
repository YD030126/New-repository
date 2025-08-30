# GitHub Pages部署步骤详解

根据您的要求，本文件将详细指导您完成OA系统到GitHub Pages的部署过程。请按照以下步骤操作：

## 前提条件

1. 确保您的计算机已安装Git
2. 确保您拥有GitHub账号
3. 确保项目已完成`gh-pages`包的安装和配置（已完成）

## 步骤1：创建GitHub仓库

1. 登录您的[GitHub账号](https://github.com/)
2. 点击右上角的"+"> "New repository"
3. 填写仓库信息：
   - **Repository name**: 输入一个名称（例如 `oa-system`）
   - **Description**: 可选，输入仓库描述
   - **Visibility**: 选择"Public"（公共仓库可以免费使用GitHub Pages）
   - 不要勾选"Initialize this repository with a README"（因为您已有本地代码）
4. 点击"Create repository"

## 步骤2：配置本地Git仓库

1. 打开命令行工具（在Windows上可以使用PowerShell或Git Bash）
2. 导航到您的OA系统项目目录：
   ```bash
   cd g:\桌面\代码
   ```
3. 初始化Git仓库（如果尚未初始化）：
   ```bash
   git init
   ```
4. 将所有文件添加到Git：
   ```bash
   git add .
   ```
5. 提交更改：
   ```bash
   git commit -m "Initial commit"
   ```

## 步骤3：连接到GitHub仓库

1. 复制您刚刚创建的GitHub仓库的URL（例如：`https://github.com/your-username/oa-system.git`）
2. 在命令行中运行以下命令，将本地仓库连接到GitHub：
   ```bash
   git remote add origin https://github.com/your-username/oa-system.git
   ```
   （请将URL替换为您实际的仓库URL）

## 步骤4：更新package.json中的homepage字段

1. 用文本编辑器打开`package.json`文件
2. 将`homepage`字段的值替换为您的GitHub Pages URL：
   ```json
   "homepage": "https://your-username.github.io/oa-system"
   ```
   （请将URL替换为您实际的GitHub用户名和仓库名称）
3. 保存并关闭文件
4. 提交此更改：
   ```bash
   git add package.json
   git commit -m "Update homepage for GitHub Pages"
   ```

## 步骤5：推送到GitHub

1. 将本地代码推送到GitHub仓库：
   ```bash
   git push -u origin main
   ```
   （如果您的主分支名称不是`main`，请使用正确的分支名称，如`master`）
2. 输入您的GitHub用户名和密码或个人访问令牌（如果使用双因素认证）

## 步骤6：构建并部署到GitHub Pages

1. 运行以下命令构建项目：
   ```bash
   npm run build
   ```
2. 构建完成后，运行以下命令部署到GitHub Pages：
   ```bash
   npm run deploy
   ```
3. 等待部署完成，这可能需要几分钟时间

## 步骤7：验证部署

1. 部署完成后，访问以下URL查看您的网站：
   ```
   https://your-username.github.io/oa-system
   ```
2. 如果页面显示正常，则部署成功

## 步骤8：配置GitHub Pages（可选）

1. 访问您的GitHub仓库页面
2. 点击"Settings" > "Pages"
3. 在"Source"部分，确保已选择`gh-pages`分支和`/(root)`目录
4. 如果需要，可以在这里设置自定义域名

## 处理常见问题

### 1. 路由问题（页面刷新后404）

GitHub Pages默认不支持单页应用(SPA)的路由功能，刷新页面会出现404错误。解决方法：

1. 在`src`目录下创建`404.html`文件，内容与`index.html`完全相同
2. 修改`vite.config.js`，添加以下配置：
   ```javascript
   export default defineConfig({
     // 其他配置...
     build: {
       rollupOptions: {
         output: {
           // 确保所有静态资源都使用相对路径
           assetFileNames: 'assets/[name]-[hash].[ext]',
           chunkFileNames: 'assets/[name]-[hash].js',
           entryFileNames: 'assets/[name]-[hash].js'
         }
       }
     }
   })
   ```
3. 重新构建并部署：
   ```bash
   npm run build
   npm run deploy
   ```

### 2. API连接问题

如果您需要连接后端API，请确保：

1. 您的API支持跨域请求（已配置CORS）
2. 在`src/utils/config.js`中使用正确的API URL
3. 重新构建并部署项目

### 3. 部署后样式或功能异常

如果部署后网站样式或功能异常：

1. 检查浏览器控制台是否有错误信息
2. 确保所有静态资源都已正确加载
3. 检查文件路径是否正确（GitHub Pages使用相对路径）
4. 重新运行`npm run build`和`npm run deploy`命令

## 自动化部署（可选）

为了简化后续更新流程，您可以创建一个简单的脚本来自动完成构建和部署：

1. 在项目根目录创建`deploy.sh`文件（Windows用户可以创建`deploy.bat`）
2. 添加以下内容：
   
   **deploy.sh**（Mac/Linux）：
   ```bash
   #!/bin/bash
   echo "Building project..."
   npm run build
   
   echo "Deploying to GitHub Pages..."
   npm run deploy
   
   echo "Deployment complete!"
   ```
   
   **deploy.bat**（Windows）：
   ```batch
   @echo off
   echo Building project...
   npm run build
   
   echo Deploying to GitHub Pages...
   npm run deploy
   
   echo Deployment complete!
   pause
   ```
3. 保存文件并授予执行权限（Mac/Linux）：
   ```bash
   chmod +x deploy.sh
   ```
4. 以后更新网站时，只需运行此脚本即可

## 更新网站内容

当您需要更新网站内容时，只需执行以下步骤：

1. 对代码进行所需的更改
2. 提交更改：
   ```bash
   git add .
   git commit -m "描述您的更改"
   ```
3. 推送到GitHub：
   ```bash
   git push origin main
   ```
4. 构建并部署：
   ```bash
   npm run build
   npm run deploy
   ```

## 总结

通过以上步骤，您已经成功将OA系统部署到GitHub Pages上。GitHub Pages提供了免费的静态网站托管服务，非常适合个人项目和小型团队使用。

如果您在部署过程中遇到任何问题，请参考本指南中的常见问题部分，或查看GitHub Pages的官方文档。