# 存储、认证与素材库

## 本地启动与部署

运行环境需要 Node.js 22.16 及以上。本项目当前使用 Node.js 26 的内置 SQLite，账号、会话和个人素材元数据位于 `HACHIMI_DATA_DIR/hachimi.sqlite`。部署必须提供持久磁盘；当前不适用于实例文件系统会丢失的无服务器部署或多实例写入。

从 `.env.example` 配置项目专属的 `.env.local`，生成独立的 `BETTER_AUTH_SECRET`。不得提交密钥。`BETTER_AUTH_URL` 应与实际站点地址一致。认证通过 Better Auth 实现邮箱密码注册、登录和退出；未配置邮件投递，不声称验证邮箱归属或支持密码找回。

```sh
pnpm install
pnpm db:migrate
pnpm dev
```

目标桶为 `hachimi-1256065269`，地域 `ap-guangzhou`。项目环境中的凭据已实际完成对象 PUT/GET；桶级 HEAD、CORS 及 ACL 查询返回 403。2026-11-08 复用本机 tccli 缓存的管理凭据，成功读取、配置并回读该桶 CORS；管理凭据未复制进项目环境。

## 上传与访问

采用后端授权、浏览器 STS 直传。长期密钥只在服务端；用户对象按用户 ID 和上传 UUID 分配，临时权限仅覆盖本次对象的 PUT 与必要分片动作。完成接口检查当前身份、对象存在性和字节数，再登记为 ready，不将 HEAD 大小或分片 ETag 称为内容散列校验。

对象身份以 key 保存，不保存短期 URL。未提供媒体 CDN 域名，因此本次返回短期 COS 签名 GET URL，不宣称已启用 CDN。未来媒体 CDN 直接回源 COS，客户端播放地址采用 CDN 鉴权；COS STS 与 CDN 鉴权分别配置，不能仅替换签名 URL 的域名。

COS 浏览器直传需要实际应用来源的 CORS 配置，以及 PUT、POST、GET、HEAD 和请求签名头，暴露 ETag 用于分片完成。CORS 只解决浏览器协议访问，不替代会话或对象权限。

已配置规则 `hachimi-local-direct-transfer`：来源为 `http://localhost:3000` 和 `http://127.0.0.1:3000`，方法为 GET、HEAD、PUT、POST、DELETE，允许请求头 `*`，暴露 ETag、Content-Length、Content-Range、Accept-Ranges、Last-Modified 和 x-cos-request-id，预检缓存 600 秒。两个来源的五种方法共 10 次 OPTIONS 预检均返回 200，并包含对应来源和暴露头。变更前后配置保存在忽略目录 `.local/hachimi-cors-before.json` 与 `.local/hachimi-cors-after.json`。

## 素材组织

首批七位人物、37 张角色图片现作为内置素材随代码分发，图片位于 `public/materials/builtin/`，索引位于 `references/characters/catalog.json`。这 37 张文件复制时均通过 SHA-256 核验；角色库提供名称及别名搜索、原版和可爱画风、模型来源入口和创作参考选择，不需要 COS 或登录。个人资产已接入上传、文件夹、搜索、下载、删除和创作参考选择。

内置人物与个人素材分开。人物是稳定实体，一位人物聚合多套服装、画风、多视角图片和备用模型；每份资料保留来源、尺寸、指纹、视角、画风及使用条件，缺少三视图时保留缺失状态。模型仅收录已经找到的配布链接，不伪造本地模型或 MMD 播放能力。

用户将采集资料指定为公共素材；库的公开可见状态与各来源的使用条款分别记录，不因公开可见便推断具有商用、再分发或 AI 训练许可。

## 调研依据

调研日期：2026-11-08。

