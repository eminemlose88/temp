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

