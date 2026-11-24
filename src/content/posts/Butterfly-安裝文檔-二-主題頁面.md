---
title: Butterfly 安裝文檔(二) 主題頁面
date: 2020-05-28 22:34:41
tags:
  - 教程
  - Hexo
  - 主題
  - butterfly
categories: 
- Docs文檔
keywords: 'hexo,butterfly,主題,doc,教程,文檔'
description: Butterfly安裝文檔-主題頁面
cover: https://jsd.012700.xyz/gh/jerryc127/CDN/img/Butterfly-docs-02-cover.png
abbrlink: dc584b87
comments: false
---

{% note green 'fas fa-rocket' %}

 📚  文檔目錄

{% post_link Butterfly-安裝文檔-一-快速開始 ' 🚀 快速開始' %} - {% post_link Butterfly-安裝文檔-二-主題頁面 ' 📑 主題頁面' %} - {% post_link Butterfly-安裝文檔-三-主題配置-1 ' 📌 主題配置-1' %} - {% post_link Butterfly-安裝文檔-四-主題配置-2 ' ⚔️ 主題配置-2' %} - {% post_link Butterfly-安裝文檔-五-主題問答 ' ❓ 主題問答' %} - {% post_link Butterfly-安裝文檔-六-進階教程 ' ⚡️ 進階教程' %}

{% endnote %}

{% note orange 'fas fa-magic' %}

你可以通過右下角的 **簡** 按鈕切換為簡體顯示 

{% endnote %}

***

## Front-matter

**Front-matter 是 markdown 文件最上方以 `---` 分隔的區域，用於指定個別檔案的變數。**

- Page Front-matter 用於`頁面`配置
- Post Front-matter 用於`文章頁`配置

{% note info %}

如果標注`可選`的參數，可根據自己需要添加，不用全部都寫在 markdown 裏

{% endnote %}

### Page Front-matter

```markdown
---
title:
date:
updated:
type:
comments:
description:
keywords:
top_img:
mathjax:
katex:
aside:
aplayer:
highlight_shrink:
random:
---
```

| 寫法             | 解釋                                                         |
| ---------------- | ------------------------------------------------------------ |
| title            | 【必需】頁面標題                                             |
| date             | 【必需】頁面創建日期                                         |
| type             | 【必需】標籤、分類和友情鏈接三個頁面需要配置                 |
| updated          | 【可選】頁面更新日期                                         |
| description      | 【可選】頁面描述                                             |
| keywords         | 【可選】頁面關鍵字                                           |
| comments         | 【可選】顯示頁面評論模塊 (默認 true)                         |
| top_img          | 【可選】頁面頂部圖片                                         |
| mathjax          | 【可選】顯示mathjax (當設置mathjax的per_page: false時，才需要配置，默認 false) |
| katex            | 【可選】顯示katex (當設置katex的per_page: false時，才需要配置，默認 false) |
| aside            | 【可選】顯示側邊欄 (默認 true)                               |
| aplayer          | 【可選】在需要的頁面加載aplayer的js和css,請參考文章下面的`音樂` 配置 |
| highlight_shrink | 【可選】配置代碼框是否展開 (true/false) (默認為設置中highlight_shrink的配置) |
| random           | 【可選】配置友情鏈接是否隨機排序（默認為 false)              |

### Post Front-matter

```markdown
---
title:
date:
updated:
tags:
categories:
keywords:
description:
top_img:
comments:
cover:
toc:
toc_number:
toc_style_simple:
copyright:
copyright_author:
copyright_author_href:
copyright_url:
copyright_info:
mathjax:
katex:
aplayer:
highlight_shrink:
aside:
abcjs:
---
```

