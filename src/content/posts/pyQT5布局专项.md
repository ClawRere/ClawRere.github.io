---
title: pyQT5布局专项
author: leidada
date: '2024-06-12 15:19'
updated: '2024-06-12 15:29'
abbrlink: c7773f9e
keywords: 'pyqt5,python,知识库'
tags:
  - pyqt5
  - python
  - 布局
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

## 了解页面布局

1. 垂直布局（VBoxLayout）：这种布局将窗口部件（widget）按垂直方向排列，适用于创建从上到下的布局结构。
2. 水平布局（HBoxLayout）：与垂直布局相对，水平布局按水平方向排列窗口部件，适合于并排布置元素。
3. 网格布局（GridLayout）：网格布局提供了更为灵活的布局方式，可以将部件按行列矩阵方式排列，非常适合于需要对元素进行精确排列的场景。
4. 表单布局（FormLayout）：这种布局特别适用于表单类型的界面，能够高效地排列标签和输入框等元素。
5. 组合布局：在复杂的界面设计中，经常需要将以上几种布局组合使用，以实现更为复杂和灵活的界面布局。
### 1. 水平布局（QHBoxLayout）
##### 基本概念和用途：
水平布局，即QHBoxLayout，是PyQt5中的一种布局方式，用于按水平方向排列窗口部件（Widgets）。这种布局特别适合于需要并排显示一系列控件的情况，如工具栏按钮、水平排列的表单元素等。使用QHBoxLayout可以轻松实现元素的左对齐、右对齐或均匀分布，同时确保在窗口大小变化时各元素的相对位置保持一致。
##### 创建和使用步骤：
- 创建布局对象： 首先实例化一个QHBoxLayout对象。
- 添加控件： 通过addWidget方法将需要水平排列的控件添加到布局中。
- 设置布局： 将这个布局对象应用到一个容器（如QWidget或QMainWindow）上。
- 调整布局属性： 可以设置间距、对齐方式等属性以满足具体需求。
##### 代码示例：
```python
from PyQt5.QtWidgets import QApplication, QWidget, QHBoxLayout, QPushButton

app = QApplication([])
window = QWidget()
layout = QHBoxLayout()

# 添加控件
button1 = QPushButton('Button 1')
button2 = QPushButton('Button 2')
layout.addWidget(button1)
layout.addWidget(button2)

# 应用布局
window.setLayout(layout)
window.show()
app.exec_()
```
##### 管理控件：
- **添加控件**： 使用addWidget将控件添加到布局中。
- **移除控件**： 要移除控件，可以使用removeWidget方法，但需注意，这并不会删除控件本身，只是将其从布局中移除。
- **调整控件间距**： 使用setSpacing方法可以调整控件之间的间距。
- **设置伸缩因子**： 可以为各控件设置不同的伸缩因子（stretch factor），以控制它们在布局中的相对大小。
##### 常见用例和最佳实践：
- **工具栏创建**： 水平布局非常适合于创建工具栏或状态栏等界面元素。
- **表单行排列**： 在创建表单时，可以使用水平布局排列一行中的标签和输入框。
- **响应式设计**： 在设计窗口时考虑动态调整大小，确保控件在不同窗口大小下也能保持合理的布局和间距。
- **嵌套布局**： 可以将水平布局嵌入到其他布局中，如垂直布局或网格布局，以实现更复杂的布局需求。
通过这样的方式，QHBoxLayout提供了一种简单而灵活的方法来创建直观、响应式的水平布局界面。

### 2. 垂直布局（QVBoxLayout）
特点和实现方法：
垂直布局，即QVBoxLayout，是PyQt5中用于按垂直方向排列控件的布局管理器。与水平布局相对，垂直布局将控件从上到下依次排列，适用于需要垂直堆叠控件的场景。这种布局方式在管理控件大小和位置方面极为有效，尤其是在处理具有不同大小的控件时，可以确保它们垂直对齐且在窗口大小改变时自动调整。

##### 创建和使用步骤：

- **实例化QVBoxLayout**： 首先创建一个QVBoxLayout对象。
- **添加控件**： 通过addWidget方法将控件添加到布局中。
- **应用布局**： 将布局设置到一个容器（如QWidget）上。
- **调整属性**： 可以根据需要设置控件间距、伸缩因子等属性。
##### 代码示例：
```python
from PyQt5.QtWidgets import QApplication, QWidget, QVBoxLayout, QPushButton

app = QApplication([])
window = QWidget()
layout = QVBoxLayout()

# 添加控件
button1 = QPushButton('Button 1')
button2 = QPushButton('Button 2')
layout.addWidget(button1)
layout.addWidget(button2)

# 应用布局
window.setLayout(layout)
window.show()
app.exec_()
```

