@echo off

REM 简化版OA系统GitHub Pages部署脚本

REM 设置GitHub仓库信息
set GITHUB_URL=https://github.com/YD030126/New-repository.git
set GITHUB_USERNAME=YD030126
set REPO_NAME=New-repository

REM 检查Git是否安装
git --version >nul 2>nul
if %errorlevel% neq 0 (
echo 错误：未找到Git。请先安装Git，然后再运行此脚本。
echo 您可以从 https://git-scm.com/downloads 下载Git。
pause
exit /b 1
)

REM 检查是否已初始化Git仓库
if not exist .git (
echo 初始化Git仓库...
git init
)

REM 添加所有文件到Git
echo 添加文件到Git...
git add .

REM 提交更改
echo 提交更改...
git commit -m "部署到GitHub Pages" || echo 没有需要提交的更改

REM 检查是否已连接到GitHub仓库
git remote | findstr /i "origin" >nul 2>nul
if %errorlevel% neq 0 (
echo 添加GitHub远程仓库...
git remote add origin %GITHUB_URL%
)

REM 推送到GitHub
echo 推送到GitHub...
git push -u origin main --force
if %errorlevel% neq 0 (
echo 推送失败，请确保您有GitHub仓库的访问权限，并已正确配置Git凭证。
echo 提示：如果您使用双因素认证，需要使用个人访问令牌作为密码。
pause
exit /b 1
)

REM 部署到GitHub Pages
echo 部署到GitHub Pages...
npm run deploy
if %errorlevel% neq 0 (
echo 部署失败，请手动检查问题。
pause
exit /b 1
)

echo ====================================================
echo 部署成功！
echo 您的OA系统已部署到：
echo https://%GITHUB_USERNAME%.github.io/%REPO_NAME%
echo 请等待几分钟后访问该URL查看部署效果。
echo ====================================================
pause