# 免费云平台部署详细指南

本指南将详细介绍如何将OA系统部署到三大主流免费云平台：Netlify、Vercel和GitHub Pages。这些平台都提供免费的静态网站托管服务，非常适合部署React等前端应用。

## 前提条件

在开始部署前，请确保您已完成以下准备工作：

1. 项目已通过`npm run build`成功构建，生成了`dist`目录
2. 您有GitHub、GitLab或Bitbucket账号（用于代码托管）
3. 了解基本的Git操作

## 选项一：部署到Netlify

Netlify是一个非常适合静态网站的免费托管平台，提供自动构建和部署功能。

### 步骤1：准备代码仓库

1. 在GitHub上创建一个新的仓库
2. 将您的OA系统代码推送到这个仓库：

```bash
# 初始化Git仓库（如果尚未初始化）
git init

git add .
git commit -m "Initial commit"

git remote add origin https://github.com/your-username/your-repo-name.git
git push -u origin main
```

### 步骤2：部署到Netlify

1. 访问[Netlify官网](https://www.netlify.com/)并使用GitHub账号登录
2. 点击页面顶部的"New site from Git"按钮
3. 选择"GitHub"作为代码来源
4. 找到并选择您刚刚创建的OA系统仓库
5. 在配置页面，确认以下设置：
   - Branch to deploy: `main`（或您的主分支名称）
   - Build command: `npm run build`
   - Publish directory: `dist`
6. 点击"Deploy site"按钮开始部署
7. 等待部署完成后，Netlify会为您的网站分配一个随机域名（如 `your-site-name.netlify.app`）

### 步骤3：自定义域名（可选）

1. 点击"Domain settings"
2. 可以选择设置自定义域名或使用Netlify提供的子域名

## 选项二：部署到Vercel

Vercel是另一个优秀的静态网站托管平台，对个人项目免费，并且有很好的性能表现。

### 步骤1：准备代码仓库

（与Netlify的步骤1相同，确保代码已上传到GitHub）

### 步骤2：部署到Vercel

1. 访问[Vercel官网](https://vercel.com/)并使用GitHub账号登录
2. 点击右上角的"New Project"按钮
3. 找到并选择您的OA系统仓库
4. Vercel会自动检测项目类型和配置，通常无需手动修改设置
5. 点击"Deploy"按钮开始部署
6. 部署完成后，Vercel会为您的网站分配一个随机域名（如 `your-site-name.vercel.app`）

### 步骤3：自定义域名（可选）

1. 在项目页面点击"Settings" > "Domains"
2. 可以选择设置自定义域名或使用Vercel提供的子域名

## 选项三：部署到GitHub Pages

GitHub Pages是GitHub提供的免费静态网站托管服务，适合个人项目和小型应用。

### 步骤1：安装部署工具

在项目根目录运行以下命令安装`gh-pages`包：

```bash
npm install --save-dev gh-pages
```

### 步骤2：配置package.json

编辑`package.json`文件，添加以下内容：

```json
{
  "homepage": "https://your-username.github.io/your-repo-name",
  "scripts": {
    "deploy": "gh-pages -d dist"
  }
}
```

请将`https://your-username.github.io/your-repo-name`替换为您实际的GitHub Pages URL。

### 步骤3：构建并部署

运行以下命令构建项目并部署到GitHub Pages：

```bash
npm run build
npm run deploy
```

### 步骤4：验证部署

1. 部署完成后，访问`https://your-username.github.io/your-repo-name`查看您的网站
2. 如果需要，可以在GitHub仓库的"Settings" > "Pages"中配置自定义域名

## 配置API连接（重要）

由于这是一个纯前端应用，如果您需要连接后端API，需要修改`src/utils/config.js`文件中的API基础URL：

```javascript
// 修改前
export const config = {
  apiBaseUrl: 'http://localhost:3000/api',
  // 其他配置...
};

// 修改后
export const config = {
  apiBaseUrl: 'https://your-backend-api.com/api',
  // 其他配置...
};
```

修改后，需要重新构建和部署项目：

```bash
npm run build
# 然后根据您选择的平台运行相应的部署命令
# Netlify和Vercel通常会自动重新部署
# GitHub Pages需要运行 npm run deploy
```

## 免费平台特性对比

| 特性 | Netlify | Vercel | GitHub Pages |
|------|---------|--------|--------------|
| 免费额度 | 无限制项目，每月300分钟构建时间 | 无限制项目，带宽和存储有限制 | 无限制项目，每个项目1GB空间 |
| 自动部署 | ✅ | ✅ | 需要手动运行deploy命令 |
| 自定义域名 | ✅ | ✅ | ✅ |
| HTTPS支持 | ✅ | ✅ | ✅ |
| 环境变量 | ✅ | ✅ | ❌ |
| 构建缓存 | ✅ | ✅ | ❌ |
| 访问统计 | ✅ | ✅ | ❌ |

## 常见问题解决

### 1. 页面刷新后出现404错误

这是单页应用(SPA)的常见问题，需要配置服务器将所有路由请求重定向到index.html。

- **Netlify**: 在项目根目录创建`_redirects`文件，添加以下内容：
  ```
  /*  /index.html  200
  ```

- **Vercel**: 在项目根目录创建`vercel.json`文件，添加以下内容：
  ```json
  {
    "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
  }
  ```

- **GitHub Pages**: 对于React Router v4+，可以使用`HashRouter`代替`BrowserRouter`，或者按照GitHub Pages的指南配置路由。

### 2. API请求失败（跨域问题）

如果您的后端API没有配置CORS（跨域资源共享），可能会导致请求失败。解决方法：

- 在后端API中配置CORS，允许您的前端域名访问
- 使用Netlify或Vercel提供的代理功能

### 3. 部署后样式错乱

确保您的构建命令正确，并且`dist`目录包含了所有必要的CSS和JS文件。

### 4. 部署速度慢

- 考虑使用CDN加速静态资源
- 优化构建输出大小，移除不必要的依赖
- 对于GitHub Pages，可以考虑使用CDN服务如jsDelivr

## 小结

Netlify、Vercel和GitHub Pages都是非常优秀的免费静态网站托管平台，各有特色：

- 如果您需要最简单的部署流程和丰富的功能，推荐使用Netlify或Vercel
- 如果您已经在使用GitHub，并且项目较小，可以选择GitHub Pages
- 所有这些平台都提供免费的HTTPS和自定义域名支持

选择最适合您需求的平台，按照本指南的步骤操作，即可快速部署您的OA系统！