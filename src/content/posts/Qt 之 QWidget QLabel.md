---
title: Qt 之 QWidget QLabel
author: leidada
date: '2024-06-12 17:04'
updated: '2024-06-12 17:08'
abbrlink: 7fa6bc99
keywords: 'pyqt5,python,知识库,QWidget,QLabel'
tags:
  - pyqt5
  - python
  - 知识库
hidden: false
aside: true
comments: true
description:
cover:
sticky:
top_img:
categories:
hide:
---

## 一、窗口组件
图形用户界面由不同的窗口 和 窗口组件构成。

组件的类型：
- 容器类：（父组件） 用于包含其他的界面组件。
- 功能类：（子组件）用于实现特定的交互功能。

> 在 Qt 中，如果顶级组件没有父组件，就叫做窗口。

### 1. QWidget 组件
QWidget是Qt框架中的一个基类，用于创建窗口和用户界面的可视化组件。它提供了绘制、事件处理、布局管理、窗口管理等功能，是构建各种自定义窗口和用户界面的基础。

QWidget类是所有用户界面对象的基类。

下面是一些常用的QWidget类的函数及其作用：

| 函数                               | 作用                         |
| -------------------------------- | -------------------------- |
| QWidget(parent)                  | 构造函数，创建一个QWidget对象，并设置其父对象 |
| setWindowTitle(title)            | 设置窗口的标题                    |
| setGeometry(x, y, width, height) | 设置窗口的位置和大小                 |
| setFixedSize(width, height)      | 设置窗口的固定大小                  |
| setLayout(layout)                | 设置窗口的布局管理器                 |
| show()                           | 显示窗口                       |
| hide()                           | 隐藏窗口                       |
| close()                          | 关闭窗口                       |
| resize(width, height)            | 调整窗口的大小                    |
| move(x, y)                       | 移动窗口的位置                    |
| setStyleSheet(styleSheet)        | 设置窗口的样式表                   |
| setWindowIcon(icon)              | 设置窗口的图标                    |
| setWindowFlags(flags)            | 设置窗口的标志                    |
| setVisible(visible)              | 设置窗口的可见性                   |
| setEnabled(enabled)              | 设置窗口的可用性                   |
| size()                           | 返回窗口的大小                    |
| width()                          | 返回窗口的宽度                    |
| height()                         | 返回窗口的高度                    |
| pos()                            | 返回窗口的位置                    |
| x()                              | 返回窗口的 x 坐标                 |
| y()                              | 返回窗口的 y 坐标                 |
| isEnabled()                      | 检查窗口是否启用                   |
| isVisible()                      | 检查窗口是否可见                   |
| isHidden()                       | 检查窗口是否隐藏                   |
| closeEvent(event)                | 窗口关闭事件的处理函数                |
| resizeEvent(event)               | 窗口大小调整事件的处理函数              |
| moveEvent(event)                 | 窗口移动事件的处理函数                |

#### 2. QLabel组件
QLabel是Qt框架中的一个用于显示文本或图像的小部件。它是QWidget的子类，提供了一种简单方便的方法来展示静态文本或图像，并且可以通过设置样式和属性来进行自定义。

- `setText(text: str)`：设置标签的文本内容。可以使用HTML标记来格式化文本，例如设置字体、颜色、链接等。
- `setPixmap(pixmap: QPixmap)`：设置标签的像素图像。可以通过QPixmap类的构造函数或从文件加载图像来创建QPixmap对象。
- `setAlignment(alignment: Qt.AlignmentFlag`)：设置标签中文本或图像的对齐方式。可以使用Qt.AlignmentFlag中的常量来指定不同的对齐方式，如居中、靠左、靠右等。
- `setWordWrap(enabled: bool)`：设置标签的自动换行功能。当文本内容超过标签的宽度时，如果启用了自动换行，文本会自动换行到下一行显示。
- `setStyleSheet(styleSheet: str)`：设置标签的样式表。可以使用CSS样式语法来定义标签的外观，如字体、颜色、背景等。

| 方法             | 描述                     |
| -------------- | ---------------------- |
| setAlignment() | 设置文本对齐方式，如Qt.AlignLeft |
| setIdent()     | 设置文本缩进值                |
| setPixmap()    | 设置label为图片             |
| Text()         | 获取label的文本内容           |
| setText()      | 设置label的文本内容           |
| selectedText() | 返回所选文本                 |


> 特点：
QLabel可以显示纯文本、富文本和图像。
它可以自动调整大小以适应显示内容的大小。
QLabel可以设置对齐方式、字体、颜色等属性。

##### 2.1 常用方法：
- setText(text): 设置标签显示的文本内容
```
label.setText("Hello, PyQt5!")
```
- setPixmap(pixmap): 设置标签显示的图像内容。
```
label.setPixmap(QtGui.QPixmap("image.png"))
```

- setAlignment(alignment): 设置文本在标签中的对齐方式。
```
label.setAlignment(QtCore.Qt.AlignCenter)
```

- setStyleSheet(styleSheet): 设置标签的样式表。
```
label.setStyleSheet("color: blue; font-size: 18px;")
```

- clear(): 清除标签的内容。
```
label.clear()
```

##### 2.2 常用信号
- linkActivated(str): 当标签中的链接被点击时发射。
```
label.linkActivated.connect(link_clicked)

def link_clicked(url):
    print("Link clicked:", url)
```
- linkHovered(str): 当鼠标悬停在带有链接的文本上时发射。
```
label.linkHovered.connect(link_hovered)

def link_hovered(url):
    print("Link hovered:", url)
```
- customContextMenuRequested(QPoint): 当用户请求上下文菜单时发射。
```
label.customContextMenuRequested.connect(context_menu_requested)

def context_menu_requested(pos):
    print("Context menu requested at:", pos)
```
