---
title: PyQt5——QListWidget（列表控件）
author: leidada
date: '2024-06-13 08:36'
updated: '2024-06-13 08:44'
abbrlink: 6613d547
keywords: 'pyqt5,python,知识库,QListWidget'
tags:
  - pyqt5
  - python
  - 知识库
  - 基础知识
  - QListWidget
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

## 一、简介
QListWidget列表控件，类似于QListView列表视图。
支持鼠标拖放、复制、双击等操作。
可以在列表中添加/删除条目，列表中的每个条目都是一个QListWidgetItem 对象。

## 二、常用方法
#### QListWidget常用方法

| 方法                         | 描述                                                                                                                                                                                                                                            |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| additem()                  | 添加单个条目                                                                                                                                                                                                                                        |
| additems()                 | 一次添加多个条目，入参为一个列表[]                                                                                                                                                                                                                            |
| insertItem(row, item)      | 在列表索引位置插入item对象                                                                                                                                                                                                                               |
| insertItems(row, list)     | 在列表索引位置插入多个条目                                                                                                                                                                                                                                 |
| count()                    | 列表中的条目数量                                                                                                                                                                                                                                      |
| currentItem()              | 当前选中的列表项                                                                                                                                                                                                                                      |
| currentRow()               | 当前选中的行索引                                                                                                                                                                                                                                      |
| item(row)                  | 指定行索引的列表项                                                                                                                                                                                                                                     |
| row(item)                  | 列表项所在的行索引                                                                                                                                                                                                                                     |
| itemWidget(item)           | 返回与指定列表项关联的自定义部件，入参是item                                                                                                                                                                                                                      |
| setItemWidget(item,widget) | 为指定列表条目设置一个部件                                                                                                                                                                                                                                 |
| selectedItems()            | 返回所有选中的列表项                                                                                                                                                                                                                                    |
| findItems(text, flags)     | 使用给定的标志查到文本与字符串文本匹配的条目                                                                                                                                                                                                                        |
| removeItemWidget(item)     | 从列表项中移除自定义部件，通过对象移除列表条目                                                                                                                                                                                                                       |
| takeItem(index)            | 通过行索引移除列表条目                                                                                                                                                                                                                                   |
| setCurrentItem(item)       | 设置指定的列表项为当前选中项                                                                                                                                                                                                                                |
| setItemSelected(item)      | 设置列表项的选中状态                                                                                                                                                                                                                                    |
| setSortingEnabled          | 启用/禁用列表的排序                                                                                                                                                                                                                                    |
| sortItems()                | 根据指定的顺序对列表小部件中的所有项目排序，入参order=Qt.AscendingOrder                                                                                                                                                                                               |
| setCurrentRow(row)         | 设置指定行为当前选中项                                                                                                                                                                                                                                   |
| scrollToTop()              | 滚动条滑动到最顶端                                                                                                                                                                                                                                     |
| scrollToBottom()           | 滚动条滑动到最底端                                                                                                                                                                                                                                     |
| scrollToItem(Item, hint)   | 将指定的item滚动到hint所指的位置，hint取值包括：<br>- QAbstractItemView.PositionAtTop：滚动到视图的顶部<br>- QAbstractItemView.PositionAtBottom：滚动到视图的底部<br>- QAbstractItemView.PositionAtCenter：滚动到视图的中心<br>- QAbstractItemView.PositionAtViewport：根据视口的大小来确定滚动位置，默认值\| |
| clear()                    | 删除所有条目                                                                                                                                                                                                                                        |

#### QListWidgetItem常用方法
| 方法                   | 描述                                                                                                                                                                                                           |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| checkState()         | 返回复选状态                                                                                                                                                                                                       |
| setCheckState(state) | 设置复选框的勾选状态：<br>- Qt.Checked：选中状态<br>- Qt.PartiallyChecked：半选中状态<br>- Qt.Unchecked：没有被选中                                                                                                                      |
| icon()               | 返回列表项的图标                                                                                                                                                                                                     |
| setIcon(icon)        | 设置列表项的图标                                                                                                                                                                                                     |
| isHidden()           | 返回列表项是否隐藏                                                                                                                                                                                                    |
| setHidden(hide)      | 设置列表项是否隐藏                                                                                                                                                                                                    |
| text()               | 返回列表项的文本                                                                                                                                                                                                     |
| setText(text)        | 设置列表项的文本                                                                                                                                                                                                     |
| flags()              | 返回列表项的项目标志                                                                                                                                                                                                   |
| setFlags(flags)      | 设置列表项的标志属性，多个属性用\|分割<br>- Qt.ItemIsSelectable：允许选择列表项。<br>- Qt.ItemIsEditable：允许编辑列表项。<br>- Qt.ItemIsDragEnabled：允许拖动列表项。<br>- Qt.ItemIsDropEnabled：允许将其他项目拖到该列表项上。<br>- Qt.ItemIsUserCheckable：在列表项旁边显示复选框。 |

