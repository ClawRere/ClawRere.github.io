---
title: open-interpreter+ollama构建LLM自动编码智能体
author: leidada
date: '2024-05-20 16:27'
updated: '2024-05-20 16:27'
abbrlink: 41c2abcb
comments: false
description:
cover:
categories:
keywords:
tags:
---
## Open Interpreter简介

Git地址：https://github.com/OpenInterpre

![Pasted image 20240520162833.png](https://raw.githubusercontent.com/Eddie-Hyu/picx-images-hosting/master/poster/Pasted%20image%2020240520162833.png)


## 与 ChatGPT 的代码解释器比较

OpenAI 发布的 Code Interpreter 和 GPT-4 提供了一个与 ChatGPT 完成实际任务的绝佳机会。

但是，OpenAI 的服务是托管的，闭源的，并且受到严格限制：
- 无法访问互联网。
- 预装软件包数量有限。
- 允许的最大上传为 100 MB，且最大运行时间限制为 120.0 秒
- 当运行环境中途结束时，之前的状态会被清除（包括任何生成的文件或链接）。

Open Interpreter（开放解释器）通过在本地环境中运行克服了这些限制。它可以完全访问互联网，不受运行时间或是文件大小的限制，也可以使用任何软件包或库。

它将 GPT-4 代码解释器的强大功能与本地开发环境的灵活性相结合。

## 安装

安装open-interpreter起来非常方便，只要执行：
```bash
pip install open-interpreter
```
然后执行

```bash
interpreter
```
就可以启动了。

如果要使用本机的ollama大模型，只需要执行
```bash
interpreter --model ollama/模型名
```
例如
```bash
interpreter --model ollama/codeqwen:latest
```
具体参考：
https://docs.openinterpreter.com

## 注意：

由于生成的代码是在本地环境中运行的，因此会与文件和系统设置发生交互，从而可能导致本地数据丢失或安全风险等意想不到的结果。

⚠️ 所以在执行任何代码之前，Open Interpreter 都会询问用户是否运行。

您可以运行 interpreter -y 或设置 interpreter.auto_run = True 来绕过此确认，此时：

在运行请求修改本地文件或系统设置的命令时要谨慎。
请像驾驶自动驾驶汽车一直握着方向盘一样留意 Open Interpreter，并随时做好通过关闭终端来结束进程的准备。
考虑在 Google Colab 或 Replit 等受限环境中运行 Open Interpreter 的主要原因是这些环境更加独立，从而降低执行任意代码导致出现问题的风险。

## 命令行方式测试：

启动命令：
```bash
interpreter -y --model ollama/codeqwen:latest
```

## Python编码测试：

具体参数设置参考：https://docs.openinterpreter.com/settings/all-settings

具体代码如下：
```python
from interpreter import interpreter

interpreter.llm.model = "ollama/codeqwen:latest"
interpreter.chat("计算20以内质数") 
```