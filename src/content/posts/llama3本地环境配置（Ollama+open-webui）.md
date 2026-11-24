---
title: llama3本地环境配置（Ollama+open-webui）
author: leidada
date: '2024-05-20 14:53'
updated: '2024-05-20 14:53'
abbrlink: 6238e1de
comments: false
description:
cover:
categories:
keywords:
tags:
---
 这篇文章仅用于将我在Windows本地配置环境的过程记录下来，以便后续查找。

## 环境简介

简单起见，我在本地使用Ollama+open-webui的方式搭建一个可视化的ollama3的对话模型。其中，open-webui有两种安装方式（docker和从源码构建），官方推荐使用docker。也可以从这里自行查找其他的UI界面。

运行效果如下

![Open-Webui](https://docs.openwebui.com/assets/images/demo-6793d95448aa180bca8dafbd21aa91b5.gif)

## 安装Ollama

由于Ollama的模型默认会在C盘用户文件夹下的`.ollama/models`文件夹中， 为了修改模型路径，我们先配置环境变量OLLAMA_MODELS，设置为自己指定的路径：

![Pasted image 20240520151003.png](https://raw.githubusercontent.com/Eddie-Hyu/picx-images-hosting/master/poster/Pasted%20image%2020240520151003.png)

然后从官网下载Ollama：

[Ollama](llama.com)

Ollama默认下载位置为C盘，开机自动运行，只有命令行版本。因此我们后面需要配置一个UI界面。

**下载模型**
打开终端，输入命令
```
ollama pull llama3:8b
```
这里冒号前面代表模型名称，冒号后面代表tag，可以从这里查看llama3的所有tag。

在Ollama官网右上角的Models里面可以查看所有支持的模型。

可以检查一下模型是否被下载到我们指定的环境变量的位置。如果不行，可以在桌面右下角右键Ollama的图标，选择Quit Ollama ，然后重新在命令行输入任意的Ollama命令即可。

以下两种配置方式任选一种即可。如果两种方式的前置条件都没有，我个人觉得Windows下docker的环境配置要比Nodejs+Python要慢，建议直接从源码构建。

## 配置OpenWebUI（docker方式）

先完成docker的配置，然后在命令行输入：
```
docker pull ghcr.io/open-webui/open-webui:main
```

我这里就没有使用CUDA加速，如果要使用CUDA，按照官方的说明，需要将tag改为cuda，在WSL中安装Nvidia CUDA container toolkit。

选择一个合适的目录（用于挂载文件夹），右键打开终端，输入以下命令运行容器：
```
docker run -d -p 3000:8080 --add-host=host.docker.internal:host-gateway -v $PWD/open-webui:/app/backend/data --name open-webui --restart always ghcr.io/open-webui/open-webui:main
```

这样在本地的浏览器中输入`http://localhost:3000`即可看到UI界面。

## 配置OpenWebUI（Windows环境）

参考文档：https://docs.openwebui.com/getting-started/#how-to-install-without-docker​

**环境要求**：

Node.js >= 20.10 or Bun >= 1.0.21
Python >= 3.11
我本地使用的环境是Nodejs 20.12+Python 3.12，推荐使用vscode创建Python虚拟环境，有个插件叫Python Environment Manager，安装后左边侧栏中会显示一个Python的图标，用它创建venv或conda虚拟环境很方便。注意这里的venv环境默认在当前工作区下创建.venv文件夹作为虚拟环境。

后续Backend部分的命令均在激活Python虚拟环境的vscode的终端中运行。

选择一个文件夹，依次输入以下命令即可：
```
git clone https://github.com/open-webui/open-webui.git
cd open-webui/

# Copying required .env file
cp .env.example .env

# Building Frontend Using Node
npm i
npm run build

# Serving Frontend with the Backend
cd .\backend
pip install -r requirements.txt -U
.\start_windows.bat
```

在本地的浏览器中输入`http://localhost:8080`即可看到UI界面。

这里如果在局域网中使用，将localhost替换为主机IP地址可以正常访问该网页。