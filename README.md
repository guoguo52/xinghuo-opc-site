# 星火聚落 OPC 线上服务平台 · 官网页面雏形 v4

基于《星火聚落OPC线上平台功能模块设置.pptx》设计的官网原型，纯 HTML + CSS + JS，
无需构建，双击即可预览。v4 采用浅色国际编辑部视觉：浅紫纸白底、深梅文字、
真实星火紫 logo 图形与电影感暗色媒体窗口。

## 线上地址

- 网站：https://guoguo52.github.io/xinghuo-opc-site/
- 仓库：https://github.com/guoguo52/xinghuo-opc-site
- 托管：GitHub Pages（免费静态托管），推送 `main` 分支后自动更新。

## 快速预览

- 直接双击 `index.html` 用浏览器打开即可。
- 推荐在本地起一个静态服务以获得完整体验：
  `python -m http.server 8000`，然后访问 `http://localhost:8000`。

## 页面清单

| 页面 | 文件 | 说明 |
| --- | --- | --- |
| 首页 | index.html | 首屏品牌区、四大板块主次卡片、服务闭环、AI 生产工具、作品案例、数据带、生态合作、CTA |
| AI 短视频工作台 | workbench.html | 五大子模块、生产流水线、画布式工作台说明 |
| 星火学院 | academy.html | 四大教学模块、学习路径、课程联动 |
| 矩阵分销 | distribution.html | 四大能力、分佣流程、渠道现状 |
| 星火 OPC | opc.html | 四大服务、社群活动、入驻路径 |
| AI 生产工具 | tools.html | 七项核心工具总览，含开放状态标注 |
| 作品案例 | works.html | 分类筛选案例库（短剧切片 / 二创混剪 / 品牌项目 / 学员作品） |
| 关于我们 | about.html | 品牌故事、业务矩阵、生态合作、入驻申请表单、联系合作 |

## 结构

```
xinghuo-opc-site/
  index.html           首页
  workbench.html       AI 短视频工作台
  academy.html         星火学院
  distribution.html    矩阵分销
  opc.html             星火 OPC
  tools.html           AI 生产工具
  works.html           作品案例
  about.html           关于我们 / 品牌业务
  assets/
    css/base.css       设计系统与基础组件
    css/pages.css      页面区块与响应式
    js/main.js         共享交互脚本
```

## 设计说明

- 浅色时尚编辑部风格，全站直角边框体系。
- 页面底色 `#F7F3F8`，深梅文字 `#1B1220`，交互主紫 `#8553C7`。
- logo 精确色取自 PDF 第 10 页矢量标识：`#AB51C3`、`#BF51C0`、`#9A52C5`、`#8553C7`、`#5456CD`、`#CD5DB7`。
- 头部与页脚已使用从 PDF 矢量页面提取的真实图形标：`assets/img/xinghuo-logo-mark.svg`。
- 完整纵向组合标：`assets/img/xinghuo-logo-lockup.svg`。
- 桌面一级导航放大到 20px，导航高度 88px，滚动后收缩到 72px。
- 首页主视觉、板块滑块、封面故事、案例 Mosaic 与工具海报统一为 16:10 窗口比例。
- 作品案例保留原始素材色彩，封面不叠加滤镜或色彩蒙层，标题放在图下信息栏。
- 案例库采用精选案例主视觉 + 非对称 12 栏案例档案网格，卡片带 CASE 编号、悬停紫线与筛选淡入。
- 本次设计判断由 DMX 接入的 `claude-fable-5-2` 模型生成，再按 logo 色样与响应式需求人工落实。
- 首页首屏采用非对称分屏：左侧巨幅宣言，右侧概念海报自动轮播。
- 四大板块采用全宽自动滑块，支持点击、键盘方向键与手机滑动，悬停自动暂停。
- 概念海报由即梦 Canvas CLI 的 ImageMax 1.0 模型生成（2K / 3:4），可在即梦画布中继续改图：
  https://jimeng.jianying.com/ai-tool/ai-canvas/a07e5e4e-3684-4f4b-b20d-77549b743e84
- 作品区使用本地 AI 表演案例素材与即梦封面混排，正式上线前需确认素材版权。
- 动效遵循 `prefers-reduced-motion`，滚动进场基于 IntersectionObserver。

## 待完善（页面雏形阶段）

- 案例文案与数据为示意占位，接入真实素材后直接替换即可。
- 合作方名称与联系方式为规划占位，正式上线前需确认露出权益。
- 入驻表单目前仅做前端反馈，尚未接入后端。