| 寫法                  | 解釋                                                         |
| :-------------------- | ------------------------------------------------------------ |
| title                 | 【必需】文章標題                                             |
| date                  | 【必需】文章創建日期                                         |
| updated               | 【可選】文章更新日期                                         |
| tags                  | 【可選】文章標籤                                             |
| categories            | 【可選】文章分類                                             |
| keywords              | 【可選】文章關鍵字                                           |
| description           | 【可選】文章描述                                             |
| top_img               | 【可選】文章頂部圖片                                         |
| cover                 | 【可選】文章縮略圖(如果沒有設置top_img,文章頁頂部將顯示縮略圖，可設為false/圖片地址/留空) |
| comments              | 【可選】顯示文章評論模塊(默認 true)                          |
| toc                   | 【可選】顯示文章TOC(默認為設置中toc的enable配置)             |
| toc_number            | 【可選】顯示toc_number(默認為設置中toc的number配置)          |
| toc_style_simple      | 【可選】顯示 toc 簡潔模式                                    |
| copyright             | 【可選】顯示文章版權模塊(默認為設置中post_copyright的enable配置) |
| copyright_author      | 【可選】文章版權模塊的`文章作者`                             |
| copyright_author_href | 【可選】文章版權模塊的`文章作者`鏈接                         |
| copyright_url         | 【可選】文章版權模塊的`文章連結`鏈接                         |
| copyright_info        | 【可選】文章版權模塊的`版權聲明`文字                         |
| mathjax               | 【可選】顯示mathjax(當設置 mathjax 的 per_page:  false 時，才需要配置，默認  false ) |
| katex                 | 【可選】顯示 katex (當設置 katex 的 per_page:  false 時，才需要配置，默認   false ) |
| aplayer               | 【可選】在需要的頁面加載 aplayer 的 js 和 css,請參考文章下面的`音樂` 配置 |
| highlight_shrink      | 【可選】配置代碼框是否展開(true/false)(默認為設置中 highlight_shrink 的配置) |
| aside                 | 【可選】顯示側邊欄 (默認 true)                               |
| abcjs                 | 【可選】加載 abcjs (當設置 abcjs 的 per_page:  false 時，才需要配置，默認   false ) |

## 標籤頁

1. 前往你的 Hexo 博客的根目錄

2. 輸入 `hexo new page tags`

3. 你會找到 `source/tags/index.md` 這個文件

4. 修改這個文件：

   **記得添加 `type: "tags"`**

```markdown
---
title: 標籤
date: 2018-01-05 00:00:00
type: "tags"
orderby: random
order: 1
---
```

| 參數    | 解釋                                                         |
| ------- | ------------------------------------------------------------ |
| type    | 【必須】頁面類型，必須為 `tags`                              |
| orderby | 【可選】排序方式 ：random/name/length                        |
| order   | 【可選】排序次序： 1, asc for ascending; -1, desc for descending |

## 分類頁

1. 前往你的 Hexo 博客的根目錄

2. 輸入 `hexo new page categories`

3. 你會找到 `source/categories/index.md` 這個文件

4. 修改這個文件：

   **記得添加 `type: "categories"`**

```markdown
---
title: 分類
date: 2018-01-05 00:00:00
type: "categories"
---
```

## 友情鏈接

為你的博客創建一個友情鏈接！

### 創建友情鏈接頁面

1. 前往你的 Hexo 博客的根目錄

2. 輸入 `hexo new page link`

3. 你會找到 `source/link/index.md` 這個文件

4. 修改這個文件：

   記得添加 `type: "link"`

```markdown
---
title: 友情鏈接
date: 2018-06-07 22:17:49
type: "link"
---
```

### 友情鏈接添加

{% tabs flink-add %}

<!-- tab 本地生成 -->

在Hexo博客目錄中的 `source/_data`（如果沒有 _data 文件夾，請自行創建），創建一個文件 `link.yml`

