---
title: 在hugface下载llm模型
author: leidada
date: 2024-06-04 12:40
updated: 2024-06-04 12:45
abbrlink: 7f290421
hide: false
aside: true
comments: true
description: 
cover: 
top_img: 
categories: 
keywords: 模型下载,llm,hf,HuggingFace
tags:
  - llm
  - huggingface
  - 模型下载
---

## 一、使用镜像网站
1. 镜像网站：hf-mirror.com
![chatglm-6b](https://jsd.cdn.zzko.cn/gh/Eddie-Hyu/picx-images-hosting@master/poster/chtgplm-6b.png)


```python
import os
os.environ['HF_ENDPOINT'] = 'https://hf-mirror.com'
from huggingface_hub import snapshot_download


# 替换为自己的存储路径
model_path = "chatglm-6b"
snapshot_download(
            repo_id="THUDM/chatglm-6b",
            local_dir=model_path,
            max_workers=8
        )
```
2. 镜像网站二：https://aliendao.cn/#/
3. 镜像网站三：https://aifasthub.com/models
## 二、使用huggingface-cli命令行工具
1. pip下载工具
```python
pip install -U huggingface_hub -i https://pypi.tuna.tsinghua.edu.cn/simple/
```
这里使用了清华的镜像源进行全局下载。

2. 设置系统环境变量
将系统变量HF_ENDPOINT 设置为 https://hf-mirror.com，然后运行您的脚本，如
```
export HF_ENDPOINT=https://hf-mirror.com
```
3. 模型下载
基本命令
```python
huggingface-cli download --resume-download --local-dir-use-symlinks False ${模型在huggingface上的名字} ${模型文件名}.gguf --local-dir ${模型存储路径}
```
Gated Model
	如果需要下载限制访问的模型（Gated Model），则需要添加 --token 参数，并使用在         Hugging Face 官网获得的访问令牌。
```python
huggingface-cli download --token hr_*** --resume-download --local-dir-use-symlinks False ${模型在huggingface上的名字} ${模型文件名}.gguf --local-dir ${模型存储路径}
```

## 三、 直接使用huggingface模型

1. 安装
```
pip install -U sentence-transformers
```
2. 使用 (Sentence-Transformers)
```python
from sentence_transformers import SentenceTransformer
sentences = ["This is an example sentence", "Each sentence is converted"]

model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')
embeddings = model.encode(sentences)
print(embeddings)
```
3.  使用 (HuggingFace Transformers)
```python
from transformers import AutoTokenizer, AutoModel
import torch
import torch.nn.functional as F

#Mean Pooling - Take attention mask into account for correct averaging
def mean_pooling(model_output, attention_mask):
    token_embeddings = model_output[0] #First element of model_output contains all token embeddings
    input_mask_expanded = attention_mask.unsqueeze(-1).expand(token_embeddings.size()).float()
    return torch.sum(token_embeddings * input_mask_expanded, 1) / torch.clamp(input_mask_expanded.sum(1), min=1e-9)


# Sentences we want sentence embeddings for
sentences = ['This is an example sentence', 'Each sentence is converted']

# Load model from HuggingFace Hub
tokenizer = AutoTokenizer.from_pretrained('sentence-transformers/all-MiniLM-L6-v2')
model = AutoModel.from_pretrained('sentence-transformers/all-MiniLM-L6-v2')

# Tokenize sentences
encoded_input = tokenizer(sentences, padding=True, truncation=True, return_tensors='pt')

# Compute token embeddings
with torch.no_grad():
    model_output = model(**encoded_input)

# Perform pooling
sentence_embeddings = mean_pooling(model_output, encoded_input['attention_mask'])

# Normalize embeddings
sentence_embeddings = F.normalize(sentence_embeddings, p=2, dim=1)

print("Sentence embeddings:")
print(sentence_embeddings)
```
## 四、用脚本在镜像站下载
为了简化下载流程，单独制作了一个脚本（hf_down.py）：
使用方式（以下载llama3-8b为例）：
1. 找到你要的模型地址：
```
https://hf-mirror.com/
```
![](https://jsd.cdn.zzko.cn/gh/Eddie-Hyu/picx-images-hosting@master/poster/20240616121501.png)

2. 输入完整的内容
```python
python3 hf_down.py --dtype 1 --down_dir meta-llama/Meta-Llama-3-8B --local_dir D:/AI/models/Llama-3-8B
```
或者其简化版：
```python
python3 hf_down.py --t 1 --d meta-llama/Meta-Llama-3-8B --l D:/AI/models/Llama-3-8B
```
也可以用极简版（下载模型时候可用）：
- 默认dtype=1
- 默认local_dir位置为`脚本当前位置`+`模型位置的最后一段`（如此处：`./Meta-Llama-3-8B` ）
```python
python3 hf_down.py  --d meta-llama/Meta-Llama-3-8B 
```
3. 可以先运行脚本，后输入地址
```python
python3 hf_down.py 
```
依次输入：dtype（默认为1）、down_dir（必填）、local_dir（ 默认为`脚本当前位置`+`模型位置的最后一段`）

具体脚本如下：
```python
import os
import sys
import argparse

# 通过修改该地址调整默认的本地保存位置
local_path = "./"  # r"D:\AI\models"

def download_resource(down_dir, local_dir, download_type):
    if not local_dir:
        local_dir = os.path.join(local_pathdown_dir.split("/")[-1])
    if download_type == 2:
        command = f"huggingface-cli download --repo-type dataset --resume-download {down_dir} --local-dir {local_dir}"
    else:
        command = f"huggingface-cli download --resume-download {down_dir} --local-dir {local_dir}"

    try:
        os.environ["HF_ENDPOINT"] = "https://hf-mirror.com"
        print(command)
        os.system(command)
    except Exception as e:
        print(f"An error occurred: {e}")

def down_main():
    print("请依次输入下载类型、下载地址、本地保存地址")
    dtype = input("下载类型：1、下载模型；2、下载数据集(默认：1):")
    down_dir =  input("下载地址：(样例：meta-llama/Meta-Llama-3-8B ):")
    local_dir = input("本地保存地址：(样例：Llama-3-8B):")
    if local_dir  == "":
        local_dir  = down_dir.split("/")[-1]
        print(local_dir)
    if dtype==2 or dtype=="2":
        commands = "huggingface-cli download --repo-type dataset  --resume-download %s --local-dir %s" % (down_dir,local_dir)
    else:
        commands = "huggingface-cli download --resume-download %s --local-dir %s" % (down_dir,local_dir)
    
    try:
        os.system("$env:HF_ENDPOINT = 'https://hf-mirror.com'")
        print(commands)
        os.system(commands)
    except Exception as e:
        print(e)


if __name__ == "__main__":
    print(len(sys.argv))

    if len(sys.argv)>1:
        parser = argparse.ArgumentParser(description="Download models or datasets using huggingface-cli")
        parser.add_argument("-d", "--down_dir", type=str, required=True, help="Download address (e.g., gpt2)")
        parser.add_argument("-l", "--local_dir", type=str,default="",help="Local save address (default: same as download address)")
        parser.add_argument("-t", "--dtype", type=int, choices=[1, 2], default=1,help="Download type: 1 for model, 2 for dataset (default: 1)")
        args = parser.parse_args()
        download_resource(args.down_dir, args.local_dir, args.dtype)
    else:
        down_main()
```