##### 适用场景讨论：
垂直布局尤其适合于以下场景：

- 表单排列： 当需要创建多行表单元素时，垂直布局可以使标签和输入框整齐地排列。
- 信息展示： 在需要从上到下顺序展示信息的界面，如设置菜单或信息汇总面板，垂直布局非常合适。
- 组合使用： 在复杂界面设计中，垂直布局常与水平布局或其他布局类型结合使用，以实现更复杂的布局需求。
- 空间管理： 在有限的空间内有效管理一系列控件，垂直布局可以确保它们按顺序排列，易于浏览和操作。
总的来说，QVBoxLayout为PyQt5中的界面设计提供了一种简单且高效的垂直排列控件的方式，使得在多种应用场景中都能实现直观和用户友好的界面布局。

### 3. 网格布局（QGridLayout）
##### 原理和灵活性：
网格布局，即QGridLayout，是PyQt5中提供的一种布局方式，允许开发者将控件放置在网格的行和列中。这种布局极大地增加了界面设计的灵活性，适合于需要精确控制控件位置和大小的复杂界面设计。网格布局通过行和列的概念，允许控件跨越多个行或列，这在创建形式多样的用户界面时非常有用。

##### 创建和使用方法：

- 实例化QGridLayout： 首先创建一个QGridLayout对象。
- 添加控件： 使用addWidget方法，并指定控件的行、列位置，以及它所跨越的行数和列数。
- 应用布局： 将布局设置到容器（如QWidget）上。
- 调整属性： 可以设置行列间距、对齐方式等，以满足具体设计需求。
##### 代码示例：

```python
from PyQt5.QtWidgets import QApplication, QWidget, QGridLayout, QPushButton

app = QApplication([])
window = QWidget()
layout = QGridLayout()

# 添加控件
button1 = QPushButton('Button 1')
button2 = QPushButton('Button 2')
button3 = QPushButton('Button 3')
button4 = QPushButton('Button 4')

layout.addWidget(button1, 0, 0) # 第一行，第一列
layout.addWidget(button2, 0, 1) # 第一行，第二列
layout.addWidget(button3, 1, 0, 1, 2) # 第二行，跨越两列
layout.addWidget(button4, 2, 0, 2, 1) # 跨越两行，第一列

# 应用布局
window.setLayout(layout)
window.show()
app.exec_()
```

##### 应用场景：
网格布局特别适合以下应用场景：

- 表单设计： 当需要对表单元素进行精确排列时，网格布局提供了更大的控制度。
- 复杂界面： 在需要将控件精确放置在特定位置的复杂界面设计中，网格布局显得尤为重要。
- 仪表板和工具面板： 对于需要整齐排列大量控件的仪表板或工具面板，网格布局能够提供清晰和一致的界面结构。
- 响应式设计： 网格布局可以适应不同的窗口大小，保持控件的相对位置和大小，从而实现响应式设计。
通过上述方式，QGridLayout在PyQt5中为开发者提供了一种强大且灵活的工具，以创建布局精确、视觉上平衡的复杂用户界面。

### 4. 表单布局（QFormLayout）
##### 结构和适用场景：
表单布局，即QFormLayout，是PyQt5提供的一种专门用于表单设计的布局方式。它以行为单位组织控件，每行通常包含一个标签（Label）和一个输入控件（如文本框、下拉列表等）。这种布局非常适合于需要快速创建清晰、结构化表单界面的应用场景，如用户注册、数据输入、设置配置等。

##### 创建和使用方法：

- 实例化QFormLayout： 首先创建一个QFormLayout对象。
- 添加表单行： 使用addRow方法添加表单的行，可以同时添加标签和对应的输入控件。
- 应用布局： 将此布局应用到容器（如QWidget）上。
- 调整布局属性： 可以设置行间距、对齐方式等，以满足具体的设计需求。
##### 代码示例：

```python
from PyQt5.QtWidgets import QApplication, QWidget, QFormLayout, QLineEdit, QLabel

app = QApplication([])
window = QWidget()
layout = QFormLayout()

# 添加表单行
layout.addRow(QLabel('Name:'), QLineEdit())
layout.addRow(QLabel('Email:'), QLineEdit())
layout.addRow(QLabel('Age:'), QLineEdit())

# 应用布局
window.setLayout(layout)
window.show()
app.exec_()
```

