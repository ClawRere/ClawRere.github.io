---
title: MySQL安装
author: leidada
date: 2024-07-31 14:12
updated: 2024-07-31 14:12
abbrlink: 8b39915a
tags:
  - mysql
  - windows
  - 知识库
hide: true
hidden: true
aside: true
comments: true
description: 
cover: 
sticky: 
top_img: 
categories: 个人笔记
keywords:
---


## 一、安装MySql
MySQL下载地址：https://dev.mysql.com/downloads/installer/
- **进入官网下载地址**
![](https://jsd.cdn.zzko.cn/gh/Eddie-Hyu/picx-images-hosting@master/poster/20240731160519.png)

- **选择不登陆直接下载**
![](https://jsd.cdn.zzko.cn/gh/Eddie-Hyu/picx-images-hosting@master/poster/20240731160345.png)

- **下载完成后直接双点击安装**
- 选择`Full`之后一直下一步即可安装完成
![](https://jsd.cdn.zzko.cn/gh/Eddie-Hyu/picx-images-hosting@master/poster/20240731160836.png)

**这里介绍一下各个组件的作用**：
	- MySql Server：Mysql数据库的服务器，我们操作数据一般都是连接到该服务器进行操作
	- MySql Workbench：可视化操作MySql数据库中的数据，说人话就是你可以用鼠标点击操作数据库
	- MySql Shell：这个就是通过命令行操作MySql数据库中的数据，学习命令时，推荐用这个，可以快速熟悉各种命令
	- MySql for visual studio：VS默认只显示自己的SQL Server源，所以要想MySql连接VS，就需要这个工具
	- Connector/NET :MySQL官方的.NET驱动程序，用于结合MySql for visual studio工具连接VS的
	- Connector/ODBC：该组件使用户可以用ODBC (Open Database Connectivity，开放数据库互联)数据库连接Mysql的服务器。比如说，用户可以使用Windows中的应用程序，如微软的 Access，Excel去连接数据库服务器。
	- Connector/J:连接java的包
	- Connector/C++：c++接口组件
	- Connector/Python：phthon接口组件
	- MySql Router：连接数据库与应用程序的中间组件
	- MySql Documentation：MySql数据库的使用文档
	- Samples and Examples：例子

下面这个页面为配置选项，红框中的要选择开发者电脑，端口之类的一般默认即可，绿框建议勾选上，以后编程可能有机会用上，可以直接默认
![](https://jsd.cdn.zzko.cn/gh/Eddie-Hyu/picx-images-hosting@master/poster/20240731161010.png)

下图选择验证方法，建议使用老一点的，比较稳定，选择新版本可能导致某些开源代码不兼容
![](https://jsd.cdn.zzko.cn/gh/Eddie-Hyu/picx-images-hosting@master/poster/20240731161201.png)
设置root密码，建议找地方记住密码，后面经常会用到
![](https://jsd.cdn.zzko.cn/gh/Eddie-Hyu/picx-images-hosting@master/poster/20240731161432.png)

- **其他没提到到直接默认下一步即可，完成整个安装**
![](https://jsd.cdn.zzko.cn/gh/Eddie-Hyu/picx-images-hosting@master/poster/20240731161536.png)
- **输入刚刚的密码，检查一下链接状态**
![](https://jsd.cdn.zzko.cn/gh/Eddie-Hyu/picx-images-hosting@master/poster/20240731161652.png)
- 后续直接确认下一步即可，基本没什么问题了，安装完成会自动进入mysql 
![](https://jsd.cdn.zzko.cn/gh/Eddie-Hyu/picx-images-hosting@master/poster/20240731161826.png)
## 二、常见MySql指令
#### 1.数据库相关
|命令	|作用|
|--|-|
|CREATE DATABASES 数据库名称;	|创建数据库|
|DROP DATABASE 数据库名;	|删除数据库|
|show databases;	|显示所有数据库|
|show tables;	|显示当前数据库所有表|
|ALTER DATABASE 数据库名 DEFAULT CHARACTER SET 字符集名称;	|更改数据库字符集|
#### 2.表相关
| 命令                                               | 作用       |
| ------------------------------------------------ | -------- |
| CREATE TABLE 表名(列名 类型 [属性],列名 类型 [属性]…); //属性可省略 | 创建表      |
| DROP TABLE 表名;                                   | 删除表      |
| ALTER TABLE 表名 ADD 列名 类型;                        | 添加列      |
| ALTER TABLE 表名 DROP COLUMN 列名;                   | 删除列      |
| show columns from 表名;                            | 显示表中所有列  |
| select * from 表名;                                | 显示表中所有数据 |
#### 3.数据相关
| 命令                                              | 作用   |
| ----------------------------------------------- | ---- |
| INSERT INTO 表名 VALUES(值,值,值…); //默认添加顺序为该表的列名顺序 | 添加数据 |
| DELETE FROM 表名 WHERE 条件;                        | 删除数据 |
| IPDATE 表名 SET 列名=值 WHERE 条件;                    | 修改数据 |
*其他参考：https://blog.csdn.net/weixin_50964512/article/details/124645212*



欢迎关注我的个人公众号【愿你总能遇到温柔的人】
![扫码_搜索联合传播样式-标准色版.png](/img/wechat_plat.png)
