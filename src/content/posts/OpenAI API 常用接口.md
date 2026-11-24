---
title: OpenAI API 常用接口
author: leidada
date: 2024-06-04 13:01
updated: 2024-06-04 13:02
abbrlink: 57762fc0
keywords: 日常,知识库,AI,openai
tags:
  - 日常
  - 知识库
  - AI
  - OpenAI
  - API
hide: false
aside: true
comments: false
hidden: false
description: 
cover: 
top_img: 
categories:
---
 
**OpenAI API 官方手册**
https://platform.openai.com/docs/api-reference/introduction

**安装 python 包**
安装命令：
```python
pip install openai
```

**初始化会话**
```python
# 引入 openai 包
import openai
# 设置秘钥
openai.api_key = "sk-******"

# 定义会话函数
def get_completion(prompt, model="gpt-3.5-turbo"):
    # 消息数据
    messages = [{"role":"user", "content":prompt}]
    # 执行对话函数并返回响应数据
    response = openai.ChatCompletion.create(
        model=model,
        messages=messages,
        temperature=0
    )
    # 返回对话内容
    return response.choices[0].message["content"]

# 执行对话函数
res = get_completion("您好")
print(res)
```

### Models(模型)接口
#### 获取模型列表
列出当前可用的模型，并提供有关每个模型的基本信息，例如所有者和可用性。

GET 请求 :
```
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```
响应 :
```json
{
  "data": [
    {
      "id": "model-id-0",
      "object": "model",
      "owned_by": "organization-owner",
      "permission": [...]
    },
    ...
}
```
##### 检索模型
检索模型实例，提供有关模型的基本信息，例如所有者和权限。

GET 请求 :
```
curl https://api.openai.com/v1/models/模型名称 \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```
响应 :
```json
{
  "id": "text-davinci-003",
  "object": "model",
  "owned_by": "openai",
  "permission": [...]
}
```
##### Completions 使用模型完成一个对话
给定一个提示 ( prompt )，该模型将返回一个或多个预测的完成，并且还可以返回每个位置的替代标记的概率。

