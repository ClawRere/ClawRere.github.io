---
title: Kimi等六家国产大模型API免费用（私藏）
author: leidada
date: '2024-05-31 00:49'
updated: '2024-05-31 00:49'
abbrlink: 1667ac28
keywords: '日常,知识库,AI'
tags:
  - 知识库
  - 日常
  - AI
comments: false
description:
cover:
categories:
---
阶跃星辰 (跃问StepChat) 

月之暗面（Kimi）

阿里通义 (Qwen) 

ZhipuAI (智谱清言) 

秘塔AI (metaso) 

聆心智能 (Emohaa) 

完美兼容openai接口，具体使用请看上一篇介绍，这里只简单讲一下如何搭建接口

**仅限自用，禁止对外提供服务或商用，避免对官方造成服务压力，否则风险自担！**

为了尽量简单方便，这里使用docker方式部署

#### Linux主机安装docker

```linux
sudo apt update
sudo apt install docker-ce
docker version
```

安装完成后应该可以看到打印的docker版本信息，类似这样

```linux
Client: Docker Engine - Community
 Version: 20.10.8
 API version: 1.41
 Go version: go1.16.9
 Git commit: f001303
 Built: Tue Sep 21 22:27:59 2021
 OS/Arch: linux/amd64
 Experimental: false

Server: Docker Engine - Community
 Engine Version: 20.10.8
 API version: 1.41 (minimum version 1.12)
 Go version: go1.16.9
 Git commit: f001303
 Built: Tue Sep 21 22:27:59 2021
 OS/Arch: linux/amd64
 Experimental: false
```

正常输出版本信息后执行以下命令，分别下载并运行六个镜像

```linux
sudo docker run -it -d --init --name kimi-free-api --restart=always -p 8000:8000 -e TZ=Asia/Shanghai vinlic/kimi-free-api:latest
sudo docker run -it -d --init --name step-free-api --restart=always -p 8001:8000 -e TZ=Asia/Shanghai vinlic/step-free-api:latest
sudo docker run -it -d --init --name qwen-free-api --restart=always -p 8002:8000 -e TZ=Asia/Shanghai vinlic/qwen-free-api:latest
sudo docker run -it -d --init --name glm-free-api --restart=always -p 8003:8000 -e TZ=Asia/Shanghai vinlic/glm-free-api:latest
sudo docker run -it -d --init --name metaso-free-api --restart=always -p 8004:8000 -e TZ=Asia/Shanghai vinlic/metaso-free-api:latest
sudo docker run -it -d --init --name emohaa-free-api --restart=always -p 8005:8000 -e TZ=Asia/Shanghai vinlic/meohaa-free-api:latest
```

运行结束之后，执行命令
```linux
ss -ant
```

当看到本机的8000-8005端口都开启之后说明安装成功了。

这时就可以使用本机的ip地址加端口号访问相应的服务了。

月之暗面（Kimi）：8000

跃问（StepChat）：8001

阿里通义 (Qwen) ：8002

智谱清言（GLM) ：8003

秘塔AI (metaso) ：8004

聆心智能 (Emohaa) ：8005

通过浏览器访问就能看到这样的页面

![Pasted image 20240531005254.png](https://raw.githubusercontent.com/Eddie-Hyu/picx-images-hosting/master/poster/Pasted%20image%2020240531005254.png)

建议主机地址绑定域名隐藏端口。

#### Windows主机

下载桌面版Docker

https://www.docker.com/products/docker-desktop/

下载双击安装

安装完成后管理员权限打开cmd窗口

```cmd
docker run -it -d --init --name kimi-free-api --restart=always -p 8000:8000 -e TZ=Asia/Shanghai vinlic/kimi-free-api:latest
docker run -it -d --init --name step-free-api --restart=always -p 8001:8000 -e TZ=Asia/Shanghai vinlic/step-free-api:latest
docker run -it -d --init --name qwen-free-api --restart=always -p 8002:8000 -e TZ=Asia/Shanghai vinlic/qwen-free-api:latest
docker run -it -d --init --name glm-free-api --restart=always -p 8003:8000 -e TZ=Asia/Shanghai vinlic/glm-free-api:latest
docker run -it -d --init --name metaso-free-api --restart=always -p 8004:8000 -e TZ=Asia/Shanghai vinlic/metaso-free-api:latest
docker run -it -d --init --name emohaa-free-api --restart=always -p 8005:8000 -e TZ=Asia/Shanghai vinlic/meohaa-free-api:latest
```

依次执行六条命令

结束后再浏览器输入本机地址+相应端口号即可访问

