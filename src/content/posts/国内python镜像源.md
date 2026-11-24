---
title: 国内python镜像源
author: leidada
date: 2024-06-08 20:47
updated: 2024-06-08 21:23
abbrlink: af140377
hide: false
hidden: false
aside: true
comments: true
description: 
cover: 
sticky: 
top_img: 
categories: 
keywords: python,知识库
tags:
  - 知识库
  - python
---
>这篇文章主要给大家介绍了关于python更换国内镜像源三种实用方法的相关资料，更换Python镜像源可以帮助解决使用pip安装包时速度过慢或无法连接的问题，需要的朋友可以参考下:

#### 官方镜像源（国外）：
```
https://pypi.python.org/simple
```

## pip下载源常用的国内镜像如下：

```
清华：https://pypi.tuna.tsinghua.edu.cn/simple/
阿里云：http://mirrors.aliyun.com/pypi/simple/
中国科技大学：https://mirrors.tuna.tsinghua.edu.cn/pypi/web/simple/
豆瓣：http://pypi.doubanio.com/simple/
```

下面以清华大学开源镜像站为例：

## 方法1：（永久更改） 
```python
pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple/
```

## 方法2：（永久更改）
windows环境下，在用户目录中创建一个文件夹，该文件夹的命名为pip；在该pip文件夹中新建一个文件`pip.ini`，`pip.ini`的内容如下：（完整路径：`C:\Users\用户名\pip\pip.ini`）

```ini
[global]
index-url=https://pypi.tuna.tsinghua.edu.cn/simple 
[install]  
trusted-host=pypi.tuna.tsinghua.edu.cn
disable-pip-version-check = true  
timeout = 6000
```

## 方法3：（临时性使用）
在安装库的时候，临时需要用到某个镜像，这里以清华大学镜像为例下载pandas库：

```python
pip install pandas -i https://pypi.tuna.tsinghua.edu.cn/simple/
```

