---
title: Hexo 如何隐藏文章
author: leidada
date: 2024-06-04 17:54
updated: 2024-06-04 17:55
abbrlink: 7fe8f75c
hidden: false
aside: true
comments: false
description: 
cover: 
top_img: 
categories: 
keywords: hexo,butterfly,主題,doc,教程,文檔
tags:
  - Hexo
  - 知识库
hide:
---
 
本 Hexo 插件可以在博客中隐藏指定的文章，并使它们仅可通过链接访问。

当一篇文章被设置为「隐藏」时，它不会出现在任何列表中（包括首页、存档、分类页面、标签页面、Feed、站点地图等），也不会被搜索引擎索引（前提是搜索引擎遵守 noindex 标签）。

只有知道文章链接的人才可以访问被隐藏的文章。

Github地址：https://github.com/printempw/hexo-hide-posts

安装
在站点根目录下执行`npm install hexo-hide-posts --save`

配置
在站点目录下的`_config.yml`中如下配置：

```yaml
# hexo-hide-posts
hide_posts:
  # 可以改成其他你喜欢的名字
  filter: hidden
  # 指定你想要传递隐藏文章的位置，比如让所有隐藏文章在存档页面可见
  # 常见的位置有：index, tag, category, archive, sitemap, feed, etc.
  # 留空则默认全部隐藏
  public_generators: []
  # 为隐藏的文章添加 noindex meta 标签，阻止搜索引擎收录
  noindex: true
 ```
举个栗子：设置 `filter: secret` 之后，你就可以在` front-matter` 中使用 `secret: true` 来隐藏文章了。

使用
在文章的属性中定义 hidden: true 即可隐藏文章。
```yaml
---
title: 'Hidden Post'
date: '2021/03/05 21:45:14'
hidden: true
---
 ```
 
虽然首页上被隐藏了，但你仍然可以通过 `https://hexo.test/lorem-ipsum/` 链接访问它。

你可以在命令行运行 `hexo hidden:list` 来获取当前所有的已隐藏文章列表。

插件也在 `Local Variables` 中添加了 `all_posts` 和 `hidden_posts` 变量，供自定义主题使用。