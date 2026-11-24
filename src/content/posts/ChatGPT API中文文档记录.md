---
title: ChatGPT API中文文档记录
author: leidada
date: 2024-06-05 23:41
updated: 2024-06-05 23:41
abbrlink: aecb4838
hide: true
hidden: true
aside: true
comments: true
description: 
cover: 
sticky: 
top_img: 
categories: 
keywords: AI,ChatGPT,api文档
tags:
  - chatgpt
  - API
  - api文档
---
## 介绍
要安装官方 Python 绑定，请运行以下命令：
```python
pip install openai
```

要安装官方 Node.js 库，请在 Node.js 项目目录中运行以下命令：
```node.js
npm install openai
```
## 认证
OpenAI API 使用 API 密钥进行身份验证。访问您的API 密钥页面以检索您将在请求中使用的 API 密钥。

**请记住，您的 API 密钥是秘密的！** 不要与他人共享或在任何客户端代码（浏览器、应用程序）中公开它。生产请求必须通过您自己的后端服务器进行路由，您的 API 密钥可以从环境变量或密钥管理服务中安全加载。

所有 API 请求都应在 HTTP 标头中包含您的 API 密钥，Authorization如下所示：
```
Authorization: Bearer OPENAI_API_KEY
```
## 请求组织
对于属于多个组织的用户，您可以传递一个标头来指定哪个组织用于 API 请求。来自这些 API 请求的使用将计入指定组织的订阅配额。

curl命令示例：
```sh
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "OpenAI-Organization: org-oiD85Cuq7BToDgSamwH7synm"
```
Python 包的示例openai：
```python
import os
import openai
openai.organization = "org-oiD85Cuq7BToDgSamwH7synm"
openai.api_key = os.getenv("OPENAI_API_KEY")
openai.Model.list()
```
Node.js 包的示例openai：
```node.js
import { Configuration, OpenAIApi } from "openai";
const configuration = new Configuration({
    organization: "org-oiD85Cuq7BToDgSamwH7synm",
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const response = await openai.listEngines();
```

组织 ID 可以在您的组织设置页面上找到。

## 发出请求
您可以将下面的命令粘贴到您的终端中以运行您的第一个 API 请求。确保替换$OPENAI_API_KEY为您的秘密 API 密钥。
```sh
curl https://api.openai.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
     "model": "gpt-3.5-turbo",
     "messages": [{"role": "user", "content": "Say this is a test!"}],
     "temperature": 0.7
   }'
```

此请求查询模型以完成以提示“ Say this is a testgpt-3.5-turbo ”开头的文本。您应该会收到类似于以下内容的响应：
```
{
   "id":"chatcmpl-abc123",
   "object":"chat.completion",
   "created":1677858242,
   "model":"gpt-3.5-turbo-0301",
   "usage":{
      "prompt_tokens":13,
      "completion_tokens":7,
      "total_tokens":20
   },
   "choices":[
      {
         "message":{
            "role":"assistant",
            "content":"\n\nThis is a test!"
         },
         "finish_reason":"stop",
         "index":0
      }
   ]
}
```

现在你已经生成了你的第一个聊天完成。我们可以看到`finish_reason` is `stop`这意味着 API 返回了模型生成的完整完成。在上面的请求中，我们只生成了一条消息，但是您可以设置参数n来生成多条消息选择。在这个例子中，`gpt-3.5-turbo`更多的是用于传统的文本完成任务。该模型还针对聊天应用程序进行了优化。

## 模型
列出并描述 API 中可用的各种模型。您可以参考模型文档以了解可用的模型以及它们之间的区别。

#### 列出型号
`GET https://api.openai.com/v1/models`

列出当前可用的模型，并提供有关每个模型的基本信息，例如所有者和可用性。
```sh
# 请求示例
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```
 
```
//响应
{
  "data": [
    {
      "id": "model-id-0",
      "object": "model",
      "owned_by": "organization-owner",
      "permission": [...]
    },
    {
      "id": "model-id-1",
      "object": "model",
      "owned_by": "organization-owner",
      "permission": [...]
    },
    {
      "id": "model-id-2",
      "object": "model",
      "owned_by": "openai",
      "permission": [...]
    },
  ],
  "object": "list"
}
```

#### 检索模型
检索模型实例，提供有关模型的基本信息，例如所有者和权限。

`GET https://api.openai.com/v1/models/{model}`

路径参数

