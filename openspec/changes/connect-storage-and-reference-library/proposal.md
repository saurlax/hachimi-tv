# Proposal

## Why

项目的登录、参考素材和存储仍是占位交互，已采集的人物资料仅保存在本地。需要接入真实会话与 COS 存储，使公共人物资料可复用、个人素材可持续保存。

## What Changes

- 使用 Better Auth 接入邮箱密码注册、登录、退出和持久会话。
- 使用 S3 兼容接口连接目标广州 COS 桶；后端签发对象范围的 STS，浏览器直传并在完成后核验登记。
- 将七位角色的 37 张图片、来源和模型线索作为平台内置素材随代码分发，素材库入口接入平台；用户上传仍使用 COS。
- 提供人物详情、多角度与画风分组、模型来源链接、个人素材上传与选择参考操作。
- 保存直传、CDN 和主流生成平台素材组织的调研依据。

## Capabilities

### New Capabilities

- `user-auth`: 邮箱密码账号及服务端会话授权。
- `object-storage`: S3 兼容存储、对象级临时上传授权、完成确认和访问 URL。
- `reference-library`: 公共人物、参考素材、来源与模型索引，以及个人素材库。

### Modified Capabilities

无。

## Impact

涉及登录页、侧栏、参考素材页、创作表单与新 API；新增 Better Auth、AWS S3 SDK、STS SDK。账号及素材元数据使用当前 Node.js 内置 SQLite，部署需要持久磁盘；用户文件存储于 COS，内置文件位于 public/materials/builtin/。现有生成服务不在本次接入范围内，CDN 域名尚未提供，不伪造加速状态，不增加 MMD 播放器。
