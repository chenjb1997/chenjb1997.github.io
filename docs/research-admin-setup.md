# Research 在线管理页：Supabase 接入指南

这套方案继续使用 GitHub Pages 托管网站，只把 Research 的**加密数据**放到 Supabase。公开页面可以匿名读取密文，但仍需原来的 Vault 密码在浏览器本地解密；只有指定的 Supabase 管理员账号能保存更新。

## 1. 创建 Supabase 项目

1. 在 [Supabase Dashboard](https://supabase.com/dashboard) 创建项目，地区选离主要访问者较近的区域。
2. 在项目的 **Connect** 或 **Settings → API** 页面复制：
   - Project URL
   - Publishable key（旧项目界面可能显示为 `anon` key）
3. 不要把 `service_role` key 放进网站、GitHub Actions variables 或任何 `VITE_` 环境变量。前端只需要 publishable key。

## 2. 关闭公开注册并创建管理员

1. 打开 **Authentication → Sign In / Providers**，关闭 **Allow new users to sign up**。保留 Email provider / Email-Password 登录；关闭此开关后，已有用户仍可登录。
2. 打开 **Authentication → Users**，通过 **Add user** 创建管理员邮箱和密码；如有“自动确认邮箱”选项，可在确认这是你的邮箱后启用。
3. 在用户列表中复制该管理员的 **User UID**。数据库会用这个 UID 判断谁可以保存。

若以后要换管理员，不要开放注册。先在 Dashboard 创建新用户、复制新 UID，再在 SQL Editor 执行：

```sql
update public.research_vault
set owner_id = 'NEW_ADMIN_USER_UID'::uuid,
    revision = revision + 1
where id = 'primary';
```

## 3. 建表并启用 RLS

在 Supabase 的 **SQL Editor** 新建查询，完整粘贴并执行：

[`supabase/migrations/20260725_research_vault.sql`](../supabase/migrations/20260725_research_vault.sql)

迁移会创建一个只能包含 `id = 'primary'` 的单行表，并设置：

- `anon` / 未登录访问者：只能读取加密 `payload`；
- 已登录用户：也只能读取密文；
- `owner_id` 对应的用户：可以更新 `payload`、`revision` 和 `updated_at`；
- 任何前端用户：都不能新增、删除记录或修改所有者；
- 每次更新时 `revision` 必须恰好加 1，用于防止两个浏览器互相覆盖。
- 每次保存成功后，数据库会自动把更新前的加密 `payload` 写入 `research_vault_versions`；
- 历史表只保留最近 50 个旧版本，只有当前 `owner_id` 对应的已登录用户可以读取，前端不能新增、修改或删除历史记录。

## 4. 导入现有加密数据

打开本仓库的 `public/research/progress.enc.json`，复制文件的**完整 JSON 内容**。在 Supabase SQL Editor 执行下面的初始化语句，并替换两个占位值：

```sql
insert into public.research_vault (id, owner_id, payload)
values (
  'primary',
  'YOUR_ADMIN_USER_UID'::uuid,
  $payload$
  PASTE_THE_COMPLETE_progress.enc.json_HERE
  $payload$::jsonb
);
```

这条语句只用于首次初始化。如果提示主键 `primary` 已存在，说明数据已经导入，不要重复插入。可以在 **Table Editor → research_vault** 检查是否只有一行，并确认 `revision` 为 `1`。

`payload` 必须是原始加密 JSON；不要导入 `.private/research/progress.local.json`，也不要把 Vault 密码写进 Supabase。

## 5. 本地配置

在仓库根目录创建 `.env.local`（不要提交）：

```dotenv
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
```

然后启动本地页面。管理员入口为 `/research/admin`；公开入口仍为 `/research`。

首次使用管理页时：

1. 在 `/research/admin` 填写管理员邮箱。若邀请已过期、尚未设置过密码或忘记密码，点击“首次设置或忘记管理员密码”；
2. 只打开最新一封重设邮件。回到管理页后，应看到两个输入框：“新管理员登录密码”和“再次输入新管理员登录密码”；
3. 保存管理员密码后，再输入原有的 Research Vault 内容访问密码，在本地解密；
4. 修改内容并保存；
5. 打开 `/research`，用 Vault 内容访问密码重新解锁，确认公开页显示新版本。

这里有三项容易混淆：

- 用 GitHub 登录 **Supabase Dashboard** 的账号，只用于管理 Supabase 项目，不会自动登录网站管理页；
- “网站管理员密码”用于登录 `/research/admin`，可通过邮件重设；
- “Research Vault 内容访问密码”用于解密 Research 内容，是原 Research 页面一直使用的另一套密码，Supabase 不会保存或重设它。

邀请和重设链接都可能过期。过期后不要继续尝试旧邮件，直接在管理页发送新的重设邮件即可。不要删除并重建现有管理员用户，因为 `research_vault.owner_id` 绑定的是该用户的 UID。

如果保存时提示版本冲突，说明另一窗口已经保存过。先导出当前草稿，再重新载入最新版本进行合并；不要强行覆盖。

## 6. 配置 GitHub Actions variables

`VITE_` 变量会在构建时写入前端包，因此 GitHub Pages 的构建任务也必须收到它们。

在 GitHub 仓库打开 **Settings → Secrets and variables → Actions → Variables**，添加两个 Repository variables：

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

这两个值本来就会发送到浏览器，不属于服务端秘密；不要在此添加 `service_role` key。

确认 `.github/workflows/deploy.yml` 和 `.github/workflows/build.yml` 的 Build 步骤包含：

```yaml
- name: Build
  run: npm run build
  env:
    VITE_SUPABASE_URL: ${{ vars.VITE_SUPABASE_URL }}
    VITE_SUPABASE_PUBLISHABLE_KEY: ${{ vars.VITE_SUPABASE_PUBLISHABLE_KEY }}
```

推送到 `main` 后，在 Actions 中确认 Build 和 Deploy 均成功，再访问线上 `/research/admin` 验证登录与保存。

## 7. 自动历史版本与恢复

每次管理页保存时，迁移中的数据库触发器会先完成当前版本更新，再在同一个事务中保存更新前的密文。`research_vault` 始终是当前版本，`research_vault_versions` 保存最近 50 个旧版本；当前版本不计入这 50 个历史快照。

历史记录仍然只有加密 `payload`，不会保存 Vault 密码或明文。普通访客和未登录用户看不到历史；已登录但不是当前所有者的用户也看不到。前端账号只有 `SELECT` 权限，不能自行插入、修改或删除历史记录，清理最旧快照由数据库触发器自动完成。

需要检查历史时，可在 Supabase **SQL Editor** 中执行：

```sql
select revision, archived_at, payload
from public.research_vault_versions
where vault_id = 'primary'
order by revision desc
limit 50;
```

需要恢复某个旧版本时，先确认目标 `revision`，然后在 **SQL Editor** 中执行下面的语句并替换 `REVISION_TO_RESTORE`：

```sql
with target as (
  select payload
  from public.research_vault_versions
  where vault_id = 'primary'
    and revision = REVISION_TO_RESTORE
)
update public.research_vault as vault
set payload = target.payload,
    revision = vault.revision + 1
from target
where vault.id = 'primary';
```

恢复会生成一个新的当前版本，并自动把恢复前的当前密文放回历史表，因此不会直接覆盖掉最后一份内容。恢复后到 `/research` 用原 Vault 密码解锁并核对；如果旧版本使用的是另一套 Vault 密码，需要用该旧密码解锁。

## 8. 安全与恢复检查

- publishable key 可以公开；安全边界由 Supabase RLS 提供。
- Vault 密码只应在浏览器内用于 PBKDF2/AES-GCM，不应传给 Supabase。
- Supabase 中只有密文。拿到公开 `payload` 的人仍需 Vault 密码才能读取内容。
- `public/research/progress.enc.json` 可继续作为迁移期只读回退，但在线保存后的新内容以 Supabase 为准。
- 定期从管理页导出加密备份；明文备份只能放在 `.private/` 等不会提交的位置。
- 自动历史只覆盖最近 50 次成功保存，不能替代定期导出的离线加密备份。
- 更换管理员或修改策略时，重新检查匿名用户只能执行 `SELECT`，不能 `INSERT`、`UPDATE` 或 `DELETE`。

相关官方说明：[React Auth quickstart](https://supabase.com/docs/guides/auth/quickstarts/react)、[Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)、[列级权限](https://supabase.com/docs/guides/database/postgres/column-level-security)、[Auth 配置](https://supabase.com/docs/guides/auth/general-configuration)。
