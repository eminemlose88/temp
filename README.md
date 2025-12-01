# Noblesse-like Login & Dashboard

一个纯静态的登录/控制台原型，包含：
- 登录页（账号/密码/记住我/本地校验）
- 登录后首页 + 底部导航（首页/经理人资料/活动/视频/我的）
- 资料网格、视频列表、加载动效与暗金主题

## 运行

- Python 本地静态服务：
  ```bash
  python -m http.server 5173
  ```
  打开 `http://localhost:5173/` 访问登录页，或 `http://localhost:5173/dashboard.html` 直接访问控制台。

## 示例登录
- `admin@example.com` / `123456`
- `+8613800138000` / `123456`

## 结构
- `index.html` 登录页
- `dashboard.html` 多 Tab 主界面
- `forgot.html` 找回密码
- `styles.css` 样式
- `app.js` 登录交互
- `app-dashboard.js` 控制台交互

## 推送到 GitHub
首次初始化：
```bash
git init
git add -A
git commit -m "chore: init project"
git branch -M main
```
绑定远程并推送（两选一）：

- HTTPS（适合 PAT）：
  ```bash
  git remote add origin https://github.com/<你的用户名>/<你的仓库>.git
  git push -u origin main
  ```
  首次推送会提示登录，推荐到 GitHub 创建 PAT 并使用。

- SSH：
  ```bash
  git remote add origin git@github.com:<你的用户名>/<你的仓库>.git
  git push -u origin main
  ```

## GitHub Pages（可选）
- 仓库 Settings → Pages → Source 选择 `GitHub Actions`，使用静态站点部署工作流；或选择 `Deploy from a branch`，分支选 `main`，目录选 `/root`。

## 打赏后台与 Vercel KV

### 目录
- API 目录：`/api`（Vercel Serverless）
- 管理后台：`admin.html` + `admin.js`

### 环境变量
- `KV_REST_API_URL`、`KV_REST_API_TOKEN`：Vercel KV 提供
- `ADMIN_API_KEY`：自定义管理密钥，用于确认到账接口
 - `REDIS_URL` 或以下分解变量：
   - `REDIS_HOST`、`REDIS_PORT`、`REDIS_USERNAME`、`REDIS_PASSWORD`、`REDIS_TLS=true`

### 初始化本地环境变量
```bash
npm i -g vercel
vercel login
vercel link
vercel env pull .env.development.local
```
在 Vercel 项目 Settings → Environment Variables 中添加：
- `KV_REST_API_URL`、`KV_REST_API_TOKEN`
- `ADMIN_API_KEY`（任意安全随机字符串）

### 核心接口
- `POST /api/users/connect` 记录用户连接 `{ userId, name }`
- `POST /api/tips/create` 新建打赏 `{ userId, amount, currency, method, reference? }`
- `POST /api/tips/confirm` 标记到账（需 `Authorization: Bearer ADMIN_API_KEY`）
- `GET  /api/tips/by-user?userId=...` 获取某用户订单与合计
- `GET  /api/tips/summary` 总账与用户数
- `GET  /api/tips/status?id=...` 查询单笔状态
 - `GET  /api/redis/test` 通过 Redis Client 读写 `foo` 验证连接

### 安全
- 管理端操作通过 `ADMIN_API_KEY` 鉴权，前端仅在 `admin.html` 中使用。
- 金额与用户的关联以 `tip:<id>` 存储，用户索引保存在 `user_tips:<userId>`，总账累加在 `tips:total`。

## 使用 Redis Client 连接（按官方示例）

本地脚本（需要 Node 18+）：

```bash
npm run redis:test
```

仅设置一个环境变量（与 node-redis 官方推荐一致）：

```
REDIS_URL=rediss://default:<PASSWORD>@<HOST>:<PORT>
```

部署后在浏览器访问 `/api/redis/test`，返回 `{"ok":true,"result":"bar"}` 即表示连通。

