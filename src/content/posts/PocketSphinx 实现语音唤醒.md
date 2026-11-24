---
title: PocketSphinx 实现语音唤醒
author: leidada
date: '2024-06-14 00:02'
updated: '2024-06-14 16:08'
abbrlink: c7d0c046
tags:
  - PocketSphinx
  - python
  - 语音唤醒
hidden: false
aside: true
comments: true
description:
cover:
sticky:
top_img:
categories:
keywords:
hide:
---
## 下载中文包
先用`pip install PocketSphinx`安装（如有问题去官网直接下whl包安装。
首先，默认支持的是英文，没有办法，只能先下载一下中文包。 https://sourceforge.net/projects/cmusphinx/files/Acoustic%20and%20Language%20Models/
![](https://jsd.cdn.zzko.cn/gh/Eddie-Hyu/picx-images-hosting@master/poster/20240614000401.png)

之后进行下载即可。然后进行解压，解压之后的话，需要找到这个目录：
`...\python\Lib\site-packages\pocketsphinx\model`
![](https://jsd.cdn.zzko.cn/gh/Eddie-Hyu/picx-images-hosting@master/poster/20240614005228.png)

在这里先创建文件夹zh-CN【记得记录该路径，后续会用上】。 然后解压之后，注意还不能直接使用。 还需要改个文件的名字。参照这里：github.com/Uberi/speec…
![](https://jsd.cdn.zzko.cn/gh/Eddie-Hyu/picx-images-hosting@master/poster/20240614000538.png)
> 1. 文件夹改为：acoustic-model
> 2. bin文件改成：language-model.lm.bin
> 3. dict文件改成：pronounciation-dictionary.dic
> 4. 可以给bin/dict文件做一个备份（.back）

最终效果如下：
![](https://jsd.cdn.zzko.cn/gh/Eddie-Hyu/picx-images-hosting@master/poster/20240614002302.png)
## 制作激活词
我们先设计激活词，其实也就是词典。 例如，我的激活词语是：热巴同学
你把这个保存在一个文本当中（keywords.txt），然后进入这个网站： http://www.speech.cs.cmu.edu/tools/lmtool-new.html
![](https://jsd.cdn.zzko.cn/gh/Eddie-Hyu/picx-images-hosting@master/poster/20240614003140.png)

上传完成后基本如下，可以下载TAR9502.tgz，再进行解压。

![](https://jsd.cdn.zzko.cn/gh/Eddie-Hyu/picx-images-hosting@master/poster/20240614003103.png)
下载解压后基本有以下内容：
![](https://jsd.cdn.zzko.cn/gh/Eddie-Hyu/picx-images-hosting@master/poster/20240614003500.png)
进入之前的zh-CN目录，找到.dict文件，并安装对应规则修改我们下载的.dic文件，如： 小贝 x iao3 b ei4 小魏 x iao3 w ei4 巧倍 q iao3 b ei4 。

- 简易版
```
import os
from pocketsphinx import LiveSpeech, get_model_path

model_path = get_model_path()

speech = LiveSpeech(
    verbose=False,
    sampling_rate=16000,
    buffer_size=2048,
    no_search=False,
    full_utt=False,
    hmm=os.path.join(model_path, 'zh-CN/acoustic-model'),# 这个目录位置为模型所在位置
    lm=os.path.join(model_path, 'zh-CN/keys/1234.lm'),  # 这个目录位置自己设置
    dic=os.path.join(model_path, 'zh-CN/keys/1234.dic')  # 同上
)
for phrase in speech:
    print("phrase:", phrase)
    print(phrase.segments(detailed=True))
    # 只要命中上述关键词的内容，都算对
    if str(phrase) in ["小贝", "小魏", "巧倍"]:
	    print("正确识别唤醒词")
```

