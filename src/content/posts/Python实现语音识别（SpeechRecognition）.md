---
title: Python实现语音识别（SpeechRecognition）
author: leidada
date: '2024-06-14 16:05'
updated: '2024-06-14 16:09'
abbrlink: 36fafc35
tags:
  - SpeechRecognition
  - python
  - 语音识别
  - stt
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
## 1、简介
https://pypi.org/project/SpeechRecognition/
https://github.com/Uberi/speech_recognition
> SpeechRecognition用于执行语音识别的库，支持多个引擎和 API，在线和离线。
```
recognize_bing()：Microsoft Bing Speech
recognize_google()： Google Web Speech API
recognize_google_cloud()：Google Cloud Speech - requires installation of the google-cloud-speech package
recognize_houndify()： Houndify by SoundHound
recognize_ibm()：IBM Speech to Text
recognize_sphinx()：CMU Sphinx - requires installing PocketSphinx
recognize_wit()：Wit.ai
```
以上几个中只有 recognition_sphinx（）可与CMU Sphinx 引擎脱机工作， 其他六个都需要连接互联网。另外，SpeechRecognition 附带 Google Web Speech API 的默认 API 密钥，可直接使用它。其他的 API 都需要使用 API 密钥或用户名/密码组合进行身份验证。
## 2、安装SpeechRecognition
安装库SpeechRecognition：

```python
#python -m pip install --upgrade pip
#pip install 包名 -i https://pypi.tuna.tsinghua.edu.cn/simple/
#pip install 包名 -i http://pypi.douban.com/simple/ --trusted-host pypi.douban.com
#pip install 包名 -i https://pypi.org/simple
pip install SpeechRecognition
```
检查版本
```python
import speech_recognition as sr
print(sr.__version__)
```
硬件检查
```python
import speech_recognition as sr
for index, name in enumerate(sr.Microphone.list_microphone_names()):
    print("Microphone with name \"{1}\" found for `Microphone(device_index={0})`".format(index, name))
```
## 3、安装pyaudio

```python
pip install pyaudio
```
## 4、安装pocketsphinx（offline）
```python
pip install pocketsphinx
```
### 4.1 中文声学模型、语言模型和字典文件;
pocketsphinx需要安装的中文语言、声学模型。
https://sourceforge.net/projects/cmusphinx/files/Acoustic%20and%20Language%20Models/Mandarin/
具体可以参考以下文章：
{% btn '/posts/==XXXXX==/',PocketSphinx 实现语音唤醒,far fa-hand-point-right,block right larger %}

