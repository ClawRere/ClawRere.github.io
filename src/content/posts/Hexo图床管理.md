---
title: Hexo图床管理
author: leidada
date: 2024-06-04 18:10
updated: 2024-06-04 18:10
abbrlink: 79a26702
hide: false
hidden: false
aside: true
comments: true
description: 
cover: 
sticky: 
top_img: 
categories: 个人笔记
keywords: hexo,butterfly,主題,doc,教程,文檔
tags:
  - Hexo
  - 教程
---
Hexo支持Markdown写作，所以我们在为博客添加图片时，都是采用如下格式:

```
![](http://xxx.com/bucketName/pictureName.jpg)
```
或者
```
<img src="http://xxx.com/bucketName/pictureName.jpg"></img>
```

但是如果图床更换，要更新很麻烦，所以想了以下办法

1. 我们先在博客中定义图片仓库的地址（如：http://xxx.com/bucketName）,并将其复制给某个全局变量pictureAdress；
2. 我们在添加图片时地址使用`pictureAdress`+`pictureName.jpg`的形式;
一旦，我们使用的存储平台失效了，即`pictureAdres`s目前的值失效了，我们只需要修改`pictureAdress`，赋予它新的图片仓库地址就可以啦。虽然这个过程也要上传图片，但是在更改文档时，只需要修改`pictureAdress`就可以了，并不需要一个图片地址一个图片地址的修改了，是不是简单很多了。
具体方法如下：
在本地的`hexo`中，找到你现在所用的主题目录，打开其中的`scripts`文件夹，然后创建一个`.js`文件（文件名任意，如`mypicture.js`等），在里面添加如下内容：
```

hexo.extend.tag.register('plant', function(args, content){
  var id = args[0];
  return 'http://plant.xxx.com/';
});
hexo.extend.tag.register('animal', function(args, content){
  var id = args[0];
  return 'http://animal.xxx.com/';
});
```
注意：上面的`http://plant.xxx.com/`和`http://animal.xxx.com/`即代表了`pictureAdress`的值，上面只是写了两个函数，一个代表某存储中植物图片库的地址，另一个代表了某存储中动物图片库的地址，大家可以根据自己的情况对库的数量进行增删。在我们写文章添加图片时，要加上这个库地址，比如我想添加一张苹果的图片，它在存储平台的真实地址是`http://plant.xxx.com/apple.jpg`，为了显示该图片，我们应该这么写：

```
<img src="{%plant%}apple.jpg"></img>
```
因为`{%plant%}`代表了`http://plant.xxx.com/`，`{%plant%}apple.jpg`就代表了`http://plant.xxx.com/apple.jpg`这个真实地址。一旦我们使用的存储平台失效了，我们只需要将图片上传到新平台，然后将{%plant%}的值改为新平台给我们的地址`http://plant.yyy.com/`就可以啦。
{% note info %}
使用此方法后用obsidian编辑会报错，暂时没有找到对应的解决办法。
{% endnote %}