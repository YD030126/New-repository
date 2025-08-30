# OA系统部署指南

## 项目概述

这是一个基于React开发的企业OA系统前端应用，已通过`npm run build`成功构建，生成了可部署的静态文件。

## 本地预览

在部署前，您可以使用Vite提供的预览功能在本地查看构建后的项目：

```bash
# 运行预览服务器
npm run preview
```

这将在本地启动一个开发服务器，通常默认端口为4173，您可以通过浏览器访问`http://localhost:4173`来查看项目。

## 部署到生产环境

由于这是一个纯静态的React应用，您可以将其部署到任何支持静态文件托管的环境中。

### 方法一：使用Nginx部署

1. **安装Nginx**
   - Ubuntu/Debian: `sudo apt install nginx`
   - CentOS/RHEL: `sudo yum install nginx`
   - Windows: 从[Nginx官网](http://nginx.org/)下载安装包

2. **配置Nginx**

   编辑Nginx配置文件（通常位于`/etc/nginx/nginx.conf`或`/etc/nginx/sites-available/default`）：

   ```nginx
   server {
       listen 80;
       server_name your-domain.com;  # 替换为您的域名
       
       root /path/to/your/project/dist;  # 替换为项目dist目录的绝对路径
       index index.html;
       
       location / {
           try_files $uri $uri/ /index.html;  # 重要：支持SPA路由
       }
       
       # 静态文件缓存设置
       location ~* \.(js|css|png|jpg|jpeg|gif|ico)$ {
           expires 30d;
           add_header Cache-Control "public, max-age=2592000";
       }
   }
   ```

3. **重启Nginx**
   ```bash
   sudo systemctl restart nginx
   ```

### 方法二：使用Apache部署

1. **安装Apache**
   - Ubuntu/Debian: `sudo apt install apache2`
   - CentOS/RHEL: `sudo yum install httpd`
   - Windows: 从[Apache官网](https://httpd.apache.org/)下载安装包

2. **配置Apache**

   创建或编辑Apache配置文件：

   ```apache
   <VirtualHost *:80>
       ServerName your-domain.com
       
       DocumentRoot /path/to/your/project/dist
       
       <Directory /path/to/your/project/dist>
           Options Indexes FollowSymLinks
           AllowOverride All
           Require all granted
       </Directory>
       
       # 支持SPA路由
       ErrorDocument 404 /index.html
   </VirtualHost>
   ```

3. **启用重写模块**
   ```bash
   sudo a2enmod rewrite
   sudo systemctl restart apache2
   ```

### 方法三：部署到云服务平台

#### Netlify
1. 访问[Netlify官网](https://www.netlify.com/)并注册登录
2. 点击"New site from Git"
3. 连接您的Git仓库
4. 配置构建设置：
   - Build command: `npm run build`
   - Publish directory: `dist`
5. 点击"Deploy site"

#### Vercel
1. 访问[Vercel官网](https://vercel.com/)并注册登录
2. 点击"New Project"
3. 连接您的Git仓库
4. 系统会自动检测项目配置，通常无需额外设置
5. 点击"Deploy"

#### GitHub Pages
1. 安装`gh-pages`包：
   ```bash
   npm install --save-dev gh-pages
   ```

2. 在`package.json`中添加脚本：
   ```json
   "scripts": {
     "deploy": "gh-pages -d dist"
   }
   ```

3. 运行部署命令：
   ```bash
   npm run build
   npm run deploy
   ```

## 配置说明

### API地址配置

如果需要连接实际的后端API，您需要修改`src/utils/config.js`文件中的API基础URL：

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

修改后，需要重新构建项目：
```bash
npm run build
```

### 生产环境优化建议

1. **启用Gzip压缩**
   - Nginx: 在配置文件中添加`gzip on;`
   - Apache: 启用`mod_deflate`模块

2. **使用HTTPS**
   - 可以通过Let's Encrypt获取免费SSL证书
   - 配置Web服务器支持HTTPS

3. **CDN加速**
   - 将静态资源部署到CDN以提高访问速度

## 常见问题排查

1. **路由问题**：如果刷新页面后出现404错误，请确保您的Web服务器配置了SPA路由支持

2. **API请求失败**：检查API地址是否正确，以及是否存在跨域问题

3. **资源加载缓慢**：考虑使用CDN加速和适当的缓存策略

## 开发说明

如果需要进一步开发或修改项目：

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 代码质量检查
npm run lint
```

## 联系信息

如有任何部署问题，请联系系统管理员或开发团队。