# Cloudflare Free Deployment

这个项目可以用 Cloudflare Pages 免费部署，获得公网 HTTPS 地址，例如：

```text
https://your-project.pages.dev
```

## Pages 设置

在 Cloudflare Dashboard 中创建 Pages 项目并连接 GitHub 仓库：

- Framework preset: None
- Build command: 留空
- Build output directory: `public`
- Root directory: 留空，除非仓库不是项目根目录

`functions/` 目录会被 Cloudflare Pages 自动识别为后端函数。

## D1 数据库

创建一个 D1 数据库，例如：

```text
car_washing_bookings
```

然后在 Pages 项目的设置里绑定 D1：

- Binding name: `DB`
- D1 database: 选择刚创建的数据库

绑定名必须是 `DB`，因为 `functions/api/bookings.js` 里使用的是 `context.env.DB`。

## 管理 Token

预约列表包含手机号，不应该公开给所有人访问。建议在 Pages 项目里增加环境变量：

```text
ADMIN_TOKEN=一串足够长的随机字符串
```

之后如果要调用预约列表接口，需要带请求头：

```text
Authorization: Bearer 你的_ADMIN_TOKEN
```

普通用户提交预约不需要这个 token。

## 初始化数据表

在 D1 的 Console 里执行根目录的 `schema.sql` 内容，创建预约表。

## 部署后验证

部署完成后访问：

```text
https://your-project.pages.dev/api/health
```

如果看到下面内容，说明函数可用：

```json
{
  "status": "ok",
  "service": "car-washing-site",
  "runtime": "cloudflare-pages"
}
```

然后打开首页提交一次预约，再访问：

```text
https://your-project.pages.dev/api/bookings
```

这个接口需要 `Authorization` 请求头。更简单的检查方式是去 Cloudflare D1 的数据表页面查看 `bookings` 表是否新增记录。