| 参数名   | 类型     | 是否必传请求体
参数名	类型	是否必输	默认值	描述
model	string	是		要使用的模型的 ID。您可以使用List models API 来查看所有可用模型，或查看我们的模型概述以了解它们的描述。
prompt	string 或 array	否	<|endoftext|>	生成完成的提示，编码为字符串、字符串数组、标记数组或标记数组数组。请注意，<|endoftext|>是模型在训练期间看到的文档分隔符，因此如果未指定提示，模型将生成新文档的开头。
suffix	string	否	null	插入文本完成后出现的后缀。
max_tokens	integer	否	16	完成时生成的最大标记数。您的提示加上的标记计数max_tokens不能超过模型的上下文长度。大多数模型的上下文长度为 2048 个标记（最新模型除外，它支持 4096）。标记翻译请看文章末尾
temperature	number	否	1	使用什么采样温度，介于 0 和 2 之间。较高的值（如 0.8）将使输出更加随机，而较低的值（如 0.2）将使输出更加集中和确定。
我们通常建议改变这个或top_p但不是两者。
top_p	number	否	1	一种替代温度采样的方法，称为核采样，其中模型考虑具有 top_p 概率质量的标记的结果。所以 0.1 意味着只考虑构成前 10% 概率质量的标记。
我们通常建议改变这个或temperature但不是两者。
n	integer	否	1	为每个提示生成多少完成。
**注意：**因为这个参数会产生很多完成，它会很快消耗你的令牌配额。请谨慎使用并确保您对max_tokens和进行了合理的设置stop
stream	boolean	否	false	是否回流部分进度。如果设置，标记将在可用时作为仅数据服务器发送事件发送，流由data: [DONE]消息终止。
logprobs	integer	否	null	在 logprobs 上包括对数概率最有可能的标记，以及所选标记。例如，如果 logprobs 为 5，则 API 将返回 5 个最有可能的标记的列表。 API 将始终返回采样令牌的 logprob，因此响应中最多可能有 logprobs+1 个元素。
logprobs 的最大值为 5。如果您需要更多，请通过我们的帮助中心联系我们并描述您的用例。
echo	boolean	否	false	除了完成之外，还回显提示
stop	string 或 array	否	null	API 将停止生成更多标记的最多 4 个序列。
presence_penalty	number	否	0	-2.0 和 2.0 之间的数字。正值会根据到目前为止是否出现在文本中来惩罚新标记，从而增加模型谈论新主题的可能性。
frequency_penalty	number	否	0	-2.0 和 2.0 之间的数字。正值会根据新标记在文本中的现有频率对其进行惩罚，从而降低模型逐字重复同一行的可能性。
best_of	integer	否	1	在服务器端生成 best_of 完成，并返回“最佳”。 每个标记具有最高对数概率的那个。无法流式传输结果。
当使用n，best_of 控制候选完成的数量，n 指定返回多少 - best_of 必须大于 n。
**注意：**因为这个参数会产生很多完成，它会很快消耗你的令牌配额。请谨慎使用并确保您对max_tokens和进行了合理的设置stop。
logit_bias	map	否	null	修改指定标记出现在完成中的可能性。接受一个 json 对象，该对象将标记（由 GPT 分词器中的标记ID 指定）映射到从 -100 到 100 的相关偏差值。您可以使用此标记生成器工具（适用于 GPT-2 和 GPT-3）将文本转换为标记 ID。从数学上讲，偏差会在采样之前添加到模型生成的对数中。确切的效果因模型而异，但 -1 和 1 之间的值应该会减少或增加选择的可能性；像 -100 或 100 这样的值应该导致相关标记的禁止或独占选择。例如，您可以传递 {“50256”: -100} 以防止生成 <|endoftext|>
user	string	否		代表您的最终用户的唯一标识符，可以帮助 OpenAI 监控和检测滥用行为。 了解更多。| 描述           |
| ----- | ------ | ---- | ------------ |
| model | string | 是    | 用于此请求的模型的 ID |

## 完成(Completions)
给定一个提示，该模型将返回一个或多个预测的完成，并且还可以返回每个位置的替代标记的概率。

#### 创建完成(Create completion)
为提供的提示和参数创建完成

`POST https://api.openai.com/v1/completions`
请求体

