---
title: pyQT5学习纪要
author: leidada
date: '2024-06-12 15:36'
updated: '2024-06-13 08:08'
abbrlink: ad777b62
hide: true
hidden: true
aside: true
comments: true
description:
cover:
sticky:
top_img:
categories:
keywords:
tags:
---

1、先了解布局，制作一些简单的布局结构
2、学习Qt 之 QWidget QLabel区别，生成布局内容
3、学习QPushButtom相关，精细调整按钮的布局
4、学习并解决QScrollBar滚动条的优化
![](https://cdn.jsdelivr.net/gh/Eddie-Hyu/picx-images-hosting@master/poster/20240613081208.png)
整体：
```css
/*滚动条样式，这里测试发现必须设置background:red，否则会出现问题，原因不清楚，如果不需要设置颜色，可以设置transparent*/
QScrollBar:vertical
{
background:red; /*整个滚动条的背景颜色*/
width:30px; /*滚动条整体的宽度*/
/* 滑块活动区域间距，这个间距如果小于add-line和sub-line的高度滚动滑块将会覆盖add-line和sub-line，所以可以通过margin: 0px 0 0px 0;来隐藏滚动条两头区域*/
/* 这里应该系统应该给了默认了值，如果不填写，是正常的滚动条效果 */
margin:30px 0px 30px 0px;
}
```
handle:
```css
/*滑动区域*/
QScrollBar::handle:vertical
{
    background:rgba(50,50,50,100);
    border-radius:6px;/*圆角*/
    border: 2px solid rgb(8, 8, 8);/*边框*/
    /*这里设置无效，width由QScrollBar:vertical控制，height有窗口大小控制*/
    height:20px;
    width:20px;
    /*通过margin + hover 可以达到鼠标悬停后改变大小（hover中将内间距设小）*/
    margin:0px 5px 0px 5px;
}
QScrollBar::handle:vertical:hover
{
    background:rgba(50,50,50,130);
    border-radius:4px;
    margin:0px 3px 0px 3px;
}
```

5、学习滚动区域QScrollArea的优化
将滚动区域自带的横向滚动条给隐藏掉
```
scrollArea.setHorizontalScrollBarPolicy(Qt.ScrollBarAlwaysOff)
```
如果要隐藏纵向滚动条
```
self.scroll_area.setVerticalScrollBarPolicy(Qt.ScrollBarAlwaysOff)
```
将滚动条自动滚到最下面
```python
# 自动滑到最下面
self.scrollArea.verticalScrollBar().rangeChanged.connect(lambda: self.scrollArea.verticalScrollBar().setValue(
self.scrollArea.verticalScrollBar().maximum()))
```

6、学习QListWidget（列表控件）
对齐方式调整
```
#第一个参数表示组件, 第二个参数表示间距的比例, 第三个参数表示对齐方式
layout.addWidget(QPushButton('按钮1'), 1, Qt.AlignLeft | Qt.AlignTop)
layout.addWidget(QLabel('文本1'), 1, Qt.AlignLeft | Qt.AlignBottom)
```
设置间距
```
#设置按钮的间距
layout.setSpacing(40)
```