POST 请求 :
```
curl https://api.openai.com/v1/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": "text-davinci-003",
    "prompt": "Say this is a test",
    "max_tokens": 7,
    "temperature": 0
  }'
```
请求数据
```
model 
模型名称 字符串类型 必填
要使用的模型的 ID。您可以使用List models API 来查看所有可用模型 。

prompt 
提示内容 字符串类型 or 数组 选填 默认 <|endoftext|>
生成完成的提示，编码为字符串、字符串数组、标记数组或标记数组数组。
请注意，<|endoftext|> 是模型在训练期间看到的文档分隔符，因此如果未指定提示，模型将生成新文档的开头。

suffix 
插入文本完成后出现的后缀。
string 后缀 选填 默认 null

max_tokens 
最大令牌数整数 选填 默认为16
您的提示加上的令牌计数max_tokens不能超过模型的上下文长度。大多数模型的上下文长度为 2048 个标记（最新模型除外，它支持 4096）。

temperature 
温度 数字 选填 默认为1
采样温度，介于 0 和 2 之间。较高的值（如 0.8）将使输出更加随机，而较低的值（如 0.2）将使输出更加集中和确定。
我们通常建议改变这个或top_p但不是两者。

top_p 数字 选填 默认为1
一种替代温度采样的方法，称为核采样，其中模型考虑具有 top_p 概率质量的标记的结果。所以 0.1 意味着只考虑构成前 10% 概率质量的标记。

n 
为每个提示生成多少完成。
注意：因为这个参数会产生很多完成，它会很快消耗你的令牌配额。请谨慎使用并确保您对max_tokens和进行了合理的设置stop。

stream 
是否回流部分进度
布尔值 选填 默认为假

logprobs
日志概率 整数 选填 默认为空
包括最有可能标记的对数概率logprobs，以及所选标记。例如，如果logprobs是 5，API 将返回 5 个最有可能的标记的列表。API 将始终返回采样令牌的 ，因此响应中logprob最多可能有元素。

echo
回显 布尔值 选填 默认为假
除了完成之外回显提示

stop
停止字符 字符串或数组 选填 默认为空
API 将停止生成更多令牌的最多 4 个序列。返回的文本将不包含停止序列。

presence_penalty
存在_惩罚 数字 选填  默认为0
-2.0 和 2.0 之间的数字。正值会根据到目前为止是否出现在文本中来惩罚新标记，从而增加模型谈论新主题的可能性。

frequency_penalty
惩罚频率 数字 选填 默认为0
-2.0 和 2.0 之间的数字。正值会根据新标记在文本中的现有频率对其进行惩罚，从而降低模型逐字重复同一行的可能性。

best_of
最好的 整数 选填 默认为1
best_of在服务器端生成完成并返回“最佳”（每个标记具有最高对数概率的那个）。无法流式传输结果。
与 一起使用时n，best_of控制候选完成的数量并n指定要返回的数量 -best_of必须大于n。
注意：因为这个参数会产生很多完成，它会很快消耗你的令牌配额。请谨慎使用并确保您对max_tokens和进行了合理的设置stop。

logit_bias
map 类型 选填 默认为空
修改指定标记出现在完成中的可能性。
接受一个 json 对象，该对象将标记（由 GPT 标记器中的标记 ID 指定）映射到从 -100 到 100 的相关偏差值。您可以使用此标记器工具（适用于 GPT-2 和 GPT-3）来转换文本到令牌 ID。从数学上讲，偏差会在采样之前添加到模型生成的对数中。确切的效果因模型而异，但 -1 和 1 之间的值应该会减少或增加选择的可能性；像 -100 或 100 这样的值应该导致相关令牌的禁止或独占选择。
例如，您可以传递{"50256": -100}以防止生成 <|endoftext|> 标记。


user
字符类型 选填 
代表您的最终用户的唯一标识符，可以帮助 OpenAI 监控和检测滥用行为。
```
响应示例 :
```json
{
  "id": "cmpl-uqkvlQyYK7bGYrRHQ0eXlWi7",
  "object": "text_completion",
  "created": 1589478378,
  "model": "text-davinci-003",
  "choices": [
    {
      "text": "\n\nThis is indeed a test",
      "index": 0,
      "logprobs": null,
      "finish_reason": "length"
    }
  ],
  "usage": {
    "prompt_tokens": 5,
    "completion_tokens": 7,
    "total_tokens": 12
  }
}
```

### Chat(聊天)接口
#### 聊天接口
给定一个描述对话的消息列表，该模型将返回一个响应。