| 参数名               | 类型             | 是否必输 | 默认值           | 描述                                                                                                                                                                                                                                                                       |
| ----------------- | -------------- | ---- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| model             | string         | 是    |               | 要使用的模型的 ID。您可以使用List models API 来查看所有可用模型，或查看我们的模型概述以了解它们的描述。                                                                                                                                                                                                            |
| prompt            | string 或 array | 否    | `<endoftext>` | 生成完成的提示，编码为字符串、字符串数组、标记数组或标记数组数组。请注意，`<endoftext>`是模型在训练期间看到的文档分隔符，因此如果未指定提示，模型将生成新文档的开头。                                                                                                                                                                                |
| suffix            | string         | 否    | null          | 插入文本完成后出现的后缀。                                                                                                                                                                                                                                                            |
| max_tokens        | integer        | 否    | 16            | 完成时生成的最大标记数。您的提示加上的标记计数max_tokens不能超过模型的上下文长度。大多数模型的上下文长度为 2048 个标记（最新模型除外，它支持 4096）。标记翻译请看文章末尾                                                                                                                                                                          |
| temperature       | number         | 否    | 1             | 使用什么采样温度，介于 0 和 2 之间。较高的值（如 0.8）将使输出更加随机，而较低的值（如 0.2）将使输出更加集中和确定。我们通常建议改变这个或top_p但不是两者。                                                                                                                                                                                  |
| top_p             | number         | 否    | 1             | 一种替代温度采样的方法，称为核采样，其中模型考虑具有 top_p 概率质量的标记的结果。所以 0.1 意味着只考虑构成前 10% 概率质量的标记。我们通常建议改变这个或temperature但不是两者。                                                                                                                                                                    |
| n                 | integer        | 否    | 1             | 为每个提示生成多少完成。**注意：** 因为这个参数会产生很多完成，它会很快消耗你的令牌配额。请谨慎使用并确保您对max_tokens和进行了合理的设置stop                                                                                                                                                                                         |
| stream            | boolean        | 否    | false         | 是否回流部分进度。如果设置，标记将在可用时作为仅数据服务器发送事件发送，流由data: [DONE]消息终止。                                                                                                                                                                                                                  |
| logprobs          | integer        | 否    | null          | 在 logprobs 上包括对数概率最有可能的标记，以及所选标记。例如，如果 logprobs 为 5，则 API 将返回 5 个最有可能的标记的列表。 API 将始终返回采样令牌的 logprob，因此响应中最多可能有 logprobs+1 个元素。logprobs 的最大值为 5。如果您需要更多，请通过我们的帮助中心联系我们并描述您的用例。                                                                                            |
| echo              | boolean        | 否    | false         | 除了完成之外，还回显提示                                                                                                                                                                                                                                                             |
| stop              | string 或 array | 否    | null          | API 将停止生成更多标记的最多 4 个序列。                                                                                                                                                                                                                                                  |
| presence_penalty  | number         | 否    | 0             | -2.0 和 2.0 之间的数字。正值会根据到目前为止是否出现在文本中来惩罚新标记，从而增加模型谈论新主题的可能性。                                                                                                                                                                                                               |
| frequency_penalty | number         | 否    | 0             | -2.0 和 2.0 之间的数字。正值会根据新标记在文本中的现有频率对其进行惩罚，从而降低模型逐字重复同一行的可能性。                                                                                                                                                                                                              |
| best_of           | integer        | 否    | 1             | 在服务器端生成 best_of 完成，并返回“最佳”。 每个标记具有最高对数概率的那个。无法流式传输结果。当使用n，best_of 控制候选完成的数量，n 指定返回多少 - best_of 必须大于 n。**注意：** 因为这个参数会产生很多完成，它会很快消耗你的令牌配额。请谨慎使用并确保您对max_tokens和进行了合理的设置stop。                                                                                              |
| logit_bias        | map            | 否    | null          | 修改指定标记出现在完成中的可能性。接受一个 json 对象，该对象将标记（由 GPT 分词器中的标记ID 指定）映射到从 -100 到 100 的相关偏差值。您可以使用此标记生成器工具（适用于 GPT-2 和 GPT-3）将文本转换为标记 ID。从数学上讲，偏差会在采样之前添加到模型生成的对数中。确切的效果因模型而异，但 -1 和 1 之间的值应该会减少或增加选择的可能性；像 -100 或 100 这样的值应该导致相关标记的禁止或独占选择。例如，您可以传递 {“50256”: -100} 以防止生成 <endoftext> |
| user              | string         | 否    |               | 代表您的最终用户的唯一标识符，可以帮助 OpenAI 监控和检测滥用行为。 了解更多。                                                                                                                                                                                                                              |