```yml
- class_name: 友情鏈接
  class_desc: 那些人，那些事
  link_list:
    - name: Hexo
      link: https://hexo.io/zh-tw/
      avatar: https://d33wubrfki0l68.cloudfront.net/6657ba50e702d84afb32fe846bed54fba1a77add/827ae/logo.svg
      descr: 快速、簡單且強大的網誌框架

- class_name: 網站
  class_desc: 值得推薦的網站
  link_list:
    - name: Youtube
      link: https://www.youtube.com/
      avatar: https://i.loli.net/2020/05/14/9ZkGg8v3azHJfM1.png
      descr: 視頻網站
    - name: Weibo
      link: https://www.weibo.com/
      avatar: https://i.loli.net/2020/05/14/TLJBum386vcnI1P.png
      descr: 中國最大社交分享平台
    - name: Twitter
      link: https://twitter.com/
      avatar: https://i.loli.net/2020/05/14/5VyHPQqR6LWF39a.png
      descr: 社交分享平台
```

`class_name`  和 `class_desc` 支持 html 格式書寫，如不需要，也可以留空。

<!-- endtab -->

<!-- tab 遠程拉取 -->

從 `4.0.0` 開始，支持從遠程加載友情鏈接，遠程拉取只支持 `json`。

注意： 選擇遠程加載後，本地生成的方法會無效。

在  `source/link/index.md` 這個文件的 front-matter 添加遠程鏈接

```markdown
flink_url: xxxxx
```

Json 的格式

```json
[
  {
    "class_name": "友情鏈接",
    "class_desc": "那些人，那些事",
    "link_list": [
      {
        "name": "Hexo",
        "link": "https://hexo.io/zh-tw/",
        "avatar": "https://d33wubrfki0l68.cloudfront.net/6657ba50e702d84afb32fe846bed54fba1a77add/827ae/logo.svg",
        "descr": "快速、簡單且強大的網誌框架"
      }
    ]
  },
  {
    "class_name": "網站",
    "class_desc": "值得推薦的網站",
    "link_list": [
      {
        "name": "Youtube",
        "link": "https://www.youtube.com/",
        "avatar": "https://i.loli.net/2020/05/14/9ZkGg8v3azHJfM1.png",
        "descr": "視頻網站"
      },
      {
        "name": "Weibo",
        "link": "https://www.weibo.com/",
        "avatar": "https://i.loli.net/2020/05/14/TLJBum386vcnI1P.png",
        "descr": "中國最大社交分享平台"
      },
      {
        "name": "Twitter",
        "link": "https://twitter.com/",
        "avatar": "https://i.loli.net/2020/05/14/5VyHPQqR6LWF39a.png",
        "descr": "社交分享平台"
      }
    ]
  }
]
```

<!-- endtab -->

{% endtabs %}

### 友情鏈接隨機排序

主題支持友情鏈接隨機排序，只需要在頂部 `front-matter` 添加 `random: true`

### 友情鏈接界面設置

由 2.2.0 起，友情鏈接界面可以由用户自己自定義，只需要在友情鏈接的md檔設置就行，以普通的Markdown格式書寫。

## 圖庫

圖庫頁面只是普通的頁面，你只需要 `hexo n page xxxxx` 創建你的頁面就行