POST 请求 :
```
curl https://api.openai.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": "gpt-3.5-turbo",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```
请求数据 ：
```
model 
模型名称 字符串类型 必填
要使用的模型的 ID。您可以使用List models API 来查看所有可用模型 。

messages
数组类型 必填 格式
{
    role 角色 字符串  必需的 此消息作者的角色。system、user或之一assistant。
    content 内容 字符串  必需的 消息的内容。
    name 姓名 字符串  选填 此邮件作者的姓名。可包含 az、AZ、0-9 和下划线，最大长度为 64 个字符。
}

temperature 
温度 数字 选填 默认为1
采样温度，介于 0 和 2 之间。较高的值（如 0.8）将使输出更加随机，而较低的值（如 0.2）将使输出更加集中和确定。
我们通常建议改变这个或top_p但不是两者。

top_p 数字 选填 默认为1
一种替代温度采样的方法，称为核采样，其中模型考虑具有 top_p 概率质量的标记的结果。所以 0.1 意味着只考虑构成前 10% 概率质量的标记。

n 
为每个提示生成多少完成。
注意：因为这个参数会产生很多完成，它会很快消耗你的令牌配额。请谨慎使用并确保您对max_tokens和进行了合理的设置stop。

presence_penalty
存在_惩罚 数字 选填 默认为0
-2.0 和 2.0 之间的数字。正值会根据到目前为止是否出现在文本中来惩罚新标记，从而增加模型谈论新主题的可能性。

frequency_penalty
惩罚频率 数字 选填 默认为0
-2.0 和 2.0 之间的数字。正值会根据新标记在文本中的现有频率对其进行惩罚，从而降低模型逐字重复同一行的可能性。

best_of
最好的 整数 选填 默认为1
best_of在服务器端生成完成并返回“最佳”（每个标记具有最高对数概率的那个）。无法流式传输结果。
与 一起使用时n，best_of控制候选完成的数量并n指定要返回的数量 -best_of必须大于n。
注意：因为这个参数会产生很多完成，它会很快消耗你的令牌配额。请谨慎使用并确保您对max_tokens和进行了合理的设置stop。

logit_bias
map 类型 选填 默认为空
修改指定标记出现在完成中的可能性。
接受一个 json 对象，该对象将标记（由 GPT 标记器中的标记 ID 指定）映射到从 -100 到 100 的相关偏差值。您可以使用此标记器工具（适用于 GPT-2 和 GPT-3）来转换文本到令牌 ID。从数学上讲，偏差会在采样之前添加到模型生成的对数中。确切的效果因模型而异，但 -1 和 1 之间的值应该会减少或增加选择的可能性；像 -100 或 100 这样的值应该导致相关令牌的禁止或独占选择。
例如，您可以传递{"50256": -100}以防止生成 <|endoftext|> 标记。
```
响应示例 :
```json
{
  "id": "chatcmpl-123",
  "object": "chat.completion",
  "created": 1677652288,
  "choices": [{
    "index": 0,
    "message": {
      "role": "assistant",
      "content": "\n\nHello there, how may I assist you today?",
    },
    "finish_reason": "stop"
  }],
  "usage": {
    "prompt_tokens": 9,
    "completion_tokens": 12,
    "total_tokens": 21
  }
}
```

### OpenAI Image ( 绘图 ) 接口

#### 功能
给定提示/或输入图像，模型将生成新图像。

POST 请求 :
```
curl https://api.openai.com/v1/images/generations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "prompt": "小猫喝啤酒",
    "n": 1,
    "size": "1024x1024"
  }'
```
请求数据格式 :
```
prompt 
字符串类型 必需的
所需图像的文本描述。最大长度为 1000 个字符。

n
整数 选填 默认为1
要生成的图像数。必须介于 1 和 10 之间。

size 
字符串类型 选填 默认为1024x1024
生成图像的大小。必须是256x256、512x512或 之一1024x1024。

response_format
字符串类型 选填 默认为url
生成的图像返回的格式。必须是 或url之一b64_json。

user
字符串类型 选填
代表您的最终用户的唯一标识符，可以帮助 OpenAI 监控和检测滥用行为。
```
响应示例 ：
```JSON
{
  "created": 1589478378,
  "data": [
    {
      "url": "https://..."
    },
    {
      "url": "https://..."
    }
  ]
}
```

### OpenAI File ( 文件 ) 接口

#### 概述
文件接口主要用于为微调提供数据文件。涉及到上传、删除功能。

