# hachimi.tv

## 产品与范围

- 产品为哈基米小马的视频与音乐生成平台：用户提供参考素材和创作描述，生成、管理并分享自己的作品。导航围绕创作、发现、搜索、我的作品、参考素材和收藏组织。
- 区分产品目标与实际实现。当前以界面和本地交互为主，认证、素材存储和生成服务尚未接通。修改前核实实际调用路径，不将占位、模拟反馈或本地文件选择描述为真实上传、生成或保存。
- 不自行增加积分、套餐、排行榜、任务奖励、社交系统或其他无关流程。常规实现选择直接完成，架构不确定性会造成实质返工时再澄清。

## 技术与组织

- 使用 Next.js App Router、React、TypeScript、Tailwind CSS v4 与 shadcn/ui，包管理器遵循 `package.json` 的 `packageManager`，依赖和 `pnpm-lock.yaml` 同步维护。
- 路由与布局位于 `app/`，业务组件位于 `components/`，shadcn 基础组件位于 `components/ui/`，通用 Hook 位于 `hooks/`。项目不使用 Supabase。先读相关代码和 `components.json`，沿用现有职责与配置。
- shadcn 使用 `radix-nova`、Radix UI 与 Lucide 图标；优先复用现有组件、变体和主题变量，不重新引入 HeroUI 或并行维护另一套组件系统。业务专属样式留在业务组件，不随意改基础组件影响所有页面。
- 不添加无必要的依赖、抽象或测试框架。不提前构造通用生成引擎、仓储层、任务调度系统或多供应商兼容层。
- 查询库、框架、SDK、API、CLI 或云服务用法时，先用 Context7 `resolve-library-id`，再 `query-docs`；优先官方资料。写 Next.js 相关代码前同时阅读本地 `node_modules/next/dist/docs/` 的对应文档。

## 视觉与组件

- 保持 shadcn 的组件结构、交互和一致性。使用官网 block 时先读取原版，明确哪些部分沿用、哪些部分改造，不将只使用少量组件称为完整还原。
- 当前视觉方向为蜂蜜黄主色、奶油白底与暖色氛围，红白蓝斜条纹作为少量装饰，可借鉴赛马娘的活力和赛场元素。品牌为猫图标与 `hachimi.tv`，不显示版本号或无意义的版本切换。
- 颜色优先通过 `app/globals.css` 中的语义主题变量维护，避免页面各自覆盖同一套按钮、卡片、输入框。装饰不得影响可读性、焦点反馈和移动端布局；动画尊重减少动态效果的系统偏好。
- 保持字体默认字间距，不使用 `tracking-*`、`letter-spacing` 或插空格模拟字距。不要用大量英文口号、编号、装饰标签填充界面。
- 搜索图片与角色素材可用于研究配色和构图；实际引入素材时核实来源与使用条件，不把参考图或未核实资产当作已获许可的发布素材。

## 界面文案与 desc

- 禁止使用中点符号（Unicode U+00B7）作为文案或分隔符，适用于界面、文档和回复。页面标题统一使用 `hachimi.tv | 页面名称或简短主题` 格式。
- 界面首先依靠清楚的名称、布局和操作反馈表达用途。不要默认给每个页面、区块、卡片或表单附加说明段落、副标题、提示卡或 desc。
- 谨慎使用 `description`、`CardDescription`、`FieldDescription`、`FormDescription`、Tooltip、Alert 等说明组件。仅在用户完成操作或作出决策确实需要时添加；这是对界面说明文案的约束，不是禁止 SEO metadata、数据字段或第三方 API 中必要的同名属性。
- 标签能表达清楚就只保留标签。占位文本不重复标签，副标题不复述标题，卡片不为了凑布局添加描述。同一条限制或说明只在所属位置写一次。
- 必要说明聚焦格式要求、操作后果、进度或错误恢复，放在对应操作附近。不要在产品界面铺陈内部实现、开发状态或为界面设计辩解的文字。
- 未接入的能力不能伪装成功：优先隐藏或禁用尚不可用的操作；演示确需保留入口时给出一处简短、准确的反馈，不到处写“尚未接入”“即将上线”。技术边界和未完成项写在交付说明中。

## 实现与验证

- 先阅读相关代码、规范与现有验证，确认执行路径和职责归属，再修改。修复在责任模块完成，同步受影响的调用方，不为假想场景扩展范围。
- 内部遵循明确的类型和调用契约，不堆叠重复判空、宽泛异常捕获、静默兜底、无依据的重试或兼容层。外部输入、上传、认证授权与数据完整性所需校验集中放在实际边界。
- 不增加无用围栏、重复确认或流程门槛。测试与改动风险相称，不添加一次性测试、实现细节镜像测试、文案清单测试或仅为覆盖率存在的测试。
- 代码改动按影响运行 `pnpm lint`、`pnpm exec tsc --noEmit`、`pnpm build`。界面和交互改动在浏览器检查实际效果、关键路径与必要的窄屏布局；检查通过后不无故重复扩大验证。
- 文档与格式修改只核对内容、引用、差异和文件清单，不为此运行完整构建。交付如实说明实际完成、实际执行的检查和必要限制，不将设计目标写成完成状态。

## 凭据与仓库维护

- 调用需认证的服务前，优先复用目标项目、账号和环境对应的有效缓存；核对作用域、环境与过期时间，不因缓存存在就判定有效，不跨项目或环境混用凭据。
- 临时 token 过期时优先通过官方方式静默续期，只更新目标项目缓存；不自动打开网页登录或覆盖共享凭据。缓存与静默续期均不可用时再说明原因并请求授权。
- 不在聊天、日志、截图、报告或提交中暴露 token、API Key、Secret 或环境文件内容。浏览器可见配置视为公开信息；服务端密钥不得进入客户端。
- 不提交依赖目录、构建产物、密钥或一次性截图、报告和脚本。临时材料使用仓库外的任务目录或已忽略的本地目录。
- 修改文档时与实际实现保持一致，不照搬其他仓库的目录、部署方案和分支策略。日常修复或规范更新不顺带改 README；产品介绍与开发、部署说明分别维护。
- 不覆盖用户未提交的修改。提交前检查 diff、status 与暂存清单，只按明确路径暂存当前任务；创建分支默认使用 `codex/` 前缀，提交使用英文 Conventional Commits，推送与发布按用户授权执行。
- 交流与文档使用中文，代码标识符、文件名和提交信息使用英文。回复先写结论，再给依据，删除重复免责声明、过度限定和假想误解的解释。

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
