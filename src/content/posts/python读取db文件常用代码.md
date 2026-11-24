---
title: python读取db文件常用代码
author: leidada
date: 2024-06-05 18:02
updated: 2024-06-05 18:02
abbrlink: 9e59303c
hidden: false
aside: true
comments: true
description: 
cover: 
sticky: 
top_img: 
categories: 
keywords: python,database,知识库
tags:
  - 知识库
  - database
  - python
  - sqlite
hide:
---
### 查找所有表并展示表结构

```python
import sqlite3

# 记得改db名
db_data = 'your_database.db'
# 连接到 SQLite 数据库
conn = sqlite3.connect(db_data)
cursor = conn.cursor()

# 获取数据库中的所有表
cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
tables = cursor.fetchall()

# 列出所有表名
print("数据库中的表：")
for table in tables:
    print(table[0])

# 获取每个表的结构
for table in tables:
    table_name = table[0]
    cursor.execute(f"PRAGMA table_info({table_name});")
    columns = cursor.fetchall()
    
    print(f"\n表 {table_name} 的结构：")
    for column in columns:
        print(f"列名: {column[1]}, 类型: {column[2]}, 是否为空: {column[3]}, 默认值: {column[4]}")

# 关闭数据库连接
conn.close()
```

### 读取某个表内的结构

**并写入csv文件**
```python
import sqlite3
import csv

db_data = 'your_database.db'
table_name = 'your_table'
# 连接到 SQLite 数据库
conn = sqlite3.connect(db_data)
cursor = conn.cursor()

# 执行查询
query = "SELECT * FROM %s" % db_data
cursor.execute(query)

# 获取查询结果
rows = cursor.fetchall()

# 获取列名
columns = [description[0] for description in cursor.description]

# 将结果写入到 CSV 文件
output_file = 'output.csv'
with open(output_file, 'w', newline='') as f:
    writer = csv.writer(f)
    
    # 写入列名
    writer.writerow(columns)
    
    # 写入数据行
    writer.writerows(rows)

# 关闭数据库连接
conn.close()

print(f"查询结果已写入 {output_file}")
```

返回示例：
```
表 auth 的结构：
列名: id, 类型: VARCHAR(255), 是否为空: 1, 默认值: None
列名: email, 类型: VARCHAR(255), 是否为空: 1, 默认值: None
列名: password, 类型: TEXT, 是否为空: 1, 默认值: None
列名: active, 类型: INTEGER, 是否为空: 1, 默认值: None
<sqlite3.Cursor object at 0x000001DA8A7B9840>

```
### 写入数据到某个表

```python
import sqlite3

# 连接到SQLite数据库（如果数据库不存在，会自动创建）
conn = sqlite3.connect('example.db')

# 创建一个游标对象
cursor = conn.cursor()

# 创建表格（如果表格已经存在，可以跳过这一步）
cursor.execute('''
CREATE TABLE IF NOT EXISTS auth (
    id VARCHAR(255),
    email VARCHAR(255),
    password TEXT,
    active INTEGER
)
''')

# 插入数据到表格中
data = [
    ('1', 'user1@example.com', 'password1', 1),
    ('2', 'user2@example.com', 'password2', 0),
    ('3', 'user3@example.com', 'password3', 1)
]

# 使用executemany()方法批量插入数据
cursor.executemany('''
INSERT INTO auth (id, email, password, active) 
VALUES (?, ?, ?, ?)
''', data)

# 提交事务
conn.commit()

# 查询并显示插入的数据
cursor.execute('SELECT * FROM auth')
rows = cursor.fetchall()
for row in rows:
    print(row)

# 关闭游标和连接
cursor.close()
conn.close()

```