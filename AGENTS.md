# hachimi.tv

## Product and Scope

- The product is a platform for creating Hachimi music, music videos (MVs), and videos, rooted in Hachimi and Uma Musume meme and fan creation culture. Users create, manage, and share works using reference materials and creative prompts. Primary navigation is ordered as creation, discovery, characters, and assets. Search belongs within discovery and has no separate navigation entry. My space contains my works and my favorites.
- Music, MV, and video creation are the current core scope. MMD playback and related capabilities may be explored later. MMD is a possible future direction, with no implementation commitment; do not add related entry points, dependencies, or architecture in advance.
- Distinguish product goals from implemented behavior. The platform includes a built-in character library with seven characters and 37 bundled images. Email/password authentication and a personal COS drive with a default 10GB quota are connected; generation services are not connected. Verify actual execution paths before making changes. Do not describe placeholders, simulated feedback, or local file selection as real uploads, generation, or persistence.
- Do not introduce credits, plans, leaderboards, task rewards, social systems, or unrelated flows. Make routine implementation decisions directly; clarify architectural uncertainty only when it could cause substantial rework.

## Technology and Organization

- Use Next.js App Router, React, TypeScript, Tailwind CSS v4, and shadcn/ui. Follow the `packageManager` field in `package.json` and keep dependencies synchronized with `pnpm-lock.yaml`.
- Routes and layouts belong in `app/`, business components in `components/`, shadcn primitives in `components/ui/`, and shared hooks in `hooks/`. The project does not use Supabase. Read relevant code and `components.json` first, and follow existing responsibilities and configuration.
- shadcn uses `radix-nova`, Radix UI, and Lucide icons. Reuse existing components, variants, and theme variables. Do not reintroduce HeroUI or maintain a parallel component system. Keep business-specific styles in business components; avoid changing primitives in ways that affect every page.
- Do not add unnecessary dependencies, abstractions, or test frameworks. Do not build generic generation engines, repository layers, task schedulers, or compatibility layers for multiple providers in advance.
- For library, framework, SDK, API, CLI, or cloud service usage, read current official documentation, repositories, and protocol specifications. Before writing Next.js code, also read the relevant local documentation under `node_modules/next/dist/docs/`.

## Visuals and Components

- Preserve shadcn component structure, interactions, and consistency. When using an official block, read the original first and identify what is reused and what is adapted. Do not claim a complete reproduction when only a few components are used.
- The visual direction uses honey yellow, cream backgrounds, and a warm atmosphere, with occasional red, white, and blue diagonal stripes. Draw inspiration from the energy and racing elements of Uma Musume. The brand uses a cat icon with the localized name: `基米TV` for Simplified and Traditional Chinese, `Hachimi TV` for English, and `ハチミーTV` for Japanese. Keep `hachimi.tv` as the domain; do not display version numbers or meaningless version switching.
- Maintain colors through semantic theme variables in `app/globals.css` instead of overriding the same buttons, cards, and inputs on individual pages. Decoration must preserve readability, focus feedback, and mobile layouts. Respect the system preference for reduced motion.
- Animations can be rich and lively. Use bouncing, subtle swaying, staggered entrances, and similar effects for hover, clicks, transitions, entrances, and creation feedback to convey the rhythm of Hachimi and Uma Musume fan creations. Avoid persistent reading distractions or blocking interactions.
- Keep default font spacing. Do not use `tracking-*`, `letter-spacing`, or inserted spaces to simulate letter spacing. Do not fill the interface with English slogans, numbering, or decorative labels.
- Image and character searches may inform color and composition research. Verify sources and usage terms before incorporating assets; reference images and unverified assets are not licensed release materials.

## UI Copy and Descriptions