然後使用標簽外掛 [galleryGroup](https://butterfly.js.org/posts/4aa8abbe/#Gallery%E7%9B%B8%E5%86%8A%E5%9C%96%E5%BA%AB)，具體用法請查看對應的內容。

```yaml
<div class="gallery-group-main">
{% galleryGroup '壁紙' '收藏的一些壁紙' '/Gallery/wallpaper' https://i.loli.net/2019/11/10/T7Mu8Aod3egmC4Q.png %}
{% galleryGroup '漫威' '關於漫威的圖片' '/Gallery/marvel' https://i.loli.net/2019/12/25/8t97aVlp4hgyBGu.jpg %}
{% galleryGroup 'OH MY GIRL' '關於OH MY GIRL的圖片' '/Gallery/ohmygirl' https://i.loli.net/2019/12/25/hOqbQ3BIwa6KWpo.jpg %}
</div>
```

<div class="gallery-group-main">
{% galleryGroup '壁紙' '收藏的一些壁紙' '/Gallery/wallpaper' https://i.loli.net/2019/11/10/T7Mu8Aod3egmC4Q.png %}
{% galleryGroup '漫威' '關於漫威的圖片' '/Gallery/marvel' https://i.loli.net/2019/12/25/8t97aVlp4hgyBGu.jpg %}
{% galleryGroup 'OH MY GIRL' '關於OH MY GIRL的圖片' '/Gallery/ohmygirl' https://i.loli.net/2019/12/25/hOqbQ3BIwa6KWpo.jpg %}
</div>

### 子頁面

子頁面也是普通的頁面，你只需要 `hexo n page xxxxx` 創建你的頁面就行

然後使用標簽外掛 [gallery](/posts/4aa8abbe/#Gallery%E7%9B%B8%E5%86%8A)，具體用法請查看對應的內容。

```yaml
{% gallery %}
![](https://i.loli.net/2019/12/25/Fze9jchtnyJXMHN.jpg)
![](https://i.loli.net/2019/12/25/ryLVePaqkYm4TEK.jpg)
![](https://i.loli.net/2019/12/25/gEy5Zc1Ai6VuO4N.jpg)
![](https://i.loli.net/2019/12/25/d6QHbytlSYO4FBG.jpg)
![](https://i.loli.net/2019/12/25/6nepIJ1xTgufatZ.jpg)
![](https://i.loli.net/2019/12/25/E7Jvr4eIPwUNmzq.jpg)
![](https://i.loli.net/2019/12/25/mh19anwBSWIkGlH.jpg)
![](https://i.loli.net/2019/12/25/2tu9JC8ewpBFagv.jpg)
{% endgallery %}
```

{% gallery %}
![](https://i.loli.net/2019/12/25/Fze9jchtnyJXMHN.jpg)
![](https://i.loli.net/2019/12/25/ryLVePaqkYm4TEK.jpg)
![](https://i.loli.net/2019/12/25/gEy5Zc1Ai6VuO4N.jpg)
![](https://i.loli.net/2019/12/25/d6QHbytlSYO4FBG.jpg)
![](https://i.loli.net/2019/12/25/6nepIJ1xTgufatZ.jpg)
![](https://i.loli.net/2019/12/25/E7Jvr4eIPwUNmzq.jpg)
![](https://i.loli.net/2019/12/25/mh19anwBSWIkGlH.jpg)
![](https://i.loli.net/2019/12/25/2tu9JC8ewpBFagv.jpg)
{% endgallery %}

{% note pink 'fas fa-sitemap' %}

如果你想要使用 `/photo/ohmygirl` 這樣的鏈接顯示你的圖片內容

你可以把創建好的 `ohmygirl` 整個文件夾移到 `photo` 文件夾裏去

{% endnote %}

## 404頁面

主題內置了一個簡單的 404 頁面，可在設置中開啟

{% note info %}

本地預覽時，訪問出錯的網站是不會跳到 404 頁面的。

如需本地預覽，請訪問 `http://localhost:4000/404.html`

{% endnote %}

```yaml
# A simple 404 page
error_404:
  enable: true
  subtitle: "頁面沒有找到"
  background: 
```

![](https://jsd.012700.xyz/gh/jerryc127/CDN/img/hexo-theme-butterfly-docs-error404.png)

{% btn '/posts/4aa8abbe/',📌 Butterfly 安裝文檔(三) 主題配置,far fa-hand-point-right,block pink right larger %}

## 音视频播放

**Markdown 通用音乐/视频插入方法**

Markdown 作为轻量级的标记语言，兼容 html 语法，所以可以直接在 Markdown 文档中使用 html 语法。

`<vedio>`标签举例：

```xml
<video width="480" height="320" controls>
<source src="movie.mp4">
</video>
```

`<embed>`标签举例：

```xml
<embed src="http://player.youku.com/player.php/Type/Folder/Fid/27690810/Ob/1/sid/XMTY1MTI3NjMyNA==/v.swf" quality="high" width="480" height="400" align="middle" allowScriptAccess="always" allowFullScreen="true" mode="transparent" type="application/x-shockwave-flash"></embed>
```

`<iframe>`标签举例：

```xml
<iframe height=498 width=510 src="http://player.youku.com/embed/XMTY1MTI3NjMyNA==" frameborder=0 allowfullscreen></iframe>
```

`javascript`标签举例:

```xml
<script type="text/javascript" src="http://www.xiami.com/widget/player-single?uid=32329501&sid=1776238762&mode=js"></script>
```

除`<vedio>`标签外，大部分音乐/视频网站都可以直接生成播放器代码，直接粘贴到 Markdown 文档中即可使用。

不过在 https 下，上述的有些标签可能无法正常使用。

# 通过 Hexo 插件插入音乐/视频

这里需要使用两个播放器插件

> hexo-tag-aplayer:[https://github.com/grzhan/hexo-tag-aplayer#upstream-issue](https://link.jianshu.com?t=https://github.com/grzhan/hexo-tag-aplayer#upstream-issue)  
> hexo-tag-dplayer:[https://github.com/NextMoe/hexo-tag-dplayer](https://link.jianshu.com?t=https://github.com/NextMoe/hexo-tag-dplayer)

```undefined
npm install hexo-tag-dplayer --save
npm install hexo-tag-aplayer --save
```

- ## 音乐
    

```bash
{% aplayer "Caffeine" "Jeff Williams" "http://7xq131.com1.z0.glb.clouddn.com/Preparation.mp3" "autoplay" %}
```

- ## 网易云音乐
    

```xml
<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=420125990&auto=1&height=66"></iframe>
```

- ## 虾米
    

```xml
<script type="text/javascript" src="http://www.xiami.com/widget/player-single?uid=32329501&sid=1776238762&mode=js"></script>
```

- ## 视频
    

```bash
{% dplayer "url=http://devtest.qiniudn.com/若能绽放光芒.mp4" "api=http://dplayer.daoapp.io" "pic=http://devtest.qiniudn.com/若能绽放光芒.png" "id=9E2E3368B56CDBB4" "loop=yes" "theme=#FADFA3" "autoplay=false" "token=tokendemo" %}
```

- ## 优酷
    

```xml
<embed src="http://player.youku.com/player.php/Type/Folder/Fid/27690810/Ob/1/sid/XMTY1MTI3NjMyNA==/v.swf" quality="high" width="480" height="400" 
```


| 名称                   | 默认值                                | 描述                                                                                                                                              |
| -------------------- | ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| container            | document.querySelector('.dplayer') | 播放器容器元素                                                                                                                                         |
| live                 | false                              | 开启直播模式, 见[#直播](https://dplayer.diygod.dev/zh/guide.html#%E7%9B%B4%E6%92%AD)                                                                     |
| autoplay             | false                              | 视频自动播放                                                                                                                                          |
| theme                | '#b7daff'                          | 主题色                                                                                                                                             |
| loop                 | false                              | 视频循环播放                                                                                                                                          |
| lang                 | navigator.language.toLowerCase()   | 可选值: 'en', 'zh-cn', 'zh-tw'                                                                                                                     |
| screenshot           | false                              | 开启截图，如果开启，视频和视频封面需要允许跨域                                                                                                                         |
| hotkey               | true                               | 开启热键，支持快进、快退、音量控制、播放暂停                                                                                                                          |
| airplay              | false                              | 在 Safari 中开启 AirPlay                                                                                                                            |
| chromecast           | false                              | 启用 Chromecast                                                                                                                                   |
| preload              | 'auto'                             | 视频预加载，可选值: 'none', 'metadata', 'auto'                                                                                                           |
| volume               | 0.7                                | 默认音量，请注意播放器会记忆用户设置，用户手动设置音量后默认音量即失效                                                                                                             |
| playbackSpeed        | [0.5, 0.75, 1, 1.25, 1.5, 2]       | 可选的播放速率，可以设置成自定义的数组                                                                                                                             |
| logo                 | -                                  | 在左上角展示一个 logo，你可以通过 CSS 调整它的大小和位置                                                                                                               |
| apiBackend           | -                                  | 自定义获取和发送弹幕行为，见[#直播](https://dplayer.diygod.dev/zh/guide.html#%E7%9B%B4%E6%92%AD)                                                                |
| preventClickToggle   | false                              | 阻止点击播放器时候自动切换播放/暂停                                                                                                                              |
| video                | -                                  | 视频信息                                                                                                                                            |
| video.quality        | -                                  | 见[#清晰度切换](https://dplayer.diygod.dev/zh/guide.html#%E6%B8%85%E6%99%B0%E5%BA%A6%E5%88%87%E6%8D%A2)                                               |
| video.defaultQuality | -                                  | 见[#清晰度切换](https://dplayer.diygod.dev/zh/guide.html#%E6%B8%85%E6%99%B0%E5%BA%A6%E5%88%87%E6%8D%A2)                                               |
| video.url            | -                                  | 视频链接                                                                                                                                            |
| video.pic            | -                                  | 视频封面                                                                                                                                            |
| video.thumbnails     | -                                  | 视频缩略图，可以使用 [DPlayer-thumbnails (opens new window)](https://github.com/MoePlayer/DPlayer-thumbnails)生成                                           |
| video.type           | 'auto'                             | 可选值: 'auto', 'hls', 'flv', 'dash', 'webtorrent', 'normal' 或其他自定义类型, 见[#MSE 支持](https://dplayer.diygod.dev/zh/guide.html#mse-%E6%94%AF%E6%8C%81) |
| video.customType     | -                                  | 自定义类型, 见[#MSE 支持](https://dplayer.diygod.dev/zh/guide.html#mse-%E6%94%AF%E6%8C%81)                                                              |
| subtitle             | -                                  | 外挂字幕                                                                                                                                            |
| subtitle.url         | `required`                         | 字幕链接                                                                                                                                            |
| subtitle.type        | 'webvtt'                           | 字幕类型，可选值: 'webvtt', 'ass'，目前只支持 webvtt                                                                                                          |
| subtitle.fontSize    | '20px'                             | 字幕字号                                                                                                                                            |
| subtitle.bottom      | '40px'                             | 字幕距离播放器底部的距离，取值形如: '10px' '10%'                                                                                                                 |
| subtitle.color       | '#fff'                             | 字幕颜色                                                                                                                                            |
| danmaku              | -                                  | 显示弹幕                                                                                                                                            |
| danmaku.id           | `required`                         | 弹幕池 id，必须唯一                                                                                                                                     |
| danmaku.api          | `required`                         | 见[#弹幕接口](https://dplayer.diygod.dev/zh/guide.html#%E5%BC%B9%E5%B9%95%E6%8E%A5%E5%8F%A3)                                                         |
| danmaku.token        | -                                  | 弹幕后端验证 token                                                                                                                                    |
| danmaku.maximum      | -                                  | 弹幕最大数量                                                                                                                                          |
| danmaku.addition     | -                                  | 额外外挂弹幕，见[#bilibili 弹幕](https://dplayer.diygod.dev/zh/guide.html#bilibili-%E5%BC%B9%E5%B9%95)                                                    |
| danmaku.user         | 'DIYgod'                           | 弹幕用户名                                                                                                                                           |
| danmaku.bottom       | -                                  | 弹幕距离播放器底部的距离，防止遮挡字幕，取值形如: '10px' '10%'                                                                                                          |
| danmaku.unlimited    | false                              | 海量弹幕模式，即使重叠也展示全部弹幕，请注意播放器会记忆用户设置，用户手动设置后即失效                                                                                                     |
| danmaku.speedRate    | 1                                  | 弹幕速度倍率，越大速度越快                                                                                                                                   |
| contextmenu          | []                                 | 自定义右键菜单                                                                                                                                         |
| highlight            | []                                 | 自定义进度条提示点                                                                                                                                       |
| mutex                | true                               | 互斥，阻止多个播放器同时播放，当前播放器播放时暂停其他播放器                                                                                                                  |

# B站视频

https://blog.csdn.net/qq_43701912/article/details/124808590