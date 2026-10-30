# cx-assistant

A [pi](https://pi.dev) package that tells the model who it is: cx, a seller's assistant on [ComChatX](https://comchatx.com).

It is one extension. Before every run it adds one section, named `assistant`, to pi's own system prompt:

```
<assistant>
You are cx, a seller's assistant on ComChatX. You work out what to do and do it with the tools and skills you have, and give your reasons when the seller asks for them. What you can offer a seller is what those tools and skills let you do.
</assistant>
```

Three sentences, on every request, each with one job: who cx is, a seller's assistant with no marketplace named; that cx works out what to do and does it with the tools it has, giving its reasons when the seller asks; and that what cx offers is what the packages beside it make possible, so it promises nothing none of them can do. The sentences were ruled on 2026-10-08.

The section names no tool, data source, supplier, command or marketplace: what cx can do comes from the packages installed beside this one, and a sentence here that named one would be wrong the day that package is taken off. Who the seller is belongs to another package, [`cx-amazon-seller`](https://github.com/comchatx/cx-amazon-seller), which sets a section named for itself, so the two stand side by side and neither replaces the other. The section is added through pi's structured prompt options, so pi's own sections and any other package's stay as they are and nothing is forced.

Why a section and not a skill: pi reads a skill's body only when it judges the skill relevant, so a new session could greet as a coding assistant before any skill was read. A section is in the prompt from the first message.

## What it needs

Nothing but pi. It reaches no network, reads no file and holds no setting.

## Install

```bash
pi install npm:@comchatx/cx-assistant        # for you, in ~/.pi/agent/settings.json
pi install -l npm:@comchatx/cx-assistant     # for one project, in .pi/settings.json
pi remove npm:@comchatx/cx-assistant
```

On ComChatX a new account starts with it, and a seller can remove it and install it again from the Plugins page.

## Develop

```bash
npm ci
npm run typecheck
npm test               # builds dist/ and loads it with the pinned pi
```

The source is `src/extensions/`; `npm run build` bundles each file there into `dist/extensions/`, the directory the package's `pi` manifest names, leaving pi's own packages for pi to supply. Tests live under `test/`: pi loads every module in an extensions directory, so the build refuses anything there that is not an extension.

- `test/package.test.ts`: the pinned pi loads the built extension, one `before_agent_start` handler, and its section is the four sentences; nothing is forced.
- `test/assistant.test.ts`: the handler sets the section and returns nothing, leaving another section in place; the section is the four sentences exactly and names none of pi's tools, no data source, no `cx` command, no `pi install`, no path and not "amazon".

## Release

A `v<version>` tag publishes the package from `.github/workflows/release.yml` by npm's trusted publishing; the tag must name the version in `package.json`.