##### 表单布局的作用：

- 用户输入： QFormLayout提供了一种高效的方法来收集用户输入，特别适用于需要用户填写多个字段的情况。
- 数据收集： 在数据收集和处理的应用中，表单布局能够提供清晰的界面，帮助用户准确无误地输入数据。
- 布局一致性： 通过标准化的行结构，表单布局确保整个表单的一致性和专业性，提升用户体验。
- 易于维护和扩展： 在后续需要添加更多字段或调整表单结构时，QFormLayout使得维护和扩展变得更加简单。
总体来说，QFormLayout在PyQt5中为开发者提供了一种简洁、有效的方式来创建结构化和用户友好的表单界面，特别适合于需要大量用户输入和数据收集的应用。

### 5. 表单布局（QFormLayout）
##### 结构和适用场景：
表单布局，即QFormLayout，是PyQt5中用于创建表单的专用布局管理器。它自动为每个表单字段创建一行，通常包括一个标签（Label）和一个输入控件（如文本框、下拉列表等）。这种布局特别适合于需要快速构建结构化和整洁的表单界面的场景，如用户注册、数据输入、设置配置等。

##### 创建和使用方法：

- 实例化QFormLayout： 创建一个QFormLayout对象。
- 添加表单行： 使用addRow方法，可以同时添加标签和对应的输入控件。
- 应用布局： 将这个布局应用到一个容器（如QWidget）上。
- 调整布局属性： 可以设置行间距、对齐方式等，以满足具体的设计需求。
##### 代码示例：

```python
from PyQt5.QtWidgets import QApplication, QWidget, QFormLayout, QLineEdit, QLabel

app = QApplication([])
window = QWidget()
layout = QFormLayout()

# 添加表单行
layout.addRow(QLabel('Name:'), QLineEdit())
layout.addRow(QLabel('Email:'), QLineEdit())
layout.addRow(QLabel('Age:'), QLineEdit())

# 应用布局
window.setLayout(layout)
window.show()
app.exec_()
```

##### 表单布局的作用：

- 用户输入： QFormLayout为用户输入提供了一种高效、直观的界面，特别适用于需要用户填写多个字段的场合。
- 数据收集： 在需要收集和处理用户数据的应用中，表单布局能够提供清晰、易于理解的界面，帮助用户准确无误地输入数据。
- 布局的一致性和专业性： 表单布局通过标准化的行结构，确保整个表单的视觉一致性和专业外观。
- 易于维护和扩展： 当需要添加更多字段或调整现有字段时，QFormLayout使得维护和扩展变得简单。
总结来说，QFormLayout在PyQt5中为开发者提供了一个简单有效的方式来创建有条理、用户友好的表单界面，非常适合于各种需要大量用户输入和数据收集的应用。

### 6. 堆叠布局（QStackedLayout）
##### 工作原理及用途：
堆叠布局，即QStackedLayout，是PyQt5中的一种布局方式，它允许开发者在同一位置堆叠多个控件或布局，但一次只显示其中一个。这种布局特别适用于需要在同一界面区域中切换显示不同内容的场景，例如向导界面、多页表单、或切换不同功能模块的应用程序。

##### 创建和使用方法：

实例化QStackedLayout： 创建一个QStackedLayout对象。
添加控件或布局： 使用addWidget或addLayout方法添加多个控件或布局。
切换视图： 使用setCurrentIndex方法来切换显示的控件或布局。
应用布局： 将堆叠布局应用到一个容器（如QWidget）上。
##### 代码示例：
```python
from PyQt5.QtWidgets import QApplication, QWidget, QStackedLayout, QPushButton, QLabel

app = QApplication([])
window = QWidget()
stackedLayout = QStackedLayout()

# 创建几个要切换的控件
label1 = QLabel('View 1')
label2 = QLabel('View 2')
button = QPushButton('Switch View')

# 添加控件到堆叠布局
stackedLayout.addWidget(label1)
stackedLayout.addWidget(label2)

# 切换视图的函数
def switch_view():
    stackedLayout.setCurrentIndex((stackedLayout.currentIndex() + 1) % 2)

# 按钮点击切换视图
button.clicked.connect(switch_view)

# 设置堆叠布局
window.setLayout(stackedLayout)
window.show()

button.show()
app.exec_()
```
在此示例中，我们创建了两个标签控件和一个按钮，这些控件被添加到QStackedLayout中。通过点击按钮，可以在两个标签视图间切换。

