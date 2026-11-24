---
title: JS备忘
author: leidada
date: '2024-08-22 10:59'
updated: '2024-08-22 10:59'
abbrlink: 4e4274c9
categories: 个人笔记
keywords: '日常,知识库,JS'
tags:
  - JS
  - 知识库
hidden: false
aside: true
comments: true
description:
cover:
sticky:
top_img:
hide:
---
大家好，这里是**磊大大**，专注于陪伴、成长与分享，愿你总能遇到温柔的人！

# JS备忘

**1.将内容复制到剪贴板**

为了提高网站的用户体验，我们经常需要将内容复制到剪贴板，以便用户将其粘贴到指定位置。

```
const copyToClipboard = (content) => navigator.clipboard.writeText(content)
```

**2.获取鼠标选择**

你以前遇到过这种情况吗？

我们需要获取用户选择的内容。

```
const getSelectedText = () => window.getSelection().toString()
```

**3.打乱数组**

打乱数组？这在彩票程序中很常见，但并不是真正随机的。

```
const shuffleArray = array => array.sort(() => Math.random() - 0.5)
```

**4.将 rgba 转换为十六进制**

我们可以将 rgba 和十六进制颜色值相互转换。

```
const rgbaToHex = (r, g, b) => "#" + [r, g, b].map(num => parseInt(num).toString(16).padStart(2, '0')).join('')
```

**5.将十六进制转换为 rgba**

```
const hexToRgba = hex => {
```

**6.获取多个数字的平均值**

使用 reduce 我们可以非常方便地获取一组数组的平均值。

```
const average = (...args) => args.reduce((a, b) => a + b, 0) / args.length
```

**7.检查数字是偶数还是奇数**

你如何判断数字是奇数还是偶数？

```
const isEven = num => num % 2 === 0
```

**8.删除数组中的重复元素**

要删除数组中的重复元素，使用 Set 会变得非常容易。

```
const uniqueArray = (arr) => [...new Set(arr)]
```

**9.检查对象是否为空对象**

判断对象是否为空容易吗？

```
const isEmpty = obj => Reflect.ownKeys(obj).length === 0 && obj.constructor === Object
```

**10.反转字符串**

```
const reverseStr = str => str.split('').reverse().join('')
```

**11.计算两个日期之间的间隔**

```
const dayDiff = (d1, d2) => Math.ceil(Math.abs(d1.getTime() - d2.getTime()) / 86400000)
```

**12.找出日期所在的年份**

```
const dayInYear = (d) => Math.floor((d - new Date(d.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24)
```

**13.将字符串的首字母大写**

```
const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1)
```

**14.生成指定长度的随机字符串**

```
const generateRandomString = length => [...Array(length)].map(() => Math.random().toString(36)[2]).join('')
```

**15.获取两个整数之间的随机整数**

```
const random = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)
```

**16.指定数字四舍五入**

```
const round = (n, d) => Number(Math.round(n + "e" + d) + "e-" + d)
```

**17.清除所有 cookie**

```
const clearCookies = document.cookie.split(';').forEach(cookie => document.cookie = cookie.replace(/^ +/, '').replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`))
```

**18.检测是否为暗模式**

```
const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
```

**19.滚动到页面顶部**

```
const goToTop = () => window.scrollTo(0, 0)
```

**20.确定是否为 Apple 设备**

```
const isAppleDevice = () => /Mac|iPod|iPhone|iPad/.test(navigator.platform)
```

**21.随机布尔值**

```
const randomBoolean = () => Math.random() >= 0.5
```

**22.获取变量的类型**

```
const typeOf = (obj) => Object.prototype.toString.call(obj).slice(8, -1).toLowerCase()
```

**23.确定当前选项卡是否处于活动状态**

```
const checkTabInView = () => !document.hidden
```

**24.检查元素是否处于焦点**

```
const isFocus = (ele) => ele === document.activeElement
```

**25.随机 IP**

```
const generateRandomIP = () => {
```







欢迎关注我的个人公众号【愿你总能遇到温柔的人】
![扫码_搜索联合传播样式-标准色版.png](/img/wechat_plat.png)