- [Kling Element Library](https://kling.ai/quickstart/klingai-element-library-3-user-guide)：同一个元素可聚合多个角度的参考图。借鉴人物聚合多图的结构，不照搬特定模型的张数限制。
- [Runway reference media](https://help.runwayml.com/hc/en-us/articles/52963720640275-Using-reference-media-to-guide-your-generations)：参考素材可持久保存并在生成中复用，支持人物、场景、风格等。借鉴素材身份与单次生成任务分离。
- [Adobe Firefly](https://helpx.adobe.com/firefly/web/unified-generation-and-editing-experience/generate-and-edit-content.html)：参考图和首尾帧承担不同生成角色。第一版记录参考身份，后续接入生成接口时再增加具体输入角色。
- [COS STS 指引](https://cloud.tencent.com/document/product/436/14048)：浏览器拿临时凭据后直接传文件。
- [COS 网络加速](https://cloud.tencent.com/document/product/436/116372)：全球加速优化上传下载线路，与 CDN 缓存分发不同。
- [COS 预签名上传](https://cloud.tencent.com/document/product/436/14114)：COS 签名不能直接替换为 CDN 域名。
- [COS CDN 访问](https://intl.cloud.tencent.com/zh/document/product/436/18669)：私有源站回源鉴权与用户侧 CDN 鉴权分别配置。
- [CDN 缓存键](https://cloud.tencent.com.cn/document/product/228/47671)：鉴权通过后将不影响内容的签名参数排除出缓存键，保留真正影响版本或处理结果的参数。
- [Mux Direct Upload](https://www.mux.com/docs/guides/upload-files-directly)、[Cloudflare Stream](https://developers.cloudflare.com/stream/uploading-videos/direct-creator-uploads/)：专业视频服务也采用客户端直传，授权可表现为上传 URL，并不都直接暴露 STS。

## 本次范围

不接入视频生成、转码、审核、MMD 播放或 CDN 云配置。当前采集图片和模型线索见 `references/characters/`，内置素材直接通过应用静态路径加载，不需要云端导入；个人资产已接入 STS 直传。

## 导航归属

角色与资产位于主导航，角色只承载人物图库；资产为独立个人云盘。我的空间仅保留我的作品和我的收藏。

## 个人云盘与容量

每人默认 10GB（10,000,000,000 字节），对象前缀为 `users/<userId>/assets/`，文件夹及文件名存于 SQLite 索引。内置角色不占个人容量，`asset_quota.limit_bytes` 保存账号配额。

上传在 SQLite 事务中预留容量，已用与有效预留之和不得超额。STS 有效期 15 分钟，仅覆盖本次对象；普通上传限制 Content-Length 并要求禁止覆盖。大于 32MiB 的文件使用 16MiB 分片，由服务端初始化、核对分片并合并；完成登记幂等，HEAD 大小不符不入库。

取消或删除后，仍有效的写入凭据对应容量保留至到期；该用户后续访问云盘时清理到期临时对象与未完成分片。此处是应用逻辑配额，不是 COS 前缀物理硬配额。

| 接口 | 行为 |
| --- | --- |
| GET /api/assets?folderId=&q= | 文件、文件夹、路径和容量 |
| POST /api/assets | filename、size、contentType、folderId，预留并获取上传凭据 |
| GET /api/assets/:id/upload | 续签该上传凭据 |
| POST /api/assets/:id/upload | 核验并登记上传 |
| GET /api/assets/:id | 元数据和 15 分钟下载链接 |
| DELETE /api/assets/:id | 删除文件或取消上传 |
| POST /api/folders | name、parentId，创建文件夹 |

所有接口从服务端会话确定用户并验证对象归属。后续创作 agent 可调用 `readAsset(userId, assetId)` 读取所属用户 ready 文件流；资产 ID 是持久身份，临时 URL 不作为任务身份。当前已提供读取函数，生成 agent 尚未接入。

2026-11-09 已验证注册、错误密码拒绝、退出失效、默认容量、匿名与跨用户拒绝、文件夹隔离、33MiB 分片上传与 SHA-256 回读一致、重复完成、并发超额、COS 拒绝超预留大小、取消及到期清理、删除释放。浏览器验证真实登录、图片直传和创作参考选择。