##### 堆叠布局的应用：

- 向导界面： 可以用于创建多步骤向导，用户可以在不同的步骤页面间切换。
- 多功能应用程序： 在具有多个功能模块的应用程序中，可以用堆叠布局来切换不同的模块视图。
- 空间节约： 当界面空间有限时，堆叠布局可以有效地在同一位置显示不同内容，节约空间。
QStackedLayout因其能够动态切换显示内容而成为PyQt5布局管理中的一个强大工具，尤其适用于需要高度动态界面的应用程序。

### 7. 高级技巧和最佳实践
##### 布局嵌套和动态布局调整：

- 布局嵌套： 在复杂的界面设计中，常常需要将不同类型的布局相互嵌套使用。例如，可以将几个水平布局放入一个垂直布局中，或者在网格布局的单元格中使用堆叠布局。这种嵌套使得布局更加灵活和功能丰富。
- 动态布局调整： PyQt5支持在运行时动态调整布局，如添加、移除或重新排列控件。利用这一特性，可以根据用户的操作或其他事件来实时更新界面。
##### 响应式设计原则：

- 灵活的空间分配： 使用伸缩因子（stretch factors）和最小/最大尺寸设置，以确保布局在不同大小和分辨率的屏幕上都能良好显示。
- 控件适应性： 确保控件能够根据布局的变化自适应其大小，例如，文本框可以随布局的扩展而增大。
- 视觉一致性： 即使在不同的屏幕尺寸和分辨率下，也应保持界面元素的视觉一致性。
##### 调试布局问题的技巧：

- 使用布局边框： 为布局添加边框或不同的背景颜色，可以帮助识别布局的实际占用区域和边界。
- 打印布局信息： 利用调试语句打印布局的属性，如尺寸和控件位置，以帮助理解布局的行为。
- 逐步构建： 在遇到布局问题时，尝试逐步构建和测试布局，从最简单的布局开始，逐渐添加更多的控件和嵌套，这有助于定位问题所在。
- 利用布局管理器的反馈： 布局管理器会提供有关无法满足的约束或其他问题的反馈，注意观察并利用这些信息来调整布局。
通过这些高级技巧和最佳实践，可以在PyQt5中创建更加动态、响应式且易于维护的界面布局，从而提升用户体验和应用程序的整体质量。

### 8. 结论
在使用PyQt5进行应用程序开发时，有效的布局管理是创建专业级用户界面的关键。各种布局类型各有其独特的优势和适用场景，理解并合理利用这些布局对于开发高质量的应用程序至关重要。

水平布局（HBoxLayout） 和 垂直布局（VBoxLayout） 非常适合于简单的线性排列，它们可以使控件按水平或垂直方向顺序排列，适用于大多数标准界面需求。
网格布局（GridLayout） 提供了更高的灵活性，允许控件按照二维网格排列，适合于需要精确控制控件位置的复杂界面。
表单布局（FormLayout） 是创建结构化表单的理想选择，特别适用于数据输入和参数设置等应用场景。
堆叠布局（QStackedLayout） 适用于需要在同一空间内切换不同视图的应用，如向导、多页表单或多功能面板。
布局管理不仅关系到应用程序的视觉美观和用户体验，而且在确保应用在不同设备和屏幕尺寸上保持功能性和一致性方面发挥着重要作用。合理运用这些布局，可以极大地提高开发效率，减少代码冗余，并使得界面更加动态和易于维护。总的来说，深入理解并合理运用PyQt5的各种布局类型，对于创建专业级、响应式和用户友好的应用程序至关重要。

### 9. 具体样例


