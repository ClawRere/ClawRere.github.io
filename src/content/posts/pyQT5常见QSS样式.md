---
title: pyQT5常见QSS样式
author: leidada
date: '2024-06-13 11:27'
updated: '2024-06-13 11:33'
abbrlink: ef0e162e
keywords: 'pyqt5,python,知识库,QSS'
tags:
  - pyqt5
  - python
  - qss
  - 知识库
  - 基础样式
hide: false
hidden: false
aside: true
comments: true
description:
cover:
sticky:
top_img:
categories:
---

## 平铺背景图
```
def paintEvent(self, event):
        painter = QPainter(self)
        pixmap = QPixmap("./image/background.png")
        # 绘制窗口背景，平铺到整个窗口，随着窗口改变而改变
        painter.drawPixmap(self.rect(), pixmap)
```

## 控件风格

```
print(QStyleFactory.keys())# 获取系统可选风格
# ['windowsvista', 'Windows', 'Fusion']

# 全局使用风格
if __name__ == '__main__':
    app = QApplication(sys.argv)
    # print(QStyleFactory.keys())
    app.setStyle('Fusion') # 全局使用 Fusion 风格
    form = MyWidget()
    form.show()
    sys.exit(app.exec_())

# 单独控件使用
q_style = QStyleFactory.create("Fusion") # Fusion 风格
ui.控件.setStyle(q_style) # 控件使用风格
   
```
## Button
##### QPushButton、QToolButton: 按钮
 ```
QPushButton, QToolButton
{
	/*渐变白灰背景*/
	background-color: qlineargradient(spread:pad, x1:0, y1:0, x2:0.03, y2:1, stop:0 rgba(253, 253, 253, 255), stop:1 rgba(238, 238, 238, 255));
	border:1px solid rgba(0, 0, 0, 0.23);
	border-radius:5px;
}
/*悬停*/  
QPushButton:hover, QToolButton:hover
{
    background-color:rgb(234,244,252);
	border:1px solid rgb(44,169,225);
}
/*按下*/  
QPushButton:pressed, QToolButton::pressed
{
	border:1px solid rgb(44,169,225);
    background-color:rgb(235,246,247);
    /*左内边距为2像素，让按下时字向右移动2像素*/  
    padding-left:2px;
    /*上内边距为2像素，让按下时字向下移动2像素*/  
    padding-top:2px;
	font-weight:bold;
	color: rgb(0, 79, 115);
}
/*持续按下*/  
QPushButton::checked, QToolButton::checked
{
	border:1px solid rgb(44,169,225);
    background-color:rgb(235,246,247);
    /*左内边距为2像素，让按下时字向右移动2像素*/  
    padding-left:2px;
    /*上内边距为2像素，让按下时字向下移动2像素*/  
    padding-top:2px;
	font-weight:bold;
	color: rgb(0, 79, 115);
}
```
## QCheckBox、QRadioButton : 复选框、单选框
`自定义图片显示`
```
/*文字*/
QCheckBox, QRadioButton {
    spacing:5px;
    color:black;
}       
/*选择框*/
QCheckBox::indicator, QRadioButton::indicator {
    width:18px;
    height:18px;
} 
/*未选中状态的选择框，图片资源写自己的路径*/
QCheckBox::indicator:unchecked, QRadioButton::indicator:unchecked{
    image: url(:/btn/images/rb_no.png);
}
/*未选中时鼠标悬停状态，图片资源写自己的路径*/
QCheckBox::indicator:unchecked:hover, QRadioButton::indicator:unchecked:hover {
    image: url(:/btn/images/rb_no_hover.png);
}
/*未选中时不可控状态，图片资源写自己的路径*/
QCheckBox::indicator:unchecked:disabled, QRadioButton::indicator:unchecked:disabled{
    image: url(:/btn/images/rb_no_disabled.png);
}
/*选中状态的选择框，图片资源写自己的路径*/
QCheckBox::indicator:checked, QRadioButton::indicator:checked{
    image:url(:/btn/images/rb_yes.png);
}
/*选中状态不可控状态，图片资源写自己的路径*/
QCheckBox::indicator:checked:disabled, QRadioButton::indicator:checked:disabled{
    image:url(:/btn/images/rb_yes_disabled.png);
}
```

## Containers
#### GroupBox : 分组框
```
QGroupBox{
	background:rgba(253,253,253,0.1);
	border:1px solid rgba(0, 0, 0, 0.23);
	/*圆角5个像素*/
	border-radius:5px;
}
QGroupBox::title {
	/*标题样式*/
	padding-top:-5px;
	padding-left:5px;
	background-color:white;
}
```