文件格式
微调文件扩展名为 .jsonl，数据格式如下 :
```
{"prompt": "1+1=？->", "completion": "4\nENDEND"}
{"prompt": "1加1=？->", "completion": "4\nENDEND"}
```
#### 查询文件列表
GET 请求
```
curl https://api.openai.com/v1/files \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```
响应结果
```
{
  "data": [
    {
      "id": "file-ccdDZrC3iZVNiQVeEA6Z66wf",
      "object": "file",
      "bytes": 175,
      "created_at": 1613677385,
      "filename": "train.jsonl",
      "purpose": "search"
    },
    ...
  ],
  "object": "list"
}
```
#### 文件上传
POST 请求
```
curl https://api.openai.com/v1/files \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -F purpose="fine-tune" \
  -F file="@mydata.jsonl"
```
POST 请求数据
```
file
字符串 必填 要上传的JSON 行文件的名称。

purpose
字符串 必填 上传文件的预期目的。
复制
响应结果

{
  "id": "file-XjGxS3KTG0uNmNOK362iJua3",
  "object": "file",
  "bytes": 140,
  "created_at": 1613779121,
  "filename": "mydata.jsonl",
  "purpose": "fine-tune"
}
```
#### 删除文件
GET 请求
```
curl https://api.openai.com/v1/files/文件id \
  -X DELETE \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```
响应结果
```
{
  "id": "file-XjGxS3KTG0uNmNOK362iJua3",
  "object": "file",
  "deleted": true
}
```

### OpenAI Fine-tunes ( 微调 )
#### OpenAI Fine-tunes ( 微调 ) 概述
Fine-tunes ( 微调 ) 的核心目标是解决 ：“按照给定例子的格式和口吻来回答问题”。并不能解决 GPT 不知道的内容。

注意微调更适合调整输出格式，不适合特定行业问答场景。

#### 创建微调
POST 请求
```
curl https://api.openai.com/v1/fine-tunes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "training_file": "file-XGinujblHPwGLSztz8cPS8XY"
  }'
```
请求数据结构
```
training_file
微调文件 字符串 必需的
包含训练数据的上传文件的 ID。

validation_file
验证文件 字符串 选填
包含验证数据的上传文件的 ID。

model
模型 字符串 选填 默认 curie
要微调的基本模型的名称。您可以选择“ada”、“babbage”、“curie”、“davinci”或 2022-04-21 之后创建的微调模型之一。
n_epochs
整数 选填 默认为4
训练模型的时期数。一个纪元指的是训练数据集的一个完整周期。

batch_size
批量大小 整数 选填 默认为空
用于训练的批量大小。批量大小是用于训练单个前向和后向传递的训练示例数。
默认情况下，批量大小将动态配置为训练集中示例数量的 0.2%，上限为 256 - 通常，我们发现较大的批量大小往往更适合较大的数据集。

learning_rate_multiplier
学习率乘数 数字 选填 默认为空
用于训练的学习率乘数。微调学习率是用于预训练的原始学习率乘以该值。
默认情况下，学习率乘数是 0.05、0.1 或 0.2，具体取决于 final batch_size（较大的学习率往往在较大的批量大小下表现更好）。我们建议使用 0.02 到 0.2 范围内的值进行试验，以查看产生最佳结果的值。

prompt_loss_weight
数字 选填 默认为0.01
用于提示令牌损失的权重。这控制了模型尝试学习生成提示的程度（与权重始终为 1.0 的完成相比），并且可以在完成较短时为训练增加稳定效果。
如果提示非常长（相对于完成），则减少此权重以避免过度优先学习提示可能是有意义的。

compute_classification_metrics
计算分类指标 布尔值 选填 默认为假
如果设置，我们将在每个时期结束时使用验证集计算特定于分类的指标，例如准确性和 F-1 分数。可以在结果文件中查看这些指标。

classification_n_classes
分类任务中的类数 整数 选填 默认为空

classification_positive_class
分类 字符串 选填 默认为空
在进行二元分类时，需要此参数来生成精度、召回率和 F1 指标。.


suffix
后缀 字符串 选填 默认为空
最多 40 个字符的字符串，将添加到您的微调模型名称中。
例如，suffix“custom-model-name”的 a 会生成类似ada:ft-your-org:custom-model-name-2022-02-15-04-21-04.
```
#### 微调流程
1 准备微调文件 .json

2 上传微调文件获取 文件 id

3 创建微调

4 等待微调完成 padding、 running、successed

5 使用 微调完成后生成的新的模型来实现会话。