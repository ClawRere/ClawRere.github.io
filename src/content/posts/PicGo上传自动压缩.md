---
title: PicGo上传自动压缩
author: leidada
date: '2024-06-03 17:21'
updated: '2024-06-03 17:35'
abbrlink: 37642b95
keywords: '知识库,picgo,hexo'
tags:
  - 知识库
  - 教程
  - picgo
hide: false
aside: true
comments: false
description:
cover:
top_img:
categories:
---
### 开源地址
 
github:https://github.com/liujinpen/picgo-plugin-compress-tinypng.git
npm:https://www.npmjs.com/package/picgo-plugin-tinypng

#### 背景
由于github并不希望用户做图床，所以有大小限制，为了避免后期出现封号等问题，所以在picgo上传前进行压缩。

#### 效果
tinify官方：压缩后的图片对视觉的影响几乎不可见，但是在文件大小上有非常大的差别。
这里测试样本较少，但已经可以感受到效果了：
- 原始图片：1.78MB -> 压缩后：511.9KB
- 原始图片：27.4KB -> 压缩后：11.5KB

#### 步骤
注册tinify-API ——> 安装picgo ——> 安装picgo插件  ——>配置key ——>使用

#### 注册tinify-API
##### tinify-API使用
tinify为开发者提供了多种api的使用方法，可以注册邮箱获取API key，一个API key每个月有500张免费次数可用，具体API的使用可以参考
https://tinify.cn/developers
- 申请完成会给你发一个邮件
![tinify注册](https://cdn.jsdelivr.net/gh/Eddie-Hyu/picx-images-hosting@master/poster/20240603172917.png)
- 点击`Visit your dashboard`跳转API页面，保存`key`后续使用。
##### 安装picgo
1. 使用插件模板
使用插件模板首先需要全局安装picgo
```
npm install picgo -g
```

2. PicGo-core
参考[官方插件开发文档](https://picgo.github.io/PicGo-Core-Doc/)

3. github下载
- [github官网](https://github.com/Molunerfinn/PicGo)

##### 安装picgo插件 
1. 打开`插件设置`-查找`tinypng`插件
![](https://cdn.jsdelivr.net/gh/Eddie-Hyu/picx-images-hosting@master/poster/20240603174825.png)
2. 将第一步获得的key填入插件`配置`，并`启用`插件
![配置插件](https://cdn.jsdelivr.net/gh/Eddie-Hyu/picx-images-hosting@master/poster/20240603175300.png)

