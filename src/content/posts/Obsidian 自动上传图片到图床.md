---
title: Obsidian 自动上传图片到图床
author: leidada
date: 2024-06-02 20:52
updated: 2024-06-02 20:52
abbrlink: a96d8c11
aside: true
comments: false
description: 
cover: 
top_img: 
categories: 个人笔记
keywords: 知识库,Obsidian,hexo
tags:
  - 知识库
  - Obsidian
  - Hexo
---
##  Step1 安装好PicGo并连接上图床
**源库**
PicGo: https://github.com/Molunerfinn/PicGo
PicGo core: https://picgo.github.io/PicGo-Doc/

**直接下载安装**

| 下载源            | 地址/安装方式                                                     | 平台         | 备注  |
| ---- | ---- | ---- | ---- |
| GitHub Release | https://github.com/Molunerfinn/PicGo/releases               | All        | 国内下载速度可能会慢                    |
| 腾讯云COS         | https://github.com/Molunerfinn/PicGo/releases  附在更新日志结尾     | All        | 感谢 腾讯云COS 提供的赞助支持             |
| 山东大学镜像站        | https://mirrors.sdu.edu.cn/github-release/Molunerfinn_PicGo | All        | 感谢 山东大学镜像站 提供的镜像支持            |
| Scoop          | scoop bucket add extras & scoop install picgo               | Windows    | 感谢 @huangnauh 和 @Gladtbam 的贡献 |
| Chocolatey     | choco install picgo                                         | Windows    | 感谢 @iYato 的贡献                 |
| Homebrew       | brew install picgo --cask                                   | macOS      | 感谢 @womeimingzi11 的贡献         |
| AUR            | yay -S picgo-appimage                                       | Arch-Linux | 感谢 @houbaron 的贡献 |

**配置图床基础信息（以github为例）**
详情可访问官方配置文档页面，[点击访问](https://picgo.github.io/PicGo-Doc/zh/guide/config.html#%E5%9F%BA%E6%9C%AC%E6%93%8D%E4%BD%9C%E9%A2%84%E8%A7%88)
此处直接[查看github配置页面](https://picgo.github.io/PicGo-Doc/zh/guide/config.html#github%E5%9B%BE%E5%BA%8A)

1. 首先你得有一个GitHub账号。注册GitHub就不用我多言。

2. 新建一个仓库
![仓库](https://pic.molunerfinn.com/picgo/docs/create_new_repo.png)

记下你取的仓库名。

3. 生成一个token用于PicGo操作你的仓库：

访问：https://github.com/settings/tokens

然后点击`Generate new token`。

![创建新token](https://cdn.jsdelivr.net/gh/Eddie-Hyu/picx-images-hosting@master/poster/generate_new_token.png)

把repo的勾打上即可。然后翻到页面最底部，点击Generate token的绿色按钮生成token。
![生产token](https://cdn.jsdelivr.net/gh/Eddie-Hyu/picx-images-hosting@master/poster/20180508210435.png)


**注意：**这个token生成后只会显示一次！你要把这个token复制一下存到其他地方以备以后要用。
![记住token](https://cdn.jsdelivr.net/gh/Eddie-Hyu/picx-images-hosting@master/poster/copy_token.png)



## Step2 Obsidian安装PicGo插件
设置 → 第三方插件 → 安全模式 → 关闭 → 浏览（社区插件） → 搜索 `image auto upload` →安装
![image.png](https://cdn.jsdelivr.net/gh/Eddie-Hyu/picx-images-hosting@master/poster/20240602210224.png)

启用插件，按要求配置对应内容。建议使用`picgo core`模式，配置完文件路径即可生效。
`样例：`![github图床配置](https://pic.molunerfinn.com/picgo/docs/setup_github.png)
```json
{
  "repo": "", // 仓库名，格式是username/reponame
  "token": "", // github token
  "path": "", // 自定义存储路径，比如img/
  "customUrl": "", // 自定义域名，注意要加http://或者https://
  "branch": "" // 分支名，默认是main
}
```

## Step3 使用及注意事项
此时即可将图片直接拖入Obsidian中，picgo会自动完成上传功能

## 问题解决
最近碰到多次在obsidian中粘贴图片，但picgo上传失败的情况，这里做一下总结和解决。
##### 1. github的token失效
有些初次使用的用户，直接用GitHub生成token的默认配置，就会导致token只有60天有效期，过了有效期就需要重新创建token，步骤基本如下（可参考Step1的第3部分）：

> 访问：https://github.com/settings/tokens
> 然后点击`Generate new token`。
> 
> ![创建新token](https://cdn.jsdelivr.net/gh/Eddie-Hyu/picx-images-hosting@master/poster/generate_new_token.png)
> 
> 把repo的勾打上即可。然后翻到页面最底部，点击Generate token的绿色按钮生成token。
> ![生产token](https://cdn.jsdelivr.net/gh/Eddie-Hyu/picx-images-hosting@master/poster/20180508210435.png)
> 
> 
> **注意：**这个token生成后只会显示一次！你要把这个token复制一下存到其他地方以备以后要用。
> ![记住token](https://cdn.jsdelivr.net/gh/Eddie-Hyu/picx-images-hosting@master/poster/copy_token.png)

##### 2. picgo与picgocore配置不一致问题
这个问题也耽误我不少时间，花了半个多小时才找到具体问题。
在picgo的GUI（图形界面）中点击`打开配置文件`打开的是`data.json`文件，是picgo的配置。
![](https://cdn.jsdelivr.net/gh/Eddie-Hyu/picx-images-hosting@master/poster/20240731153057.png)

但是你更新了token(见问题1)，只调整了picgo的配置，没有更新picgo-core的配置文件
> Picgo-Core 配置文件: ~/.picgo/config.json

可以使用uTools/everything等文件搜索软件，直接搜索`.picgo`文件夹，更新`config.json`文件即可，格式大致如下：
```json
{
  "picBed": {
    "uploader": "github",
    "current": "github",

    "github": {
      "repo": "github用户名/仓库名",
      "token": "github token, 注意不要泄漏",
      "path": "ImageBed/",  // 仓库下的保存路径
      "customUrl": "https://raw.githubusercontent.com/github用户名/仓库名/分支名",
      "branch": "main"      // 分支名
    },

  },
  "picgoPlugins": {}
}
```



欢迎关注我的个人公众号【愿你总能遇到温柔的人】
![](https://cdn.jsdelivr.net/gh/Eddie-Hyu/picx-images-hosting@master/poster/20240731160239.png)
