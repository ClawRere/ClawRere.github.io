---
title: Hexo-live2d插件给你的博客加一只可爱的看板娘
author: leidada
date: '2024-05-02 22:11'
updated: '2024-05-02 22:11'
abbrlink: 655c5b56
aside: true
comments: false
description:
cover:
top_img:
categories:
keywords:
tags:
---
 ---
### 简介
放一只简简单单的看板娘, 没有什么互动, 安安静静的陪着你读博客.
插件github地址 —> [hexo-helper-live2d](https://github.com/EYHN/hexo-helper-live2d)
模型地址 —>[模型](https://github.com/xiazeyu/live2d-widget-models)
我的博客效果图 —> [磊大大'Blog](https://eddie-hyu.github.io/)

### 模块安装

```
npm install --save hexo-helper-live2d

```
### 准备工作
以`live2d-widget-model-koharu`模型为例

在博客根目录下创建一个`live2d_models`文件夹.
使用`npm install live2d-widget-model-koharu`下载模型, 并将模型目录`live2d-widget-model-koharu`从`node_modules`里复制到`live2d_models`下.
进入`live2d-widget-model-koharu`, 把`assets`里的内容复制到外一层.
添加如下配置文件, 并修改use的模型名称为`live2d-widget-model-koharu`, 部署即可看到效果.
### 配置
向博客根目录的_config.yml配置文件添加配置, 可以自己微调
```
live2d:
  enable: true
  scriptFrom: local
  pluginRootPath: live2dw/
  pluginJsPath: lib/
  pluginModelPath: assets/
  tagMode: false
  debug: false
  model:
    use: live2d-widget-model-koharu # 使用的模型名称
  display:
    position: right # 在页面里的位置
    hOffset: 0 # 水平偏移量, 自己微调
    vOffset: -20 # 垂直偏移量, 自己微调
    width: 150 
    height: 300
  mobile:
    show: true
  react:
    opacity: 0.7 # 透明度

```
### 模型
现有的模型包及预览
```
live2d-widget-model-chitose
live2d-widget-model-epsilon2_1
live2d-widget-model-gf
live2d-widget-model-haru/01 (use npm install --save live2d-widget-model-haru)
live2d-widget-model-haru/02 (use npm install --save live2d-widget-model-haru)
live2d-widget-model-haruto
live2d-widget-model-hibiki
live2d-widget-model-hijiki
live2d-widget-model-izumi
live2d-widget-model-koharu
live2d-widget-model-miku
live2d-widget-model-ni-j
live2d-widget-model-nico
live2d-widget-model-nietzsche
live2d-widget-model-nipsilon
live2d-widget-model-nito
live2d-widget-model-shizuku
live2d-widget-model-tororo
live2d-widget-model-tsumiki
live2d-widget-model-unitychan
live2d-widget-model-wanko
live2d-widget-model-z16
```