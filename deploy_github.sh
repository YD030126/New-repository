#!/bin/bash

# OA系统GitHub Pages部署脚本（Mac/Linux版）
# 此脚本将帮助您连接到GitHub仓库并完成部署

# 设置GitHub仓库信息
GITHUB_URL="https://github.com/YD030126/New-repository.git"
GITHUB_USERNAME="YD030126"
REPO_NAME="New-repository"

# 检查Git是否安装
if ! command -v git &> /dev/null
then
echo "错误：未找到Git。请先安装Git，然后再运行此脚本。"
echo "您可以从 https://git-scm.com/downloads 下载Git。"
exit 1
fi

# 检查是否已初始化Git仓库
if [ ! -d ".git" ]
then
echo "初始化Git仓库..."
git init
if [ $? -ne 0 ]
then
echo "初始化Git仓库失败，请手动检查问题。"
exit 1
fi
fi

# 添加所有文件到Git
echo "添加文件到Git..."
git add .
if [ $? -ne 0 ]
then
echo "添加文件到Git失败，请手动检查问题。"
exit 1
fi

# 提交更改
echo "提交更改..."
git commit -m "准备部署到GitHub Pages"
if [ $? -ne 0 ]
then
echo "提交更改失败，可能没有需要提交的更改。"
fi

# 检查是否已连接到GitHub仓库
CURRENT_REMOTE=$(git remote -v | grep -E "^origin.*fetch" | awk '{print $2}')

# 如果远程仓库不存在或不正确，则添加/更新
if [ -z "$CURRENT_REMOTE" ]
then
echo "添加GitHub远程仓库..."
git remote add origin $GITHUB_URL
if [ $? -ne 0 ]
then
echo "添加远程仓库失败，请检查URL是否正确。"
exit 1
fi
elif [ "$CURRENT_REMOTE" != "$GITHUB_URL" ]
then
echo "更新GitHub远程仓库URL..."
git remote set-url origin $GITHUB_URL
if [ $? -ne 0 ]
then
echo "更新远程仓库URL失败，请检查URL是否正确。"
exit 1
fi
fi

# 推送到GitHub
echo "推送到GitHub..."
git push -u origin main
if [ $? -ne 0 ]
then
echo "推送失败，请确保您有GitHub仓库的访问权限，并已正确配置Git凭证。"
echo "提示：如果您使用双因素认证，需要使用个人访问令牌作为密码。"
echo "您可以在GitHub的设置中生成个人访问令牌：Settings > Developer settings > Personal access tokens."
exit 1
fi

# 部署到GitHub Pages
echo "部署到GitHub Pages..."
npm run deploy
if [ $? -ne 0 ]
then
echo "部署失败，请手动检查问题。"
exit 1
fi

echo "===================================================="
echo "部署成功！"
echo "您的OA系统已部署到："
echo "https://$GITHUB_USERNAME.github.io/$REPO_NAME"
echo "请等待几分钟后访问该URL查看部署效果。"
echo "如果遇到路由问题（刷新页面404），请参考GITHUB_PAGES_DEPLOYMENT_STEPS.md文档中的解决方案。"
echo "===================================================="