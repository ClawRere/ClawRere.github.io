---
title: CUDA&pytorch安装
author: leidada
date: 2024-06-08 19:58
updated: 2024-06-08 19:59
abbrlink: c6eee7c2
keywords: python,pytorch,GPU,cuda
tags:
  - python
  - pytorch
  - cuda
  - GPU
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
# 背景&简介

重装系统之后发现默认安装的pytorch、cuda版本似乎都有问题，于是重新安装。
步骤基本如下：
1. cuda安装：确认windows硬件版本->cuda版本选择&下载->cuda安装
2. pytorch安装：确认python版本&确认cuda版本->下载合适的版本(->安装慢问题解决)->版本检查
3. 效果验证 

## 1. cuda安装

#### 版本确认

```cmd
nvidia-smi
```
![](https://jsd.cdn.zzko.cn/gh/Eddie-Hyu/picx-images-hosting@master/poster/20240608203542.png)
#### cuda版本选择&下载
cuda下载地址：`https://developer.nvidia.com/cuda-toolkit-archive`
选择与本机匹配的版本，注意`CUDA Version`对应即可
![选择合适本机的版本](https://jsd.cdn.zzko.cn/gh/Eddie-Hyu/picx-images-hosting@master/poster/20240608203459.png)

![cuda下载](https://jsd.cdn.zzko.cn/gh/Eddie-Hyu/picx-images-hosting@master/poster/20240608203301.png)

#### cuda安装

![cuda临时安装文件夹](https://jsd.cdn.zzko.cn/gh/Eddie-Hyu/picx-images-hosting@master/poster/20240608203408.png)

![](https://jsd.cdn.zzko.cn/gh/Eddie-Hyu/picx-images-hosting@master/poster/20240608203951.png)
建议取消勾选`Visual Studio Integration`，部分人存在保存情况
![](https://jsd.cdn.zzko.cn/gh/Eddie-Hyu/picx-images-hosting@master/poster/20240608204002.png)

## 2. pytorch安装

#### python版本确认&cuda版本确认
运行以下命令查看本机的python版本
```pyhton
python -V
```
> 注：如果装了多个版本，要看对应的python版本，如：`python3 -V`

![](https://jsd.cdn.zzko.cn/gh/Eddie-Hyu/picx-images-hosting@master/poster/20240608233633.png)


#### 版本选择&下载
pytorch安装地址：`https://pytorch.org/`
选择对应的版本，复制下面的命令运行`pip`、`pip3`有区别。
![](https://jsd.cdn.zzko.cn/gh/Eddie-Hyu/picx-images-hosting@master/poster/20240608201333.png)

#### 下载慢问题解决
由于网站访问限制，官网下载速度很慢，甚至可能中断，建议根据上面的版本情况去找到对应版本直接下载。（可以利用idm高速下载。）
pytorh选择地址：https://download.pytorch.org/whl/torch

![](https://jsd.cdn.zzko.cn/gh/Eddie-Hyu/picx-images-hosting@master/poster/20240608211005.png)

#### torch验证
```python
import torch
 
print(torch.__version__)
print(torch.cuda.is_available())
print(torch.version.cuda)
```
响应如下基本正常：**`torch.cuda.is_available()`** 要为***True***
![响应](https://jsd.cdn.zzko.cn/gh/Eddie-Hyu/picx-images-hosting@master/poster/20240608230213.png)


