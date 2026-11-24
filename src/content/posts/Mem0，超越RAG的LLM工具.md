---
title: Mem0，超越RAG的LLM工具
author: leidada
date: 2024-07-24 12:17
updated: 2024-07-24 12:17
abbrlink: 9d35c63c
keywords: llm,ai,github,mem0
tags:
  - AI
  - github
  - mem0
hidden: false
aside: true
comments: true
description: 
cover: 
sticky: 
top_img: 
categories: 个人笔记
hide:
---
Mem0上线GitHub仅仅2天就已经达到13K🌟！
项目地址：https://github.com/mem0ai/mem0

## 基础用法
### 1. 安装
```python
pip install mem0ai
```
### 2. 基础用法
```python
import os
from mem0 import Memory

os.environ["OPENAI_API_KEY"] = "xxx"

# Initialize Mem0
m = Memory()

# Store a memory from any unstructured text
result = m.add("I am working on improving my tennis skills. Suggest some online courses.", user_id="alice", metadata={"category": "hobbies"})
print(result)
# Created memory: Improving her tennis skills. Looking for online suggestions.

# Retrieve memories
all_memories = m.get_all()
memory_id = all_memories[0]["id"] # get a memory_id
print(all_memories)

# Search memories
related_memories = m.search(query="What are Alice's hobbies?", user_id="alice")
print(related_memories)

# Update a memory
result = m.update(memory_id=memory_id, data="Likes to play tennis on weekends")
print(result)

# Get memory history
history = m.history(memory_id=memory_id)
print(history)
```
### 3. 初始化
```python
from mem0 import Memory
m = Memory()
```
### 4. 记忆储存
```python
result = m.add("I am working on improving my tennis skills. Suggest some online courses.", user_id="alice", metadata={"category": "hobbies"})
print(result)



# OutPut
[
  {
    'id': 'm1',
    'event': 'add',
    'data': 'I am working on improving my tennis skills. Suggest some online courses.'
  }
]
```
### 5. 找回记忆
```python
# Get all memories
all_memories = m.get_all()
print(all_memories)

# OutPut

[
  {
    'id': 'm1',
    'text': 'Likes to play cricket on weekends',
    'metadata': {
      'data': 'Likes to play cricket on weekends',
      'category': 'hobbies'
    }
  },
  # ... other memories ...
]
```
### 6. 记忆搜索
```python
related_memories = m.search(query="What are Alice's hobbies?", user_id="alice")
print(related_memories)

# output

[
  {
    'id': 'm1',
    'text': 'Likes to play cricket on weekends',
    'metadata': {
      'data': 'Likes to play cricket on weekends',
      'category': 'hobbies'
    },
    'score': 0.85  # Similarity score
  },
  # ... other related memories ...
]
```
### 7. 记忆更新
```python
result = m.update(memory_id="m1", data="Likes to play tennis on weekends")
print(result)
```
### 8. 记忆删除
```python
m.delete(memory_id="m1") # Delete a memory
m.delete_all(user_id="alice") # Delete all memories
```
## 特征：
- Multi-Level Memory: User, Session, and AI Agent memory retention
- Adaptive Personalization: Continuous improvement based on interactions
- Developer-Friendly API: Simple integration into various applications
- Cross-Platform Consistency: Uniform behavior across devices
- Managed Service: Hassle-free hosted solution