##### QTabWidget : 分页控件
```
QTabWidget::pane{
	/*背景*/
	border: none;
	background: transparent;
}
/*标签样式*/
QTabBar::tab{
	background-color: rgb(244, 242, 232);
	width: 25ex;
	border-top-left-radius: 10px;
	border-top-right-radius: 10px;
	padding: 5px;
}
QTabBar::tab:selected{
	/*选中样式*/
	background-color: rgb(168, 193, 221);
	font-weight:bold;
	color: rgb(0, 79, 115);
}
QTabBar::tab:hover{
	/*鼠标悬停*/
	background-color: rgb(226, 233, 240);
}
QTabWidget{background-color: rgb(168, 193, 221);} # 配置以下代码使用
ui.tabWidget.setAttribute(Qt.WA_StyledBackground)  # 背景色应用到tab标题右侧
```
## Input Widgets
#### QLineEdit : 输入框
`圆角框`
```
QLineEdit{
	background:rgba(253,253,253,1);
	border:1px solid rgba(0, 0, 0, 0.23);
	/*圆角5个像素*/
	border-radius:5px;
}
/*焦点样式*/
QLineEdit:focus
{
	border:1px solid rgb(44,169,225);
}
```
##### QComboBox : 下拉框
`透明`
```
/*个别风格下显示最大行数设置*/
QComboBox{
	combobox-popup:0;
}
/*完整样式*/
QComboBox {
	border:1px solid rgba(0, 0, 0, 0.23);
    border-radius: 5px;
}
QComboBox:editable{
	background:rgba(253,253,253,0.9);
	border:1px solid rgba(0, 0, 0, 0.23);
}
QComboBox:focus{/*焦点样式*/
	border:1px solid rgb(44,169,225);
}
QComboBox::drop-down {/*设置右侧按钮*/
    width: 30px;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
	background-color: rgb(255, 170, 127);
}
QComboBox::down-arrow {/*设置右侧下拉箭头*/
	border-image: url(:/com/images/com_down.png);
	width: 20px;/*设置该图标的宽高*/
	height: 15px;
}
/*设置可选项行高*/
QAbstractItemView::item{
	min-height: 25px;
}
/*QAbstractItemView::item 配合以下代码使用*/
ui.QComboBox.setView(QListView())
```
## QSlider : 滑块
```
/*槽大小*/
QSlider::groove:horizontal{
	height: 14px;
	left: 7px;
	right: 7px;
	border-image: url(:/slider/images/slider_white.png); /*添加自己的图片路径*/
}
/*已滑过的槽*/
QSlider::sub-page:horizontal{
	border-image: url(:/slider/images/slider_gray.png); /*添加自己的图片路径*/
}
/*未滑过的槽*/
QSlider::add-page:horizontal{
	border-image: url(:/slider/images/slider_white.png); /*添加自己的图片路径*/
}
/*常态滑块样式*/
QSlider::handle:horizontal{
	width: 28px;
	height: 30px;
	margin-top: -7px;
	margin-left: -7px;
	margin-bottom: -7px;
	margin-right: -7px;
	border-image: url(:/slider/images/slider_point.png); /*添加自己的图片路径*/
}
/*鼠标悬浮滑块样式*/
QSlider::handle:horizontal:hover{
	width: 32px;
	height: 32px;
	margin-top: -9px;
	margin-left: -9px;
	margin-bottom: -9px;
	margin-right: -9px;
	border-image: url(:/slider/images/slider_point.png); /*添加自己的图片路径*/
}
```
## Item Widgets
#### QTreeWidget
```
QTreeWidget {
	background-color: rgb(139, 139, 139);
	border: none;
	outline: 0px;
}
/*子节点前置图*/
QTreeWidget::branch:has-siblings:!adjoins-item {
	border-image: url(:/tree/images/tree/child_line.png);
}
QTreeWidget::branch:has-siblings:adjoins-item {
	border-image: url(:/tree/images/tree/child_more.png);
}
QTreeWidget::branch:!has-children:!has-siblings:adjoins-item {
	border-image: url(:/tree/images/tree/child_end.png);
}
/*父节点前置图*/
QTreeWidget::branch:closed:has-children {
	border-image: none;
	image: url(:/tree/images/tree/close.png);
}
QTreeWidget::branch::open::has-children {
	border-image: none;
	image: url(:/tree/images/tree/open.png);
}
/*节点项状态*/
QTreeWidget::item {
	color: rgb(229, 229, 229);
	margin: 3px 0;
	height: 30px;
}
QTreeWidget::item:hover {
	color: #88b5df;
	border-style: none;
	background: #3c3c3c;
}
QTreeWidget::item:selected {
	color: #5582ac;
	border-style: none;
}
QTreeWidget::item:selected:active {
	color: #ffffff;
	background: #4a7ecb;
}
QTreeWidget::item:selected:!active {
	color: #010101;
	background: #a1a1a1;
}
/*顶部列头*/
QHeaderView::section {
	height: 38px;
	border:none;
	background-color: rgb(192, 214, 235);
}
```
## QTabelWidget : 表格
```
/*透明表格*/
QTableWidget{
	/*背景透明度0.25*/
	background-color: rgba(255, 255, 255, 0.25);
	border:1px solid rgba(0, 0, 0, 0.23);
	/*圆角5个像素*/
	border-radius:5px;
	/*表格线*/
	gridline-color: rgba(200, 200, 200, 1);
	/*选中框颜色*/
	selection-background-color: rgba(166, 206, 255, 0.5);	
	/*选中框文字颜色*/
	selection-color: rgb(0, 0, 0);
}
QTableView QTableCornerButton::section {
	/*左上角框透明*/
    background-color: rgba(255, 255, 255, 0);
}
QHeaderView::section {
	/*表头颜色透明*/
	background-color: rgba(255, 255, 255, 0);
}
/*QHeaderView::section 配合以下行列头透明使用*/
ui.tableWidget.horizontalHeader().setStyleSheet("background-color: transparent;")  # 列头透明
ui.tableWidget.verticalHeader().setStyleSheet("background-color: transparent;")  # 行头透明
/*以下代码使列头自适应，若列数过多不建议使用*/
ui.tableWidget.horizontalHeader().setStretchLastSection(True)
ui.tableWidget.horizontalHeader().setSectionResizeMode(QHeaderView.Stretch)  # 表头自适应
```
## 控件内部滚动条样式
```
/*垂直滚动条*/
ui.widget.verticalScrollBar().setStyleSheet(
    "QScrollBar{background-color: transparent; width:10px;}"
    "QScrollBar::handle{background:lightgray; border:2px solid transparent; border-radius:5px;}"
    "QScrollBar::handle:hover{background:gray;}"
    "QScrollBar::sub-line{background:transparent;}"
    "QScrollBar::add-line{background:transparent;}")
/*水平滚动条*/
ui.widget.horizontalScrollBar().setStyleSheet(
    "QScrollBar{background-color: transparent; height:10px;}"
    "QScrollBar::handle{background:lightgray; border:2px solid transparent; border-radius:5px;}"
    "QScrollBar::handle:hover{background:gray;}"
    "QScrollBar::sub-line{background:transparent;}"
    "QScrollBar::add-line{background:transparent;}")
```
## 通用规则

