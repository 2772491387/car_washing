# Project Background

这是一个汽车洗护门店的 HTML 单页面项目，品牌名为「澄镜汽车洗护」。页面面向需要洗车、内饰深洁、漆面护理和镀膜保护的车主，整体气质应保持简约、大气、干净、可信赖。

## Current Scope

- `public/index.html` 是页面结构入口，只保留 HTML 和资源引用。
- `public/styles/site.css` 存放整站样式和响应式布局。
- `public/scripts/main.js` 存放套餐切换、移动端菜单和 FAQ 展开等交互。
- `public/assets/images/hero-car-wash.png` 是首页主视觉背景图，用于营造高端汽车洗护氛围。
- `public/assets/icons/logo-mark.svg` 是导航栏 logo，风格应保持简单，不要做得太复杂。
- `server/app.js` 是 Node 后端入口，使用内置 HTTP 模块托管静态页面和挂载 API。
- `server/routes/` 存放 API 路由，目前包含健康检查和预约接口骨架。
- `server/db/bookingsRepository.js` 使用 Node 内置 SQLite 保存预约数据，默认数据库在 `server/data/bookings.sqlite`。
- 页面可以通过 `npm run dev` 或 `npm start` 启动后访问；当前版本不依赖第三方 npm 包。

## Page Sections

- 顶部导航：品牌 logo、服务项目、套餐价格、护理流程、预约入口。
- Hero 首屏：主视觉、品牌主张、预约按钮和服务亮点。
- 服务项目：精致外洗、内饰深洁、漆面护理、镀膜保护。
- 套餐价格：日常精洗、深度焕新、镀膜守护，并通过 JS 切换内容。
- 护理流程：验车沟通、分区清洁、护理保护、交付复检。
- 预约表单：收集姓名、手机号、车型、服务套餐、日期、时段和备注。
- FAQ：回答新车镀膜、内饰留香、雨天洗车等常见问题。

## Design Notes

- 视觉关键词：清爽、专业、精致、现代门店感。
- 主色使用深色、青绿色和珊瑚红，避免把页面改成过度花哨或过度营销的风格。
- 卡片圆角保持克制，当前整体使用 8px 左右的圆角。
- 移动端优先保证标题、按钮、logo 和导航菜单不拥挤、不重叠。
- logo 已按用户要求简化，后续调整应继续保持简洁。

## Maintenance Notes

- 修改文案时优先保持中文自然、短句清楚，适合真实门店落地。
- 修改套餐内容时，同步检查 HTML 初始展示和底部 `packages` JS 数据。
- 替换主视觉时，保持文件路径或同步更新 CSS 中的 `public/assets/images/hero-car-wash.png` 引用。
- 后端依赖 Node.js，npm 在 PowerShell 下如遇脚本策略限制，可以使用 `npm.cmd`。
- 之前尝试安装 Express 依赖时受限于沙箱网络审批，因此当前环境采用零依赖 Node 服务；后续需要数据库或中间件时再引入依赖。
- 预约数据属于运行数据，不要提交 `server/data/` 下的 SQLite 数据库文件。
- 本项目没有外部依赖，尽量不要引入框架或复杂构建流程，除非需求明显升级。