- Support English, Simplified Chinese, Traditional Chinese, and Japanese through the shared messages in `lib/i18n.ts`. Default to browser language preferences and the system color scheme; preserve explicit user overrides. Keep navigation and state identifiers independent of translated labels.
- Do not use the middle dot character (Unicode U+00B7) in copy or as a separator, including UI, documentation, and responses. Use the page title format `<localized brand> | <localized page name or short topic>`.
- Communicate purpose through clear names, layout, and interaction feedback. Do not add descriptions, explanatory paragraphs, subtitles, or hint cards by default, or attach explanations to every page, section, card, and form.
- Use `description`, `CardDescription`, `FieldDescription`, `FormDescription`, Tooltip, Alert, and similar explanatory components only when users need them to complete an action or make a decision. This rule concerns UI explanations, not necessary SEO metadata, data fields, or third-party API properties with the same names.
- Use a label alone when it is sufficient. Placeholders must not repeat labels, subtitles must not restate titles, and cards must not include descriptions merely to fill space. State each restriction or explanation once, at its relevant location.
- Do not pile on hints, tutorials, or examples. Do not add sample prompts, sample content, instructions, or guidance such as "You can..." by default. Add only the minimum information needed when users would otherwise be unable to complete the current action.
- Necessary explanations should cover format requirements, action consequences, progress, or error recovery, near the relevant action. Do not fill the product UI with implementation details, development status, or justifications for the design.
- Unconnected capabilities must not pretend to succeed. Prefer hiding or disabling unavailable actions. If a demo needs an entry point, provide one brief, accurate response instead of repeating "not connected" or "coming soon" throughout the UI. Report technical boundaries and unfinished work in delivery notes.

## Implementation and Verification

- Read relevant code, specifications, and existing checks before editing. Establish execution paths and module responsibilities. Fix issues in the responsible module and update affected callers without expanding scope for hypothetical scenarios.
- Avoid defensive programming without a concrete basis. Follow explicit internal types and contracts instead of stacking duplicate null checks, broad exception handling, silent fallbacks, unjustified retries, or compatibility layers. Centralize necessary validation for external input, uploads, authentication, authorization, and data integrity at actual boundaries.
- Without a concrete requirement or demonstrated risk, do not introduce allowlists, origin or cross-origin checks, file type or size restrictions, usage limits, or other access barriers. Implement necessary validation only at the boundary responsible for that constraint, rather than scattering the same check across layers.
- Do not add unnecessary guardrails, repeated confirmations, or workflow barriers. Keep testing proportional to the change. Do not add throwaway tests, tests that mirror implementation details, copy checklist tests, or tests that exist solely for coverage.
- For code changes, run `pnpm lint`, `pnpm exec tsc --noEmit`, and `pnpm build` as appropriate to the impact. Check UI and interaction changes in a browser, including actual appearance, key paths, and necessary narrow-screen layouts. Do not repeat or broaden verification without a reason after checks pass.
- For documentation and formatting changes, verify content, references, diffs, and the changed file list without running a full build. Report actual work, checks performed, and necessary limitations accurately; do not present design goals as completed behavior.

## Credentials and Repository Maintenance

- Before calling authenticated services, reuse valid cached credentials for the target project, account, and environment. Verify scope, environment, and expiration; the existence of a cache alone does not establish validity. Never mix credentials across projects or environments.
- When a temporary token expires, prefer silent renewal through officially supported methods and update only the target project's cache. Do not automatically open browser login or overwrite shared credentials. Request authorization only after confirming that cached credentials and silent renewal are unavailable, explaining the specific reason.
- Never expose tokens, API keys, secrets, or environment file contents in chat, logs, screenshots, reports, or commits. Treat browser-visible configuration as public; server secrets must never reach the client.
- Do not commit dependency directories, build outputs, secrets, or temporary screenshots, reports, and scripts. Store temporary materials outside the repository or in an ignored local directory.
- Keep documentation aligned with the actual implementation. Do not copy directory structures, deployment plans, or branching policies from other repositories. Do not update the README incidentally during routine fixes or guideline updates. Maintain product introductions separately from development and deployment instructions.
- Preserve the user's uncommitted changes. Before committing, inspect the diff, status, and staged file list, and stage only explicit paths for the current task. Use the `codex/` branch prefix by default. All commits must follow Conventional Commits with English messages, using a type such as `feat`, `fix`, or `docs` and an optional scope. Push and publish only as authorized by the user.
- Use English in `AGENTS.md` and `README.md`. Keep conversations and other documentation in Chinese unless requested otherwise. Use English for code identifiers, filenames, and commit messages. Lead responses with the conclusion, then the evidence. Remove repeated disclaimers, excessive qualifications, and explanations of hypothetical misunderstandings.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Built-in Materials

- Ship built-in images in `public/materials/builtin/` and retain character identities, source links, hashes, and rights metadata in `references/characters/catalog.json`. Built-in browsing must not depend on COS, login, signed URLs, or an extra local server.
- Keep built-in materials separate from user uploads. Model entries link to distribution pages; model binaries and MMD playback are not included.
