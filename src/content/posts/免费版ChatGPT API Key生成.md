---
title: 免费版ChatGPT API Key生成
author: leidada
date: '2024-05-20 14:46'
updated: '2024-05-20 14:46'
abbrlink: 45fd4bcc
categories: AI
keywords: 'AI,ChatGPT'
comments: false
description:
cover:
tags:
---
ChatGPT现在虽然都免费了，但是不**科学**上网还是很麻烦，网上有很多gpt网站可以用，但是自己用来开发的话，还是需要一个apikey的。。
这里介绍一个可以通过github账户直接获取免费api的方法：

>项目地址 https://github.com/chatanywhere/GPT_API_free 可以直接去官网看如何申请
>申请地址 https://api.chatanywhere.org/v1/oauth/free/github/render 用github账号直接授权登录

免费版支持gpt-3.5-turbo, embedding, gpt-4。其中gpt-4由于价格过高，每天限制3次调用（0点刷新）。需要更稳定快速的gpt-4请使用付费版。

申请完成之后，我们就有了apikey。在项目中就可以使用了，地址换成下面的转发地址
>转发Host1: https://api.chatanywhere.tech (国内中转，延时更低，host1和host2二选一)
>转发Host2: https://api.chatanywhere.com.cn (国内中转，延时更低，host1和host2二选一)
>转发Host3: https://api.chatanywhere.cn (国外使用,国内需要全局代理)

```
# -*- coding: utf-8 -*-
from openai import OpenAI
client = OpenAI(
     api_key="sk-xxxxxxxxxxx",
     base_url="https://api.chatanywhere.tech/v1"
)

def gpt_35_api_stream(messages: list):
    stream = client.chat.completions.create(
        model='gpt-3.5-turbo',
        messages=messages,
        stream=True,
    )

    for chunk in stream:
        if chunk.choices[0].delta.content is not None:
            print(chunk.choices[0].delta.content, end="")

if __name__ == '__main__':
    messages = [{'role': 'user','content': '鲁迅和周树人是什么关系'},]
    gpt_35_api_stream(messages)
```