```python
import os
import sys
from PyQt5.QtCore import Qt
from PyQt5.QtWidgets import QApplication, QWidget, QDesktopWidget, QHBoxLayout, QVBoxLayout
from PyQt5.QtWidgets import QPushButton, QLineEdit, QTableWidget, QTableWidgetItem, QLabel


class MainWindow(QWidget):
    def __init__(self):
        # 用super 继承父类的初始化
        super().__init__()

        # 设置窗口的窗体标题
        self.setWindowTitle('发现你走远了的xx系统')

        # 设置窗体的尺寸
        self.resize(1228, 450)

        # 设置窗体位置
        # 获取整个窗口部分的宽高和左上角坐标信息，返回值是一个QRect类型，(x,y width,height)
        qr = self.frameGeometry()
        cp = QDesktopWidget().availableGeometry().center()  # 得到屏幕中间的位置信息
        qr.moveCenter(cp)  # 让我们的窗体移动到屏幕中间

        # 创建窗口总布局
        layout = QVBoxLayout()

        # 1.顶部菜单布局
        header_layout = QHBoxLayout()  # 创建顶部菜单布局
        # 1.1 放入按钮
        btn_start =QPushButton("开始")#新建一个开始按钮
        header_layout.addWidget(btn_start)#将开始按钮添加到顶部菜单布局
        btn_stop =QPushButton("停止")#新建一个开始按钮
        header_layout.addWidget(btn_stop)#将开始按钮添加到顶部菜单布局
        # 1.2 加入弹簧
        header_layout.addStretch()
        layout.addLayout(header_layout)  # 将顶部菜单布局添加到总布局

        # 2.添加内容布局
        form_layout = QHBoxLayout()  # 创建添加内容布局

        # 2.1 输入框
        txt_asin=QLineEdit()#新建一个输入框对象
        txt_asin.setText("B07YN82X3B=100")#设置默认的form数据
        txt_asin.setPlaceholderText("请输入商品ID和价格，例如：B0818JJQQ8=88")#设置灰色的提示信息
        form_layout.addWidget(txt_asin)#将输入框加入到布局中

        # 2.2 添加按钮
        btn_add = QPushButton("添加")#新建一个添加按钮
        form_layout.addWidget(btn_add)#将添加按钮添加到form布局

        layout.addLayout(form_layout)  # 将添加内容布局添加到总布局

        # 3.表格数据展示布局
        table_layout = QHBoxLayout()
        # 3.1 创建表格
        table_widget=QTableWidget(0,8)#新建一个0行8列的表格

        # # 修改表格索引名
        # item=QTableWidgetItem()
        # item.setText("标题0")
        # table_widget.setHorizontalHeaderItem(0,item)
        # table_widget.setColumnWidth(0,150)#设置水平单元格0号位置的宽度 150
        #
        # item2=QTableWidgetItem()
        # item2.setText("网址1")
        # table_widget.setHorizontalHeaderItem(1,item2)
        # table_widget.setColumnWidth(1,400)#设置水平单元格1号位置的宽度 400
        #
        # item3=QTableWidgetItem()
        # item3.setText("行索引0")
        # table_widget.setVerticalHeaderItem(0,item3)

        table_header = [
            {"field": "asin", "text": "ASIN", 'width': 120},
            {"field": "title", "text": "标题", 'width': 150},
            {"field": "url", "text": "URL", 'width': 400},
            {"field": "price", "text": "底价", 'width': 100},
            {"field": "success", "text": "成功次数", 'width': 100},
            {"field": "error", "text": "503次数", 'width': 100},
            {"field": "status", "text": "状态", 'width': 100},
            {"field": "frequency", "text": "频率（N秒/次）", 'width': 100},
        ]
        for idx,info in enumerate(table_header):
            item=QTableWidgetItem()
            item.setText(info['text'])
            table_widget.setHorizontalHeaderItem(idx,item)
            table_widget.setColumnWidth(idx,info['width'])

        table_layout.addWidget(table_widget)#把表格添加到表格布局中

        layout.addLayout(table_layout)

        # 4.底部菜单
        footer_layout = QHBoxLayout()

        label_status = QLabel("未检测", self)
        footer_layout.addWidget(label_status)

        footer_layout.addStretch()#添加弹簧，更加美观

        btn_reset = QPushButton("重新初始化")
        footer_layout.addWidget(btn_reset)

        btn_recheck = QPushButton("重新检测")
        footer_layout.addWidget(btn_recheck)

        btn_reset_count = QPushButton("次数清零")
        footer_layout.addWidget(btn_reset_count)

        btn_delete = QPushButton("删除检测项")
        footer_layout.addWidget(btn_delete)

        btn_alert = QPushButton("SMTP报警配置")
        footer_layout.addWidget(btn_alert)

        btn_proxy = QPushButton("代理IP")
        footer_layout.addWidget(btn_proxy)

        layout.addLayout(footer_layout)



        # 给窗体设置元素的排列方式
        self.setLayout(layout)



if __name__ == '__main__':
    app = QApplication(sys.argv)  # 实例化一个Application应用，所有的窗口均在其下运行

    window = MainWindow()  # 实例化窗口对象
    window.show()  # 窗口展示

    sys.exit(app.exec_())
    # app.exec_()运行主循环，并在退出时返回状态代码。
    # sys.exit(n)退出您的应用程序并返回n到父进程（通常是您的shell）
```
