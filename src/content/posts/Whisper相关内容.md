---
title: Whisper相关内容
author: leidada
date: 2024-06-08 21:27
updated: 2024-06-08 21:33
abbrlink: a0d499d6
hide: false
hidden: false
aside: true
comments: true
description: 
cover: 
sticky: 
top_img: 
categories: 
keywords: 日常,知识库,AI,openai
tags:
  - whispere
  - OpenAI
  - 语音
  - stt
---
GitHub页面：https://github.com/openai/whisper
## Available models and languages

| Size   | Parameters | English-only model | Multilingual model | Required VRAM | Relative speed |
| ------ | ---------- | ------------------ | ------------------ | ------------- | -------------- |
| tiny   | 39 M       | tiny.en            | tiny               | ~1 GB         | ~32x           |
| base   | 74 M       | base.en            | base               | ~1 GB         | ~16x           |
| small  | 244 M      | small.en           | small              | ~2 GB         | ~6x            |
| medium | 769 M      | medium.en          | medium             | ~5 GB         | ~2x            |
| large  | 1550 M     | N/A                | large              | ~10 GB        | 1x             |
## Command-line usage
The following command will transcribe speech in audio files, using the medium model:
```cmd
whisper audio.flac audio.mp3 audio.wav --model medium
```
The default setting (which selects the small model) works well for transcribing English. To transcribe an audio file containing non-English speech, you can specify the language using the --language option:
```cmd
whisper japanese.wav --language Japanese
```
Adding `--task translate` will translate the speech into English:
```cmd
whisper japanese.wav --language Japanese --task translate
```
Run the following to view all available options:
```cmd
whisper --help
```
See tokenizer.py for the list of all available languages.

## Python usage
Transcription can also be performed within Python:
```python
import whisper

model = whisper.load_model("base")
result = model.transcribe("audio.mp3")
print(result["text"])
```
Internally, the `transcribe()` method reads the entire file and processes the audio with a sliding 30-second window, performing autoregressive sequence-to-sequence predictions on each window.

Below is an example usage of `whisper.detect_language()` and `whisper.decode()` which provide lower-level access to the model.
```python
import whisper

model = whisper.load_model("base")

# load audio and pad/trim it to fit 30 seconds
audio = whisper.load_audio("audio.mp3")
audio = whisper.pad_or_trim(audio)

# make log-Mel spectrogram and move to the same device as the model
mel = whisper.log_mel_spectrogram(audio).to(model.device)

# detect the spoken language 语言探测
_, probs = model.detect_language(mel)
print(f"Detected language: {max(probs, key=probs.get)}")

# decode the audio
options = whisper.DecodingOptions()
result = whisper.decode(model, mel, options)

# print the recognized text
print(result.text)
```