```css
/*  通配符选择器，用于共性样式设置，作用于所有控件 */
*{
    color: black;
	font-size: 12pt;
	font-weight: 100;
	font-family: Microsoft YaHei;
}
 
/*  类型选择器，即控件类型，作用于指定类控件及其子类控件 */
/*  QAbsractButton为按钮控件 */
QAbsractButton{
    background-color: pink;
}
 
/*  类选择器，即控件类，作用于指定类控件 */
.QPushButton{
    background-color: #f7f0fe;
    width：100px;
    height: 30px;
    margin: 15px 200px;
}
.QLabel{
    margin: 0 200px;
}
 
/*  名称选择器，通过setObjectName(name_str)设置控件名称，作用于指定名称的控件(注意名称不唯一，不同控件可有相同名称) */
#btn1{
    background-color: #fef6f0;
}
 
/*  同上 */
QPushButton#btn2{
    background-color: #f0fefe;
}
 
/*  属性选择器，作用于指定“属性名”或“属性名和值”的控件 */
.QLabel[attrName]{
    color: blue;
}
.QLabel[attrName='result_right']{
    color: red;
}
 
/*  所属选择器，作用于所属某父控件的控件(所属关系可直接即父子，可间接如爷孙 */
QDialog#quest1 QPushButton{
    color: black;
    width：50px;
    height: 30px;
    amrgin: 0
    background-color: red;
}
 
/*  子选择器，作用于所属某父控件的控件(所属关系是父子） */
QDialog#quest1>QPushButton{
    color: black;
    width：50px;
    height: 30px;
    amrgin: 0
    background-color: red;
}
 
/*  元素选择器，作用于复合控件的指定子元素。其中相关元素参数是固定的 */
QComboBox::dropdown{
    background-color:yellow;
}
 
/*  多选择器，逗号分割 */
QLabel,#btn1{
    background-color:yellow;
}
```