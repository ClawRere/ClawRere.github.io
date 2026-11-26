---
title: AI知识丨普通人用AI的五个阶段
author: leidada
date: 2024-09-12 16:44
updated: 2024-09-12 16:44
abbrlink: a48571f1
categories: 个人笔记
hide: true
hidden: true
aside: true
comments: true
description: 
cover: 
sticky: 
top_img: 
keywords: 
tags:
---
大家好，这里是**磊大大**，专注于陪伴、成长与分享，愿你总能遇到温柔的人！

作为一个深入应用AI的产品经理，发现有不少朋友还不是特别熟练使用AI协助办公，这里给大家整理一个普通人也能轻松看懂的AI应用的五个阶段。
- 直接问问题
- 使用落地应用
- 使用优质prompt输出内容
- 创建工作流
- 创造Agent

![](https://xqimg.imedao.com/18d0b4272fdccdfb3fc13be1.png%21800.jpg)
## 直接问问题

最简单、最方便、最常用的方式就是，打开对话网页，输入你的问题，让AI返回问题的答案。

更高级一点的，就是通过输入完整的问题要求来让AI输出符合规范的答案，比如：

**提问方式=立角色 + 述问题 + 定目标 + 补要求**

```markdown

作为一个新闻稿编辑专家，请帮我根据以下信息，撰写一篇新闻稿：（时间、地点、人物，事情的起因、经过、结果）新闻稿由标题、导语、背景、主体和结尾组成。


你是一位小红书种草博主，请为【种草的产品】写一篇种草推文要求如下：
内容包括：产品卖点、使用场景、亲身体验。
文章多使用 emoji 的可爱表情，多用空行。
文案最后加标签，标签的格式是#标签。


你是一位专业管理专家，请你根据我接下来的任务 XXXXXXX，将它拆解成可以更好落地实现的：目标(Object)、关键结果(Key Results)、具体的行动项(Actions Items)。
```

![](https://cdn.jsdelivr.net/gh/Eddie-Hyu/picx-images-hosting@master/poster/202409131306633.png)

这些都是通过，丰富提问的内容，来让AI输出期望的回复，这是第一阶段，**使用**；


## 使用落地应用

其次，就是选择当前企业通过封装AI，直接落地成专业、专用的AI应用来解决对应领域的问题。

比如：
编程领域：cursor、Github  Coplit等等；
角色对话：Character.AI、猫箱AI、Talkie AI、彩云小梦等等；
医疗领域：大医模型(商汤科技)、盘古药物分子大模型(华为云)、讯飞晓医(科大讯飞)等等；
![](https://cdn.jsdelivr.net/gh/Eddie-Hyu/picx-images-hosting@master/poster/202409131349425.png)
学术领域：Storm(斯坦福)、秘塔AI、海鲸AI、Scholarcy、ResearchRabbit等等；

直接使用落地应用的好处就是：直接使用，无需调优，专业领域专业知识。
针对大模型的幻觉，或者说假大空的回答，有更多理论依据的输出，甚至可以找到出处。

【有需要网址的留言，我会加入到公众号发消息可以自行获取】

## 使用优质的prompt输出内容

这一阶段其实与使用落地应用难分高下，作为普通人，可能直接使用落地应用更好，但是针对一些没有实际落地场景的情况，使用优质的prompt来输出内容会更合适。

可以参考以下的优质prompt直接使用：[还不错的prompt整理](https://ldddd.eu.org/posts/c6492a1b)

![](https://cdn.jsdelivr.net/gh/Eddie-Hyu/picx-images-hosting@master/poster/202409221614247.png)

之前也写过怎么写标准有效的提示词的方法：[大模型提示词工程整理](https://ldddd.eu.org/posts/29dbdb32)

其实有很多写的很好的提示词只在**专用/通用领域**有效，作为一个普通用户，就得**站在巨人的肩膀上**，用他们的通用提示词，改成自己可以使用的**垂直领域**提示词，这样能更好发掘大模型的潜力。

在尝试使用自己制作的prompt在特殊场景使用的过程中，你也会提高对大模型的**把控能力**，让大模型的输出结果**更加可控**，**更加规范**。

例如，之前在[新功能丨我在公众号加入了汉语新解、八字...](https://mp.weixin.qq.com/s?__biz=MzIxOTQ5MDk4Mg==&mid=2247484437&idx=1&sn=62e15f9329db2394bf3a1a044b6b68aa&chksm=97db3bdca0acb2ca4972a1aeb2ae9987d7d31263099ea35e92b73b2d87fd5b06a4c2042039bd#rd)中提到的 **`汉语新解`** 就是让大模型输出固定格式的卡片结果。
#### 新媒体博主
![](https://cdn.jsdelivr.net/gh/Eddie-Hyu/picx-images-hosting@master/poster/202409181409872.png)

#### 中国男足
![](https://cdn.jsdelivr.net/gh/Eddie-Hyu/picx-images-hosting@master/poster/202409181404382.png)



## AI工作流

在prompt使用熟练之后，我们下一步就是尝试创建AI工作流。

工作流：一系列任务或步骤的**有序安排**，用于完成**特定的业务流程或项目**。

AI工作流中，大模型作为一项完整工作流程的一环，接收固定的输入，并按要求的格式输出内容，来达到**完整完成一套工作流程**的目的。

这个流程一般都是简单、简短的某一项工作。像 **`coze`** 中，就有很多其他人创建的工作流，用来完成诸如：视频文案提取、网页内容摘要等等内容。
![](https://cdn.jsdelivr.net/gh/Eddie-Hyu/picx-images-hosting@master/poster/202409221630292.png)

我们可以点开看看这些工作流的完整流程，以下摘录了一个例子：
#### arxiv论文获取与pdf快速阅读
输入论文主题→**AI提取关键信息**→在arxiv中搜索对应的论文*(搜索工作流)* →**AI批量提取链接**→从链接中提取pdf标题&内容*(链接提取工作流)* →输出所有整理的内容
![](https://cdn.jsdelivr.net/gh/Eddie-Hyu/picx-images-hosting@master/poster/202409221634923.png)

可以看到，整个工作流的目的是，通过简单输出主题，**在arxiv网站搜索相关的论文**并输出。但是这个过程中AI(带prompt)作为重要的衔接，同时调用了**其他的工作流**来完成这项工作。比如：论文搜索、从链接中提取网页信息..

## 创造Agent


**Agent**：也称智能体、BOT等。以LLM为大脑，感知、理解、处理并能自动化完成一系列复杂工作的系统。简单来说，输入你的需求，Agent会自动完成满足需求的所有工作。

AI Agent = AI+规划（Planning）+记忆（Memory）+工具使用（Tool Use）+反思（Reflection）
![](https://cdn.jsdelivr.net/gh/Eddie-Hyu/picx-images-hosting@master/poster/202409221651421.png)

#### 实际应用中的Agent
其实那些落地应用的软件/网页基本都按agent来设计的。

- 斯坦福AI小镇：25位AI Agent居民以人类化的行为模式在这个虚拟的小镇中进行活动：散步、喝咖啡、策划活动、参与排队等等。
![](https://mmbiz.qpic.cn/sz_mmbiz_png/GOHsECYibE4TCxa69xE4sRicYzQw0f0Kg88qZb9zAE2Haj4Tr5CicT97fiaRvLBuNwnF6b6L5bTG53lv4pa5rlBPRA/640?wx_fmt=png&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)
- ChatDev：一家由多个AI Agent组成的软件开发公司。由CEO Agent领衔，将任务细化并指派给CTO、CPO、Designer、Programer、Tester、Reviewer等各种AI Agent的角色。
![](https://mmbiz.qpic.cn/sz_mmbiz_png/GOHsECYibE4TCxa69xE4sRicYzQw0f0Kg8nCliaMaRVHciagyiaVsMW20wX0OqT963Sht5eqkmz5v9pUGsM0qcuw8NQ/640?wx_fmt=png&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)


#### 概念区分：Agent、LLM、RPA
LLM 和 Al Agent 的区别在于：Al Agent 可以独立思考，并做出行动。
RPA 和 Al Agent 的区别在于：Al Agent 能够处理未知环境信息。
![](https://cdn.jsdelivr.net/gh/Eddie-Hyu/picx-images-hosting@master/poster/202409221645402.png)

普通人想要做一个agent还是比较困难的，不过能做到AI工作流的排布就已经可以解决大部分问题了。

大家可以在COZE平台上尝试编排和使用工作流，也可以做一个BOT来体验，相信可以帮助自己在工作/生活中大大节省时间。

喜欢本文的朋友们，点个【赞】，再顺手点个【再看】就可以持续看到这种高质量的好文啦！


> [!NOTE] 文章推荐  
> - [我的博客网站：磊大大の小栈](https://ldddd.eu.org/)👈️  
> - [欢迎来到魔法世界--WizardingWorld](https://mp.weixin.qq.com/s/jc3c62itUzMs6P-0Xl0eOQ)👈️  
> - [津巴布韦币不再是最不值钱的了！](https://mp.weixin.qq.com/s/ND-boYh35HlGh4XixAHbnA)


欢迎关注我的个人公众号【愿你总能遇到温柔的人】
![wechat_plat.png](https://cdn.jsdelivr.net/gh/Eddie-Hyu/picx-images-hosting@master/poster/202409041405863.png)

