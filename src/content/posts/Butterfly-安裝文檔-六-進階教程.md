---
title: Butterfly 安裝文檔(六) 進階教程
tags:
  - 教程
  - Hexo
  - 主題
  - butterfly
categories: Docs文檔
keywords: 'hexo,butterfly,主題,doc,教程,文檔'
description: Butterfly安裝文檔-進階教程
cover: https://jsd.012700.xyz/gh/jerryc127/CDN/img/butterfly-docs-06-cover.png
abbrlink: 4073eda
date: 2020-05-28 22:39:25
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

## 建議

1. 不要把個人需要的文件/圖片放在主題`source`文件夾裏，因為在升級主題的過程中，可能會把文件覆蓋刪除了。
在Hexo根目錄的`source`文件夾裏，創建一個文件夾來放置個人文件/圖片。
引用文件直接為`/文件夾名稱/文件名`

## 音樂

音樂界面使用了插件 `hexo-tag-aplayer`
使用方法請參考插件[文檔](https://github.com/MoePlayer/hexo-tag-aplayer/blob/master/docs/README-zh_cn.md)

音樂頁面只是普通的page頁，按普通頁面操作生成就行。

> 以下內容可供**選擇**配置
>
> 注意： 仍需要安裝插件[hexo-tag-aplayer](https://github.com/MoePlayer/hexo-tag-aplayer)

插件會在每一個文件都插入 js 和 css，為了避免這一情況，3.0 版本內置了 aplayer 需要的 css 和 js。

首先在Hexo根目錄`_config`裏配置`asset_inject`為`false`

```yaml
aplayer:
  asset_inject: false
```

然後在你需要使用aplayer的頁面Front-matter添加

```markdown
aplayer: true
```

這樣只會在需要aplayer的頁面插入js和css。

如何添加全局 Aplayer 播放，請參考 [這篇文章](/posts/507c070f/)

## 電影

電影界面使用了插件 `hexo-butterfly-douban`
使用方法請參考插件的[文檔](https://github.com/jerryc127/butterfly-plugins/tree/main/hexo-butterfly-douban)。

**注意：** 
1. hexo-butterfly-douban 會主動生成頁面，所以不需要自己創建。
2. 如遇到無法抓取問題，顯示 `INFO  0 movies have been loaded in xxx ms, because you are offline or your network is bad`
   請過段時間再試試，這我也無能為力。

## 説説

### Artitalk

安裝插件 [hexo-butterfly-artitalk](https://www.npmjs.com/package/hexo-butterfly-artitalk)

具體配置查看[插件文檔](https://github.com/jerryc127/butterfly-plugins/tree/main/hexo-butterfly-artitalk)

### HexoPlusPlus Talk

安裝插件 [hexo-butterfly-hpptalk](https://www.npmjs.com/package/hexo-butterfly-hpptalk)

具體配置查看[插件文檔](https://github.com/jerryc127/butterfly-plugins/tree/main/hexo-butterfly-hpptalk)

## 自定義代碼配色

{% btn '/posts/b37b5fe3/','點擊前往',fas fa-code,block blue %}


## 自定義側邊欄

{% btn '/posts/ea33ab97/','點擊前往',fas fa-lightbulb,block green %}



## 添加全局吸底Aplayer教程

{% btn '/posts/507c070f/','點擊前往',fas fa-music,block pink %}
## Icon

Butterfly主題內置了[Font Awesome V5 ](https://fontawesome.com/)圖標，目前已更新到 5.13.0，總共有1,588個免費圖標。由於是國外的圖標網站，對於國內的一些網站Icon並不支持。如有需要，你可以引入其它的圖標服務商。

### iconfont

國內最出名的莫過於[iconfont](https://www.iconfont.cn/),功能很強大且圖標內容很豐富的矢量圖標庫。很多`Font Awesome`不支持的圖標都可以在這裏找到。同時，[iconfont](https://www.iconfont.cn/)支持選擇需要的圖標生成css鏈接，減少不必要的CSS加載。

#### 註冊賬號

打開[iconfont](https://www.iconfont.cn/)的網站，點擊導航欄的`人像`圖標，會跳出註冊界面，按要求註冊賬號。

![Snipaste_2020-05-28_21-12-01](https://jsd.012700.xyz/gh/jerryc127/CDN/img/butterfly-iconfont.png)

#### 添加圖標入庫

選擇自己需要的圖標，把鼠標移到圖標上，會顯示三個按鈕（依次是添加入庫、收藏和下載），而我們需要的是把圖標添加入庫

![image-20200528205401440](https://jsd.012700.xyz/gh/jerryc127/CDN/img/butterfly-iconfont-add.png)

添加入庫後，你可以看到網站右上角`購物車`圖標顯示了`1`字，代表圖標已經添加入庫，點擊`購物車`圖標，會彈出側邊欄顯示詳情。

![image-20200528205925258](https://jsd.012700.xyz/gh/jerryc127/CDN/img/butterfly-iconfont-check.png)

![image-20200528210120442](https://jsd.012700.xyz/gh/jerryc127/CDN/img/butterfly-iconfont-detail.png)



已選擇的圖標會顯示在上面，你可以重複上面的操作，把需要的圖標添加入庫，然後點擊`添加到項目`。

接下來會要求選擇項目名稱，沒有的自己創建一個。

![image-20200528211624459](https://jsd.012700.xyz/gh/jerryc127/CDN/img/butterfly-iconfont-create.png)

#### 生成CSS鏈接

在添加到項目之後，會跳到項目的詳情界面。點擊`Font class`，然後再點擊`暫無代碼，點擊生成`文字。網站會自動生成CSS鏈接，我們只需要複製鏈接就行。

![image-20200528212301786](https://jsd.012700.xyz/gh/jerryc127/CDN/img/butterfly-iconfont-link.png)

#### 添加鏈接進主題配置文件

打開`主題配置文件`，找到`inject`配置，按要求把鏈接填入

![image-20200528212440743](https://jsd.012700.xyz/gh/jerryc127/CDN/img/butterfly-iconfont-setting.png)

在我們需要使用的地方填入icon，例如`Menu`，圖片使用格式為`iconfont icon名字`

![image-20200528213151304](https://jsd.012700.xyz/gh/jerryc127/CDN/img/butterfly-iconfont-setting-menu.png)

運行Butterfly之後，你就可以看到menu的圖標生效了

![image-20200528213346338](https://jsd.012700.xyz/gh/jerryc127/CDN/img/butterfly-iconfont-show.png)

#### 其他添加方法

除了通過引入CSS鏈接使用圖標，iconfont也支持通過其它方法使用圖標，具體可查看[iconfont官方使用文檔](https://www.iconfont.cn/help/detail?helptype=code)

### 其它圖標提供商

除了[iconfont](https://www.iconfont.cn/)，還有[RemixIcon](https://github.com/Remix-Design/RemixIcon)、[Flaticon](https://www.flaticon.com/categories/seo-and-web)等等提供商，很多圖標可以選擇，具體使用方法請參考各自的文檔。

## 圖片壓縮

Butterfly主題需要使用到很多圖片。如果圖片太大，會嚴重拖慢網站的加載速度。

圖片壓縮能夠有效的緩解這個問題。

除了通過`gulp-imagemin`來壓縮圖片，還可以通過在綫壓縮網站和軟件來進行壓縮。以下兩款是我自己正在使用的工具。網上有很多這樣的工具，挑選一款適合自己的就行。

- [tinypng](https://tinypng.com/)

  一個在綫壓縮的網站。壓縮後的圖片也保留了很高的質量，在知乎上很多人推薦，不過免費版有限制。

  ![image-20200526173511503](https://jsd.012700.xyz/gh/jerryc127/CDN/img/butterfly-tinypng.png)

- [caesium](https://saerasoft.com/caesium/)

  開源軟件，支持Windows和macOS。可以批量壓縮軟件，無限制。

  ![image-20200526173316278](https://jsd.012700.xyz/gh/jerryc127/CDN/img/butterfly-caesium.png)
  
-  [imgbot](https://github.com/marketplace/imgbot)

  imgbot 是一款 Github 插件。

  安裝後，你上傳圖片到 Github 去，imgbot 會自動壓縮圖片並推送 PR，我們只需要合併 PR 就行

  你可以配置 imgbot 的偵測方法、壓縮方法（有損/無損），具體可以查看插件的文檔

  ![image-20200830231742951](https://jsd.012700.xyz/gh/jerryc127/CDN/img/butterfly-enhance-imgbot.png)

  
## 系列文章

在`_config.butterfly.yml`中`aside`模块下添加下面代码

```text
  card_post_series:
    enable: true
    orderBy: 'date' # Order by title or date
    order: 1 # Sort of order. 1, asc for ascending; -1, desc for descending
```

然后在文章上加上`series`即可，他会根据后面的名称判断是否是同一个系列

```text
---
title: Hexo添加系列文章
abbrlink: ae7bb3d1
date: 2024-02-03 03:15:04
series: Hexo系列
---
```
## 插件推薦

- [hexo-abbrlink](https://github.com/rozbo/hexo-abbrlink)

  可以把鏈接permalink轉為數字的插件，配置容易，生成時自動轉為數字。

- [hexo-generator-feed](https://github.com/hexojs/hexo-generator-feed) 

  生成RSS文件的插件
  
- [hexo-filter-nofollow](https://github.com/hexojs/hexo-filter-nofollow)

  為網站使用到的所有外鏈添加`rel="noopener external nofollow noreferrer"`, 可以有效地加強網站SEO和防止權重流失

- [hexo-generator-sitemap](https://github.com/hexojs/hexo-generator-sitemap)

  生成sitemap的插件

- [hexo-generator-baidu-sitemap](https://github.com/coneycode/hexo-generator-baidu-sitemap)

  看名字就知道，是專門為百度生成sitemap的插件