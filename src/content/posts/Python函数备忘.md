---
title: Python函数备忘
author: leidada
date: '2024-08-25 16:10'
updated: '2024-08-25 16:10'
abbrlink: 2456edc6
categories: 个人笔记
hide: true
hidden: true
aside: true
comments: true
description:
cover:
sticky:
top_img:
keywords:
tags:
---
大家好，这里是**磊大大**，专注于陪伴、成长与分享，愿你总能遇到温柔的人！


**🌟 实例一：map 函数的应用**

map 函数接收一个函数和一个序列，将函数应用于序列中的每一项，返回一个迭代器。例如，如果我们想要将一个列表中的所有数字平方，我们可以这样做：

```
numbers = [1, 2, 3, 4, 5]
```



**🌟 实例二：filter 函数的魔法**

filter 函数同样接收一个函数和一个序列，但它会过滤出序列中满足条件的元素。比如，筛选出列表中大于10的数：

```
numbers = [5, 11, 15, 2, 8]
```



**🌟 实例三：reduce 函数的力量**

reduce 函数需要从functools模块中导入，它将一个数据集中的所有数据进行累积操作。假设我们要计算一个列表中所有数的乘积：

```
from functools import reduce
```



**🌟 实例四：函数作为参数**

我们可以通过定义一个函数，使其能够接受其他函数作为参数，从而实现更高级的抽象和代码复用。比如，编写一个函数apply_function，它可以接收一个函数和一个参数，然后应用这个函数：

```
def apply_function(func, arg):
```



**🌟 实例五：装饰器的优雅**

装饰器是Python中一个非常强大的高阶函数概念，它们可以修改或增强现有函数的行为。比如，我们创建一个简单的装饰器，用于记录函数调用：

```
def log_decorator(func):
```



**🌟 实例六：sorted 函数与自定义排序**

sorted 函数允许你传递一个key参数来指定如何比较元素。这使得排序变得非常灵活。例如，如果我们有一个包含字典的列表，我们可以按照某个键的值来排序：

```
people = [
```

这将按年龄从小到大排序。‍



**🌟 实例七：使用itertools模块**

Python的itertools模块提供了很多高阶函数，可以处理迭代器的创建和操作。例如，chain函数可以将多个迭代器链接在一起：

```
import itertools
```



**🌟 实例八：functools.partial函数**

functools.partial允许你冻结函数的部分参数，创建一个新的函数。这对于需要固定某些参数值的情况非常有用：

```
from functools import partial
```



**🌟 实例九：zip函数的多用途**

zip函数可以将多个序列打包成一个元组的列表。当你需要同时遍历多个序列时，这非常有用。例如，合并两个列表的元素：

```
names = ['Alice', 'Bob', 'Charlie']
```



**🌟 实例十：any和all函数的逻辑判断**

any和all函数分别用来检查序列中是否至少有一个元素满足条件，以及所有元素是否都满足条件。例如，检查一个列表中是否有偶数：

```
numbers = [1, 3, 5, 7, 8]
```










> [!NOTE] 文章推荐  
> - [我的博客网站：磊大大の小栈](https://ldddd.eu.org/)👈️  
> - [欢迎来到魔法世界--WizardingWorld](https://mp.weixin.qq.com/s/jc3c62itUzMs6P-0Xl0eOQ)👈️  
> - [津巴布韦币不再是最不值钱的了！](https://mp.weixin.qq.com/s/ND-boYh35HlGh4XixAHbnA)


欢迎关注我的个人公众号【愿你总能遇到温柔的人】
![扫码_搜索联合传播样式-标准色版.png](/img/wechat_plat.png)
