---
title: Windows下安装使用ffmpeg
author: leidada
date: '2024-06-02 00:21'
updated: '2024-06-02 19:57'
abbrlink: 7d29b5b3
aside: true
comments: false
description:
cover:
top_img:
categories:
keywords:
tags:
---
 
### 1、ffmpeg下载

ffmpeg的官方网站是：http://ffmpeg.org/

Windows可用版本的下载地址：https://ffmpeg.org//download.html#build-windows

![image.png](https://raw.githubusercontent.com/Eddie-Hyu/picx-images-hosting/master/poster20240602204134.png)


分别选择“Version”、“Architecture”、“Linking”，选好后鼠标放在“Download Build”蓝色按钮上，会提示刚才选择的三个选项，如果没有问题就点击“Download Build”蓝色按钮，进行下载。

{% note info %}
【 Linking 中 Static、Shared、Dev区别】

① Static里面只有3个应用程序：ffmpeg.exe，ffplay.exe，ffprobe.exe，每个exe的体积都很大，相关的Dll已经被编译到exe里面去了。

② Shared里面除了3个应用程序之外，还有一些Dll，比如说avcodec-54.dll之类的。Shared里面的exe体积很小，他们在运行的时候，到相应的Dll中调用功能。

③ Dev版本是用于开发的，里面包含了库文件xxx.lib以及头文件xxx.h，这个版本不包含exe文件。
{% endnote %}
### 2、ffmpeg安装

下载完成后直接进行解压，然后配置环境变量就OK了，非常方便。

环境变量配置方法：
点击系统属性窗口中的环境变量按钮。在“用户变量”区域选择Path变量，点击编辑按钮，在其原始内容后输入ffmpeg的bin路径，例如我的就是“D:\ffmpeg-4.2.2-win64-static\bin”。下面有图示
【网上说只能用“7-zip”进行解压。因为我平时就用7-zip，所以没有验证其余的解压工具。如果你的压缩工具不行，就下载并安装7-zip吧。7-zip是一个免费的压缩管理程序，它可以让你打开FFmpeg文件。】


### 3、ffmpeg安装成功验证

打开命令提示符窗口。输入命令“ffmpeg –version”。如果命令提示窗口返回FFmpeg的版本信息，那么就说明安装成功了。

![image.png](https://raw.githubusercontent.com/Eddie-Hyu/picx-images-hosting/master/poster/20240602204217.png)

### 4、ffmpeg使用

大功告成！

你可以使用FFmpeg进行各种媒体格式转换啦~

你需要使用命令行才能够使用FFmpeg命令哦~

你可以在命令提示行中任意文件夹下运行FFmpeg~