## 三、常用信号
|信号	|描述|
|-|--|
|itemClicked(item)	|当点击列表中的条目时，发射此信号|
|itemChanged(item)	|条目数据发生改变时，发射此信号|
|currentItemChanged(current,previous)	|当列表中的条目发生改变时，发射此信号|
|currentRowChanged(currentRow)	|当列表中的行发生改变时，发射此信号|
|currentTextChanged(currentText)	|当列表中的条目发生改变时，发射此信号|
|itemDoubleClicked(item)	|双击列表中的某个条目时，发射此信号|
|itemEntered(item)	|当鼠标光标进入列表的条目时，发射此信号|
|itemPressed(item)|	鼠标在列表的条目上按下时时，发射此信号|
|itemSelectionChanged()	|选择发生时，发射此信号|
## 四、示例
```python
import sys
from PyQt5.QtCore import Qt
from PyQt5.QtGui import QIcon
from PyQt5.QtWidgets import QApplication, QWidget, QVBoxLayout, QPushButton, QListWidget, QListWidgetItem
 
class QmyWidget(QWidget):
	def __init__(self, parent=None):
		super().__init__(parent)  # 调用父类的构造函数，创建QWidget窗体
		self.setupUi()

    def setupUi(self):
        """页面初始化"""
        # 设置窗体大小及标题
        self.resize(500, 400)
        self.setWindowTitle("QListWidget组件示例")
        # 创建布局
        self.layout = QVBoxLayout()
 
        # 创建QListWidget组件
        self.listWidget = QListWidget()
        self.listWidget.addItem("Item 1")  # 添加item
        self.listWidget.addItem("Item 2")
        self.listWidget.addItem("Item 3")
        self.listWidget.addItem("Item 4")
        # self.listWidget.addItems(["Item 1", "Item 2", "Item 3", "Item 4"])  # 添加多个item
        # QListWidget组件绑定信号
        self.listWidget.itemClicked.connect(self.on_listWidget_itemClicked)
        self.listWidget.itemChanged.connect(self.on_listWidget_itemChanged)
        self.listWidget.itemDoubleClicked.connect(self.on_listWidget_itemDoubleClicked)
 
        # 创建两个按钮组件
        self.button1 = QPushButton("新增Item", self)
        self.button1.clicked.connect(self.insert_item)  # 为button绑定槽函数
        self.button2 = QPushButton("删除Item", self)
        self.button2.clicked.connect(self.delete_item)   # 为button绑定槽函数
        self.button3 = QPushButton("查询Item", self)
        self.button3.clicked.connect(self.select_item)    # 为button绑定槽函数
        self.button4 = QPushButton("修改Item", self)
        self.button4.clicked.connect(self.change_item)  # 为button绑定槽函数
 
        # 将组件添加到布局中
        self.layout.addWidget(self.listWidget)
        self.layout.addWidget(self.button1)
        self.layout.addWidget(self.button2)
        self.layout.addWidget(self.button3)
        self.layout.addWidget(self.button4)
        # 为窗体添加布局
        self.setLayout(self.layout)
 
    def insert_item(self):
        """新增item槽函数"""
        print("item新增成功！")
        # 方式一：新增文本item
        self.listWidget.insertItem(0, "Item Text")
        # 方式二：新增QListWidgetItem对象item
        item_new = QListWidgetItem()
        item_new.setText("Item Obj")         # 为item设置文本
        item_new.setCheckState(False)        # 为item设置复选状态，不勾选
        item_new.setIcon(QIcon("logo.png"))  # 为item设置图标
        item_new.setFlags(Qt.ItemIsEnabled | Qt.ItemIsEditable | Qt.ItemIsUserCheckable)  # 为item设置标志
        self.listWidget.insertItem(0, item_new)
        # 方式三：新增其他部件的item
        item_button = QListWidgetItem()
        button = QPushButton("Button")
        self.listWidget.insertItem(0, item_button)
        self.listWidget.setItemWidget(item_button, button)  # 为item设置按钮部件
 
    def delete_item(self):
        """删除item槽函数"""
        print("item删除成功！")
        # 方式一：按行索引删除item对象
        self.listWidget.takeItem(0)
        # 方式一：按item对象删除item的小部件
        current_item = self.listWidget.currentItem()
        self.listWidget.removeItemWidget(current_item)
 
    def select_item(self):
        """查询item槽函数"""
        print("item查询成功！")
        # 隐藏所有的列表项
        for i in range(4):
            self.listWidget.item(i).setHidden(True)
        # 查询Item 1并取消隐藏
        item_list = self.listWidget.findItems("Item 1", Qt.MatchContains | Qt.MatchRecursive)
        for item in item_list:
            item.setHidden(False)
 
    def change_item(self):
        self.listWidget.item(0).setText('修改了第一行的值')
 
    def on_listWidget_itemClicked(self, item):
        """槽函数"""
        print('itemClicked信号：', item.text())
 
    def on_listWidget_itemChanged(self, item):
        print('itemChange信号：', item.text())
 
    def on_listWidget_itemDoubleClicked(self, item):
        print('双击信号：', item.text())

 
if __name__ == '__main__':
    app = QApplication(sys.argv)
    myMain = QmyWidget()
    myMain.show()
    sys.exit(app.exec_()
```