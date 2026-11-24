---
title: 本地源码一键同步github&自动发布
author: leidada
date: '2024-07-14 22:52'
updated: '2024-07-14 22:52'
abbrlink: c7a236f4
hide: true
hidden: true
aside: true
comments: true
description:
cover:
sticky:
top_img:
categories:
keywords:
tags:
---
## 1、测试链接
```sh
ssh -T -p 443 git@ssh.github.com
```
## 2、查看&修改用户信息
```sh
git config --global -l --show-origin
git config user.name
git config user.email
git config user.password
```
```sh
git config --global user.name "xxx"
git config --global user.email "xxx@qq.com"
git config --global user.password "xxx"
```
## 3、生产密钥对
```sh
# 创建 ssh key
ssh-keygen -o -t rsa -b 4096 -C "email@example.com"
# 查看公钥
cat ~/.ssh/id_rsa.pub
```
完成后登录 gitcode、github 等官网，点击用户头像，依次选择 settings→SSH keys→New SSH key，将公钥粘贴并保存。
## 4、推送
```sh
git config --global user.email 'XXX@XXX'
git config --global user.name  'YourName'

git add .

git commit -m 'DEL: public things which only for deploy'

git push origin main
```
## 5、拉取代码
```sh
# 下载一个项目和它的整个代码历史
git clone [repository_url]
# 下载一个项目和它的整个代码历史, 并将项目根目录重命名为repository_name
git clone [repository_url] [repository_name]
# 下载指定分支的代码
git clone -b [branch_name] [repository_url]
# 下载项目及其所有依赖子模块(递归拉取)
git clone --recurse-submodules [repository_url]
```

## 6、本地(直接下载zip)与github库关联
```shell

git init 
git remote add origin git@github.com:XXX/XXX.git
git remote update 
git checkout master
```



其他参考：https://blog.csdn.net/m0_37602827/article/details/108563600

## 异常问题解决
### 每次git都在桌面/某个固定位置生成.ssh文件，而非默认的/.ssh
一般是因为`$HOME`被更改
- 查看`$HOME`目录
```sh
echo $HOME
```
- 修改`$HOME`目录（`/A/B`为你需要替换的目录）
```sh
export HOME=/A/B
```