测试脚本：
- 导入文件
```python
import speech_recognition as sr

r = sr.Recognizer()    #调用识别器
test = sr.AudioFile("chinese.flac")   #导入语音文件
with test as source:       
	# r.adjust_for_ambient_noise(source)
    audio = r.record(source) #使用 record() 从文件中获取数据
type(audio)
# c=r.recognize_sphinx(audio, language='zh-cn')     #识别输出
c=r.recognize_sphinx(audio, language='en-US')     #识别输出
print(c)

# recognize speech using Sphinx
try:
    print("Sphinx thinks you said " + r.recognize_sphinx(audio))
except sr.UnknownValueError:
    print("Sphinx could not understand audio")
except sr.RequestError as e:
    print("Sphinx error; {0}".format(e))

```
- 调用麦克风录音
```python
import speech_recognition as sr

# obtain audio from the microphone
r = sr.Recognizer()
with sr.Microphone() as source:
    print("Say something!")
    audio = r.listen(source)

# recognize speech using Sphinx
try:
    print("Sphinx thinks you said " + r.recognize_sphinx(audio))
except sr.UnknownValueError:
    print("Sphinx could not understand audio")
except sr.RequestError as e:
    print("Sphinx error; {0}".format(e))

```
## 5、安装语音识别库
### 5.1 安装Vosk （offline）
```python
python3 -m pip install vosk
```
您还必须安装 Vosk 模型：
以下是可供下载的模型。您必须将它们放在项目的模型文件夹中，例如“your-project-folder/models/your-vosk-model”
https://alphacephei.com/vosk/models
![](https://cdn.jsdelivr.net/gh/Eddie-Hyu/picx-images-hosting@master/poster/20240614162129.png)
测试脚本：
***注：** 在测试脚本的所在文件夹，新建model子文件夹，然后把上面下载的模型解压到里面如下：*
```python
import speech_recognition as sr
from vosk import KaldiRecognizer, Model

r = sr.Recognizer()
with sr.Microphone() as source:
    audio = r.listen(source, timeout=3, phrase_time_limit=3)

r.vosk_model = Model(model_name="vosk-model-small-cn-0.22") # 模型所在位置
text=r.recognize_vosk(audio, language='zh-cn') 
print(text)
```
### 5.2 安装Whisper（offline）
```cmd
pip install zhconv
pip install whisper
pip install -U openai-whisper
pip3 install wheel
pip install soundfile
```

whisper用法：
- 读取文件
```python
import whisper

if __name__ == '__main__':
    model = whisper.load_model("tiny")
    result = model.transcribe("audio.mp3", fp16=False, language="Chinese")
    print(result["text"])
```
- 实时转录（录音完成后识别，目前没找到可以实时逐句翻译，但可以结合处理）
```python
import whisper
import zhconv
import wave  # 使用wave库可读、写wav类型的音频文件
import pyaudio  # 使用pyaudio库可以进行录音，播放，生成wav文件


def record(time):  # 录音程序
    # 定义数据流块
    CHUNK = 1024  # 音频帧率（也就是每次读取的数据是多少，默认1024）
    FORMAT = pyaudio.paInt16  # 采样时生成wav文件正常格式
    CHANNELS = 1  # 音轨数（每条音轨定义了该条音轨的属性,如音轨的音色、音色库、通道数、输入/输出端口、音量等。可以多个音轨，不唯一）
    RATE = 16000  # 采样率（即每秒采样多少数据）
    RECORD_SECONDS = time  # 录音时间
    WAVE_OUTPUT_FILENAME = "./output.wav"  # 保存音频路径
    p = pyaudio.PyAudio()  # 创建PyAudio对象
    stream = p.open(format=FORMAT,  # 采样生成wav文件的正常格式
                    channels=CHANNELS,  # 音轨数
                    rate=RATE,  # 采样率
                    input=True,  # Ture代表这是一条输入流，False代表这不是输入流
                    frames_per_buffer=CHUNK)  # 每个缓冲多少帧
    print("* recording")  # 开始录音标志
    frames = []  # 定义frames为一个空列表
    for i in range(0, int(RATE / CHUNK * RECORD_SECONDS)):  # 计算要读多少次，每秒的采样率/每次读多少数据*录音时间=需要读多少次
        data = stream.read(CHUNK)  # 每次读chunk个数据
        frames.append(data)  # 将读出的数据保存到列表中
    print("* done recording")  # 结束录音标志

    stream.stop_stream()  # 停止输入流
    stream.close()  # 关闭输入流
    p.terminate()  # 终止pyaudio

    wf = wave.open(WAVE_OUTPUT_FILENAME, 'wb')  # 以’wb‘二进制流写的方式打开一个文件
    wf.setnchannels(CHANNELS)  # 设置音轨数
    wf.setsampwidth(p.get_sample_size(FORMAT))  # 设置采样点数据的格式，和FOMART保持一致
    wf.setframerate(RATE)  # 设置采样率与RATE要一致
    wf.writeframes(b''.join(frames))  # 将声音数据写入文件
    wf.close()  # 数据流保存完，关闭文件


if __name__ == '__main__':
    model = whisper.load_model("tiny")
    record(3)  # 定义录音时间，单位/s
    result = model.transcribe("output.wav",language='Chinese',fp16 = True)
    s = result["text"]
    s1 = zhconv.convert(s, 'zh-cn')
    print(s1)
```

测试脚本：
```python
import speech_recognition as sr

r = sr.Recognizer()
with sr.Microphone() as source:
    audio = r.listen(source, timeout=3, phrase_time_limit=5)

# recognize speech using whisper
try:
    print("Whisper thinks you said: " + r.recognize_whisper(audio, language="chinese"))
except sr.UnknownValueError:
    print("Whisper could not understand audio")
except sr.RequestError as e:
    print("Could not request results from Whisper")
```
## 6. 测试
### 6.1 fastapi
```python
import json
import os
from pprint import pprint

import speech_recognition
import torch
import uvicorn
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import soundfile
import whisper
import vosk

class ResponseModel(BaseModel):
    path: str


app = FastAPI()


def get_path(req: ResponseModel):
    path = req.path
    if path == "":
        raise HTTPException(status_code=400, detail="No path provided")

    if not path.endswith(".wav"):
        raise HTTPException(status_code=400, detail="Invalid file type")

    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="File does not exist")

    return path


@app.get("/")
def root():
    return {"message": "speech-recognition api"}


@app.post("/recognize-google")
def recognize_google(req: ResponseModel):
    path = get_path(req)
    r = speech_recognition.Recognizer()

    with speech_recognition.AudioFile(path) as source:
        audio = r.record(source)

    return r.recognize_google(audio, language='ja-JP', show_all=True)


@app.post("/recognize-vosk")
def recognize_vosk(req: ResponseModel):
    path = get_path(req)
    r = speech_recognition.Recognizer()

    with speech_recognition.AudioFile(path) as source:
        audio = r.record(source)

    return json.loads(r.recognize_vosk(audio, language='ja'))


@app.post("/recognize-whisper")
def recognize_whisper(req: ResponseModel):
    path = get_path(req)
    r = speech_recognition.Recognizer()

    with speech_recognition.AudioFile(path) as source:
        audio = r.record(source)

    result = r.recognize_whisper(audio, language='ja')
    try:
        return json.loads(result)
    except:
        return {"text": result}


if __name__ == "__main__":
    host = os.environ.get('HOST', '0.0.0.0')
    port: int = os.environ.get('PORT', 8080)

    uvicorn.run("main:app", host=host, port=int(port))
```
### 6.2  recognize_sphinx
```python
import logging
import speech_recognition as sr


def audio_Sphinx(filename):
    logging.info('开始识别语音文件...')
    # use the audio file as the audio source
    r = sr.Recognizer()
    with sr.AudioFile(filename) as source:
        audio = r.record(source)  # read the entire audio file

    # recognize speech using Sphinx
    try:
        print("Sphinx thinks you said: " + r.recognize_sphinx(audio, language='zh-cn'))
    except sr.UnknownValueError:
        print("Sphinx could not understand audio")
    except sr.RequestError as e:
        print("Sphinx error; {0}".format(e))    

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)

    wav_num = 0
    while True:
        r = sr.Recognizer()
        #启用麦克风
        mic = sr.Microphone()
        logging.info('录音中...')
        with mic as source:
            #降噪
            r.adjust_for_ambient_noise(source)
            audio = r.listen(source)
        with open(f"00{wav_num}.wav", "wb") as f:
            #将麦克风录到的声音保存为wav文件
            f.write(audio.get_wav_data(convert_rate=16000))
        logging.info('录音结束，识别中...')

        target = audio_Sphinx(f"00{wav_num}.wav")
```

### 6.3 语音生成音频文件
- 方法1：
```python
import speech_recognition as sr
 
# Use SpeechRecognition to record 使用语音识别包录制音频
def my_record(rate=16000):
    r = sr.Recognizer()
    with sr.Microphone(sample_rate=rate) as source:
        print("please say something")
        audio = r.listen(source)
 
    with open("voices/myvoices.wav", "wb") as f:
        f.write(audio.get_wav_data())
    print("录音完成！")
 
my_record()
```
- 方法2：
```python
import wave
from pyaudio import PyAudio, paInt16
 
framerate = 16000  # 采样率
num_samples = 2000  # 采样点
channels = 1  # 声道
sampwidth = 2  # 采样宽度2bytes
FILEPATH = 'voices/myvoices.wav'
 
 
def save_wave_file(filepath, data):
    wf = wave.open(filepath, 'wb')
    wf.setnchannels(channels)
    wf.setsampwidth(sampwidth)
    wf.setframerate(framerate)
    wf.writeframes(b''.join(data))
    wf.close()
 
 
#录音
def my_record():
    pa = PyAudio()
    #打开一个新的音频stream
    stream = pa.open(format=paInt16, channels=channels,
                     rate=framerate, input=True, frames_per_buffer=num_samples)
    my_buf = [] #存放录音数据
 
    t = time.time()
    print('正在录音...')
 
    while time.time() < t + 10:  # 设置录音时间（秒）
    	#循环read，每次read 2000frames
        string_audio_data = stream.read(num_samples)
        my_buf.append(string_audio_data)
    print('录音结束.')
    save_wave_file(FILEPATH, my_buf)
    stream.close()
```
## 7、进阶用法
### 7.1 用vosk、sr实时识别（目前测试流程最合适的）
可以用这个方法推导其他语音识别的用法
```python
# -*- coding: utf-8 -*-
# microphone.py
# pip install vosk
# pip install pydub
# pip install transformers
# pip install torch -f https://download.pytorch.org/whl/torch_stable.html
# pip install pyaudio
# pip install ipywidgets
import ipywidgets as widgets
from IPython.display import display
from queue import Queue
import wave
from threading import Thread
import pyaudio
import json
from vosk import Model, KaldiRecognizer
import time



p = pyaudio.PyAudio()
messages = Queue()
recordings = Queue()


CHANNELS = 1
FRAME_RATE = 16000
RECORD_SECONDS = 2
AUDIO_FORMAT = pyaudio.paInt16
SAMPLE_SIZE = 2

def record_microphone(chunk=1024):
    p = pyaudio.PyAudio()

    stream = p.open(format=AUDIO_FORMAT,
                    channels=CHANNELS,
                    rate=FRAME_RATE,
                    input=True,
                    input_device_index=0,   # 这是麦克风的索引id
                    frames_per_buffer=chunk)

    frames = []

    while not messages.empty():
        data = stream.read(chunk)
        print(">>添加语音数据")
        frames.append(data)
        if len(frames) >= (FRAME_RATE * RECORD_SECONDS) / chunk:
            recordings.put(frames.copy())
            frames = []
    # for i in range(0, int(FRAME_RATE / chunk * RECORD_SECONDS)):
    #     data = stream.read(chunk)
    #     frames.append(data)

    stream.stop_stream()
    stream.close()
    p.terminate()


    wf = wave.open('output.wav', 'wb')
    wf.setnchannels(CHANNELS)
    wf.setsampwidth(p.get_sample_size(AUDIO_FORMAT))
    wf.setframerate(FRAME_RATE)
    wf.writeframes(b''.join(frames))
    wf.close()


model = Model(model_path="./vosk-model-cn-0.22")
rec = KaldiRecognizer(model, FRAME_RATE)
rec.SetWords(True)
def speech_recognition():
    while not messages.empty():
        print("识别语音")
        frames = recordings.get()

        rec.AcceptWaveform(b''.join(frames))
        result = rec.Result()
        text = json.loads(result)["text"]
        print("识别的文字",text)
        # cased = subprocess.check_output('python recasepunc/recasepunc.py predict recasepunc/checkpoint', shell=True,
        #                                 text=True, input=text)
        # output.append_stdout(cased)
        time.sleep(1)


record_microphone()



def start_recording():
    messages.put(True)

    display("Starting...")
    record = Thread(target=record_microphone)
    record.start()
    transcribe = Thread(target=speech_recognition)
    transcribe.start()

# for i in range(p.get_device_count()):
#     print(p.get_device_info_by_index(i))
#
# p.terminate()
start_recording()
```