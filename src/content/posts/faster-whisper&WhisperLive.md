---
title: faster-whisper&WhisperLive
author: leidada
date: '2024-06-16 11:32'
updated: '2024-06-16 14:30'
abbrlink: 44b6e224
hidden: false
aside: true
comments: true
description:
cover:
sticky:
top_img:
categories:
keywords:
tags:
hide:
---
## 一、faster-whisper
### 1 faster-whisper介绍
faster-whisper是基于OpenAI的Whisper模型的高效实现，它利用CTranslate2，一个专为Transformer模型设计的快速推理引擎。这种实现不仅提高了语音识别的速度，还优化了内存使用效率。faster-whisper的核心优势在于其能够在保持原有模型准确度的同时，大幅提升处理速度，这使得它在处理大规模语音数据时更加高效。

项目地址：https://github.com/SYSTRAN/faster-whisper

#### 1.1 whisper
OpenAI 的开源模型 whisper，可以执行 99 种语言的语音识别和文字转写。但是 whisper 模型占用计算资源多，命令行使用门槛高。whisper 模型本身还存在一些问题，例如 模型幻听问题（大部分的类似于不断重复同一句话、无语音部分复读莫名内容等都是由于这个原因造成的）。要更好使用 whsiper 模型就需要能够准确调试模型参数。但 whisper 模型参数众多，且命令行使用对使用者有一定要求，而且只有 torch 版可以做到调整参数。使用 VAD 类工具也需要一定的动手能力。
![](https://jsd.cdn.zzko.cn/gh/Eddie-Hyu/picx-images-hosting@master/poster/20240616113434.png)

#### 1.2 faster-whisper
faster-whisper是具有完全的 whsiper 模型参数，且自带 VAD加持的 whisper 版本，该版本使用了 CTranslate2 来重新实现 whsiper 模型，CT2 对 transformer 类网络进行了优化，使模型推理效率更高。 相比于 openai/whisper，该实现在相同准确性下速度提高了 4 倍以上，同时使用的内存更少。

所谓 VAD 即 Voice Activity Detection —— 声音活动检测，在语音信号处理中，例如语音增强，语音识别等领域有着非常重要的作用。它的作用是从一段语音（纯净或带噪）信号中标识出语音片段与非语音片段。在语音转写任务中，可以提前将语音和非语音部分分离出来，从而提升 whisper 网络识别速度，并减少模型幻听。

VAD地址：https://github.com/snakers4/silero-vad

#### 1.3 性能对比
在性能方面，faster-whisper展现了显著的优势。例如，在使用Large-v2模型和GPU进行13分钟音频的转录测试中，faster-whisper仅需54秒，而原始Whisper模型需要4分30秒。这一显著的性能提升，意味着在实际应用中，faster-whisper能够更快地处理大量数据，特别是在需要实时或近实时语音识别的场景中。
![](https://jsd.cdn.zzko.cn/gh/Eddie-Hyu/picx-images-hosting@master/poster/20240616113424.png)
![](https://jsd.cdn.zzko.cn/gh/Eddie-Hyu/picx-images-hosting@master/poster/20240616113427.png)



#### 1.4 技术优势
faster-whisper的技术优势不仅体现在速度上。它还支持8位量化，这一技术可以在不牺牲太多准确度的情况下，进一步减少模型在CPU和GPU上的内存占用。这使得faster-whisper在资源受限的环境中也能高效运行，如在移动设备或嵌入式系统上。

aster-whisper适用于多种场景，特别是那些需要快速、准确的语音识别的应用。例如，在客户服务中，它可以用于实时语音转文字，提高响应速度和服务质量。在医疗领域，faster-whisper可以辅助医生快速转录病历，提高工作效率。此外，它还适用于实时会议记录、多语言翻译、教育辅助等多个领域。

### 2 faster-whisper安装及使用
#### 2.1 conda环境下安装
```python
pip install faster-whisper
```
#### 2.2 模型下载
```
large-v3模型：https://huggingface.co/Systran/faster-whisper-large-v3/tree/main
large-v2模型：https://huggingface.co/guillaumekln/faster-whisper-large-v2/tree/main
large-v2模型：https://huggingface.co/guillaumekln/faster-whisper-large-v1/tree/main
medium模型：https://huggingface.co/guillaumekln/faster-whisper-medium/tree/main
small模型：https://huggingface.co/guillaumekln/faster-whisper-small/tree/main
base模型：https://huggingface.co/guillaumekln/faster-whisper-base/tree/main
tiny模型：https://huggingface.co/guillaumekln/faster-whisper-tiny/tree/main
```
国内模型地址：
https://aifasthub.com/models/guillaumekln/faster-whisper-large-v2
https://aifasthub.com/models/Systran/faster-whisper-large-v3
#### 2.3 使用fater-whisper进行中文语音识别
```python
from faster_whisper import WhisperModel
 
model_size = "large-v3"
 
# Run on GPU with FP16
model = WhisperModel('../model/faster-whisper-large-v3', device="cuda", compute_type="float16")
 
# or run on GPU with INT8
# model = WhisperModel(model_size, device="cuda", compute_type="int8_float16")
# or run on CPU with INT8
# model = WhisperModel(model_size, device="cpu", compute_type="int8")
 
segments, info = model.transcribe("../data/gusuiyizhi.wav", beam_size=5)
 
print("Detected language '%s' with probability %f" % (info.language, info.language_probability))
 
for segment in segments:
    print("[%.2fs -> %.2fs] %s" % (segment.start, segment.end, segment.text))
```
参数说明：

- local_files_only=True 表示加载本地模型
- model_size_or_path=path 指定加载模型路径
- device="cuda" 指定使用cuda
- compute_type="int8_float16" 量化为8位
- language="zh" 指定音频语言
- vad_filter=True 开启vad
- vad_parameters=dict(min_silence_duration_ms=1000) 设置vad参数
 
运行结果显示：

```
Detected language 'zh' with probability 0.998535
[0.00s -> 2.48s] 骨髓抑制的定义、危害和预防
[2.48s -> 4.48s] 骨髓抑制是一种病症
[4.48s -> 8.14s] 其主要特点是骨髓中血细胞生成减少
[8.14s -> 11.62s] 这种减少会影响所有类型的血细胞
[11.62s -> 14.74s] 包括红细胞、白细胞和血小板
[14.74s -> 15.74s] 通常
[15.74s -> 20.16s] 骨髓抑制是癌症治疗中使用的化疗或放疗的副作用
[20.16s -> 23.42s] 因为这些疗法在杀伤癌细胞的同时
[23.42s -> 26.22s] 也会损害骨髓中的健康细胞
[26.22s -> 29.26s] 骨髓抑制可能会带来如下危害
[29.26s -> 30.86s] 一、贫血
[30.86s -> 33.74s] 骨髓抑制导致红细胞生成减少
[33.74s -> 35.64s] 可能会引起贫血
[35.64s -> 39.94s] 表现为疲劳、虚弱、呼吸急促和面色苍白
[39.94s -> 44.58s] 严重的贫血可能导致心脏问题和日常活动能力下降
[44.58s -> 46.92s] 二、中性粒细胞减少
[46.92s -> 49.52s] 骨髓抑制导致白细胞减少
[49.52s -> 51.96s] 尤其是中性粒细胞减少
[51.96s -> 55.94s] 患者更容易受到细菌、病毒和真菌感染
[56.22s -> 58.48s] 某些情况下可能会很严重
[58.48s -> 59.24s] 并危及生长
[59.24s -> 61.68s] 三、血小板减少
[61.68s -> 64.60s] 骨髓抑制导致血小板生成减少
[64.60s -> 67.02s] 增加出血和淤伤的风险
[67.02s -> 71.10s] 患者可能会流鼻血、牙龈出血、容易淤伤
[71.10s -> 74.98s] 严重的血小板减少症可导致自发性出血
[74.98s -> 78.18s] 小伤口出血时间延长和内出血
[78.18s -> 79.72s] 这可能危及生命
[79.72s -> 81.58s] 四、治疗延误
[81.58s -> 84.06s] 如果患者的血细胞技术太低
[84.06s -> 87.24s] 则可能需要延迟化疗周期或放疗
[87.24s -> 88.82s] 以使骨髓功能恢复
[88.82s -> 89.22s] 三、血小板减少
[89.24s -> 90.46s] 如果延迟太久
[90.46s -> 92.38s] 可能会延误癌症的治疗
[92.38s -> 94.38s] 造成危险的后果
[94.38s -> 96.24s] 五、剂量减少
[96.24s -> 100.06s] 骨髓抑制可能需要减少化疗或放疗的剂量
[100.06s -> 103.56s] 这可能会影响癌症治疗的整体有效性
[103.56s -> 105.88s] 六、延长住院时间
[105.88s -> 109.96s] 严重的感染或出血可能需要住院治疗和监测
[109.96s -> 114.16s] 增加了患者癌症治疗的总体时间和经济成本
[114.16s -> 116.44s] 七、降低生活质量
[116.44s -> 119.22s] 疲劳、感染风险增加和出血病毒
[119.24s -> 123.72s] 病发症会对患者的整体健康和日常生活功能产生负面影响
[123.72s -> 127.84s] 预防肿瘤放化疗引起的骨髓抑制虽然并不容易
[127.84s -> 132.42s] 但有一些方法可以帮助减少风险或减轻严重程度
[132.42s -> 134.02s] 一、精确剂量
[134.02s -> 137.20s] 医生会根据您的身体状况和肿瘤大小
[137.20s -> 139.68s] 来选择最佳的化疗和放疗剂量
[139.68s -> 141.70s] 以减少对骨髓的影响
[141.70s -> 143.60s] 二、药物调整
[143.60s -> 144.48s] 如果可能
[144.48s -> 148.06s] 医生会选择具有较低骨髓抑制风险的药物
[148.18s -> 149.02s] 或调整
[149.24s -> 150.72s] 治疗方案来降低风险
[150.72s -> 152.60s] 三、治疗间隔
[152.60s -> 156.16s] 医生可能会增加治疗之间的间隔时间
[156.16s -> 159.04s] 让您的身体有更多时间恢复
[159.04s -> 160.98s] 四、生长因子
[160.98s -> 163.32s] 医生可能会开出生长因子
[163.32s -> 165.36s] 如粒细胞刺激因子
[165.36s -> 167.88s] GCSF或红细胞生成素
[167.88s -> 168.70s] EPO
[168.70s -> 172.48s] 以帮助身体加速产生白细胞和红细胞
[172.48s -> 174.36s] 五、营养支持
[174.36s -> 176.30s] 保持良好的营养状态
[176.30s -> 179.14s] 可以帮助身体应对治疗带来的副作用
[179.14s -> 179.22s] 三、医生可能会增加治疗之间的间隔时间
[179.24s -> 181.38s] 注意摄入充足的蛋白质
[181.38s -> 183.06s] 维生素和矿物质
[183.06s -> 185.08s] 以支持骨髓功能
[185.08s -> 187.20s] 六、免疫增强剂
[187.20s -> 188.82s] 在某些情况下
[188.82s -> 191.98s] 医生可能会推荐使用免疫增强剂
[191.98s -> 194.66s] 以提高您的免疫系统抵抗力
[194.66s -> 196.42s] 需要您注意的是
[196.42s -> 199.10s] 以上建议可能因个人情况而异
[199.10s -> 202.44s] 请务必与您的医生保持紧密沟通
[202.44s -> 206.34s] 制定最适合您的个性化的防治策略
[206.34s -> 209.14s] 以应对放化疗可能引起的骨髓抑制
[209.14s -> 209.44s] 请务必与您的医生保持紧密沟通
```
#### 2.4 使用fater-whisper将中文翻译成英文输出
```python
from faster_whisper import WhisperModel
 
model_size = "large-v3"
 
# Run on GPU with FP16
model = WhisperModel('../model/faster-whisper-large-v3', device="cuda", compute_type="float16")
 
# or run on GPU with INT8
# model = WhisperModel(model_size, device="cuda", compute_type="int8_float16")
# or run on CPU with INT8
# model = WhisperModel(model_size, device="cpu", compute_type="int8")
 
segments, info = model.transcribe("../data/gusuiyizhi.wav", beam_size=5, language='en')
print("Detected language '%s' with probability %f" % (info.language, info.language_probability))
 
for segment in segments:
    print("[%.2fs -> %.2fs] %s" % (segment.start, segment.end, segment.text))
```

## 二、WhisperLive
### 1、
#### 1.1 项目地址
https://github.com/coldfire-x/WhisperLive
#### 1.2 安装
```
pip install whisper-live
```
#### 1.3 快速使用
```cmd
python3 run_server.py --port 9090 \
                      --backend faster_whisper
  
# running with custom model
python3 run_server.py --port 9090 \
                      --backend faster_whisper
                      -fw "/path/to/custom/faster_whisper/model"
```
在python中使用
```python
from whisper_live.client import TranscriptionClient
client = TranscriptionClient(
  "localhost",
  9090,
  lang="en",
  translate=False,
  model="small",
  use_vad=False,
)
```
- Trancribe an audio file:
```python
client("tests/jfk.wav")
```
- To transcribe from microphone:
```python
client()
```
- To transcribe from a HLS stream:
```python
client(hls_url="http://as-hls-ww-live.akamaized.net/pool_904/live/ww/bbc_1xtra/bbc_1xtra.isml/bbc_1xtra-audio%3d96000.norewind.m3u8") 
```