---
title: 修改cmd默认打开位置
author: leidada
date: 2024-06-08 23:11
updated: 2024-06-08 23:31
abbrlink: 228726b8
keywords: windows
tags:
  - windows
  - 日常
  - 知识库
hide: false
hidden: false
aside: true
comments: true
description: 
cover: 
sticky: 
top_img: 
categories:
---
# 1. 背景
因为喜欢用cmd运行命令，导致默认位置经常会不小心存入大量文件，为了解决这个问题，期望对cmd.exe默认打开位置做调整。

# 2. 如果常用<kbd>Win</kbd>+ <kbd>R</kbd> 进入cmd
#### 修改注册表
###### 打开注册表
 输入：<kbd>Win</kbd>+ <kbd>R</kbd>，输入 `regedit` ，点击【确定】，进入注册表。
 ![](https://cdn.jsdelivr.net/gh/Eddie-Hyu/picx-images-hosting@master/poster/20240608231556.png)

###### 找到Command Processor
进入`计算机\HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Command Processor`。
>建议直接复制，并在顶栏`全选`后粘贴。
![](https://cdn.jsdelivr.net/gh/Eddie-Hyu/picx-images-hosting@master/poster/20240608231700.png)

###### 新建`字符串值`
点击`右键`，选择`新建-字符串值`，增加一个变量（例如：AutoPath）
![](https://cdn.jsdelivr.net/gh/Eddie-Hyu/picx-images-hosting@master/poster/20240608231851.png)


###### 输入期望运行的命令（此处为进入指定目录）
输入`cd C:\Users\用户名\Desktop`
>注意：
>1. 不要加引号；
>2. 最好输入绝对地址；
![](https://cdn.jsdelivr.net/gh/Eddie-Hyu/picx-images-hosting@master/poster/20240608232017.png)
###### 运行cmd
 输入：<kbd>Win</kbd>+ <kbd>R</kbd>，输入 `cmd` ，点击【确定】，进入`命令行`。
 ![](https://cdn.jsdelivr.net/gh/Eddie-Hyu/picx-images-hosting@master/poster/20240608232245.png)
可以看到已经跳转到我们期望的目录
![](https://cdn.jsdelivr.net/gh/Eddie-Hyu/picx-images-hosting@master/poster/20240608232309.png)


#### 延伸思考
同样的方式可以加入一些其他默认命令，让打开cmd时自动运行，此处不作扩展，但建议慎用。



# 2. 如果常搜索`命令提示符`进入cmd
#### 先使用`搜索`功能找到命令提示符

![](https://cdn.jsdelivr.net/gh/Eddie-Hyu/picx-images-hosting@master/poster/20240608232520.png)

#### `打开文件位置`并选择`属性`

右键选择`打开文件位置`或者直接点击右侧对应选项均可。
在打开的目录中右键并选择`属性`值

![](https://cdn.jsdelivr.net/gh/Eddie-Hyu/picx-images-hosting@master/poster/20240608232756.png)

#### 输入目标目录
在`起始位置`中输入目标目录，并`保存`即可
![](https://cdn.jsdelivr.net/gh/Eddie-Hyu/picx-images-hosting@master/poster/20240608232906.png)

#### 效果验证
后面每次点击`命令提示符`，就可以看到可以直接进入期望的目录
![](https://cdn.jsdelivr.net/gh/Eddie-Hyu/picx-images-hosting@master/poster/20240608233008.png)
![](https://cdn.jsdelivr.net/gh/Eddie-Hyu/picx-images-hosting@master/poster/20240608232309.png)