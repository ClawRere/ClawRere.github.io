---
title: 主打一个不花钱：国产大模型逆向API白嫖
author: leidada
date: '2024-05-31 00:55'
updated: '2024-05-31 00:55'
abbrlink: '64931527'
keywords: '日常,知识库,AI'
tags:
  - 知识库
  - 日常
  - AI
comments: false
description:
cover:
categories:
---
 **仅限自用，禁止对外提供服务或商用，避免对官方造成服务压力，否则风险自担！**
 
 如今的优秀国产大模型在日常使用中完全可以独当一面。

而且都提供了基础的免费网页服务，但如果需要接入api使用都是需要付费的。

对于白嫖这件事情一直是我比较擅长的领域，今天就给大家带来了一下大模型api白嫖心得。

阶跃星辰 (跃问StepChat) 

月之暗面（Kimi）

阿里通义 (Qwen) 

ZhipuAI (智谱清言) 

秘塔AI (metaso) 

聆心智能 (Emohaa) 

以上免费api利用方式都是一样的套路，逆向网页服务搭建转发接口，接下来开始整活。首先以跃问StepChat为示例。

打开网址：https://stepchat.cn/

点击登录，进入登陆状态

进入`StepChat`随便发起一个对话，然后F12打开开发者工具，从`Application > Cookies`中找到`Oasis-Token`的值，这将作为`Authorization`的`Bearer Token`值：`Authorization: Bearer TOKEN`

这个`Oasis-Token`你就可以理解为`API KEY`，然后我们就可以在任何可以使用**OPEN AI API KEY**的地方使用它，不过接口地址需要换成自己搭建的转发地址，这里我已经提前搭建好了一个测试接口地址方便大家快速测试：**https://stepfreeapi.shadow.cloudns.org** `(测试已失效)`

**测试地址不保证长期有效，需要长期使用需要自己搭建**

下面我们再测试一下使用python代码调用这个接口，测试代码如下：

```python
import requests

# 替换成你的refresh_token
refresh_token = 'eyXXXX'
api_url = 'https://kimifreeapi.shadow.cloudns.org/v1/chat/completions'

def get_response_from_api(user_input):
    headers = {
        'Authorization': f'Bearer {refresh_token}',
        'Content-Type': 'application/json'
    }
    data = {
        "model": "step",
        "messages": [
            {
                "role": "user",
                "content": user_input
            }
        ],
        "stream": False
    }
    response = requests.post(api_url, headers=headers, json=data)
    return response.json()

def main():
    while True:
        user_input = input("请输入你的问题（输入886退出）: ")
        if user_input == '886':
            print("程序退出。")
            break
        response = get_response_from_api(user_input)
        print("AI的回答:")
        print(response['choices'][0]['message']['content'])

if __name__ == "__main__":
    main()
```

代码的第4行替换成你自己的token，将代码保存为后缀为.py的python文件，例如stepDemo.py，然后再命令行执行文件。

如此便可以方便爱折腾的小伙伴接入到自己的项目中。

其余大模型使用方法完全一致，就不做再单独展示，只需要登陆网页之后获取token然后搭配使用相应的接口地址即可，下面将列出所有古哒哒搭建好的测试接口地址和相应的token获取方式：

测试地址为个人搭建临时测试之用，长期使用请自行搭建接口

##### 月之暗面（Kimi）

进入kimi随便发起一个对话，然后F12打开开发者工具，从Application > Local Storage中找到refresh_token的值，这将作为Authorization的Bearer Token值：Authorization: Bearer TOKEN

如果你看到的refresh_token是一个数组，请使用.拼接起来再使用。


接口地址：https://kimifreeapi.shadow.cloudns.org

##### 阿里通义 (Qwen) 


进入通义千问随便发起一个对话，然后F12打开开发者工具，从Application > Cookies中找到login_tongyi_ticket的值，这将作为Authorization的Bearer Token值：Authorization: Bearer TOKEN

接口地址：https://qwenfreeapi.shadow.cloudns.org

##### ZhipuAI (智谱清言) 

进入智谱清言随便发起一个对话，然后F12打开开发者工具，从Application > Cookies中找到chatglm_refresh_token的值，这将作为Authorization的Bearer Token值：Authorization: Bearer TOKEN

接口地址：https://glmfreeapi.shadow.cloudns.org

##### 秘塔AI (metaso) 

从 秘塔AI搜索 获取uid和sid并使用-拼接：

进入秘塔AI搜索，登录账号（建议登录账号，否则可能遭遇奇怪的限制），然后F12打开开发者工具，从Application > Cookies中找到uid和sid的值。

将uid和sid拼接：uid-sid，如 65e91a6b2bac5b600dd8526a-5e7acc465b114236a8d9de26c9f41846。

这将作为Authorization的Bearer Token值：Authorization: Bearer uid-sid

接口地址：https://metasofreeapi.shadow.cloudns.org

##### 聆心智能 (Emohaa) 

登录进入然后F12打开开发者工具，从Application > Local Storage中找到token的值，这将作为Authorization的Bearer Token值：Authorization: Bearer TOKEN

接口地址：https://emohaafreeapi.shadow.cloudns.org


##### Githubs
月之暗面（Kimi）接口转API kimi-free-api：https://github.com/LLM-Red-Team/kimi-free-api
阶跃星辰 (跃问StepChat) 接口转API step-free-api：https://github.com/LLM-Red-Team/step-free-api
阿里通义 (Qwen) 接口转API qwen-free-api：https://github.com/LLM-Red-Team/qwen-free-api
ZhipuAI (智谱清言) 接口转API glm-free-api：https://github.com/LLM-Red-Team/glm-free-api
秘塔AI (metaso) 接口转API metaso-free-api：https://github.com/LLM-Red-Team/metaso-free-api
聆心智能 (Emohaa) 接口转API emohaa-free-api：https://github.com/LLM-Red-Team/emohaa-freeapi
