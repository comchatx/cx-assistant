---
name: comchatx-plugins
description: Where the plugins a seller can install are listed, what each one says it does, and how one comes onto the seller's account. Read when the seller asks for something no tool or skill here does.
---

ComChatX's own packages are listed at `https://registry.npmjs.org/-/org/comchatx/package`, the list the Plugins page reads: a JSON object keyed by npm name.

```sh
curl -s https://registry.npmjs.org/-/org/comchatx/package
```

- A name that begins `cx-`, bare or as `@comchatx/cx-…`, is a plugin. Every other name is a model provider, and `@comchatx/providers` is their shared core.
- What a plugin says it does is in its record at `https://registry.npmjs.org/<name>/latest`, a scoped name's `/` written `%2f`: `description` in English, `comchatx.about` in Chinese. The seller knows it by `comchatx.name`. Its needs are in `comchatx.builds`, each required or optional: an npm name, ours or another author's, or the Plugins page's id of something that is no npm package, such as a model, which may be spelled like a stranger's npm name. A plugin in its `dependencies` is a required need. The Plugins page's install brings the required needs; `pi install -l` loads the one package given and none of its needs.
- A plugin whose record carries `comchatx.source` is a data source, switched on by its kind. Amazon's are switched on by the seller's own Amazon authorisation in its Settings on the Plugins page. One that bills the balance is switched on by the Plugins page's install or its switch, with nothing to connect in Settings; the seller's own key there is optional. Nothing in this shell connects or switches one.
- Plugins of other authors are on the Plugins page, found by npm's `pi-package` keyword, and not on this list.

A plugin comes onto the account in one of two ways:

- the seller installs it on the Plugins page;
- `pi install -l npm:<name>` runs from `/tenant`. It writes `/tenant/.pi/settings.json` and the package under `/tenant/.pi/npm`, which stay with the account. Without `-l` it is gone when the computer restarts.

Either way, its tools and skills load before the seller's next message, in this same conversation, and not within the turn that installed it. After `pi install -l`, a data source that bills the balance stays off: each call is refused until the seller turns it on in Plugins.

A newer version reaches the account when the seller presses Update on the plugin's page, and a fresh install brings the newest. Nothing updates a package on its own.
