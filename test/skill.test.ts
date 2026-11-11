import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { DefaultResourceLoader, SettingsManager } from "@earendil-works/pi-coding-agent";
import { expect, it } from "vitest";
import { scratch } from "./pi.js";

const ROOT = resolve(fileURLToPath(new URL("..", import.meta.url)));
const FILE = join(ROOT, "skills", "comchatx-plugins", "SKILL.md");
const body = (): string => readFileSync(FILE, "utf8").replace(/^---\n[\s\S]*?\n---\n/, "");

it("the pinned pi lists the one skill, comchatx-plugins, with its description and nothing it could not read", async () => {
  const home = scratch();
  const agentDir = join(home, "agent");
  const cwd = join(home, "project");
  for (const directory of [agentDir, cwd]) mkdirSync(directory);
  writeFileSync(join(agentDir, "settings.json"), JSON.stringify({ defaultProjectTrust: "always", packages: [ROOT] }));
  const loader = new DefaultResourceLoader({ cwd, agentDir, settingsManager: SettingsManager.create(cwd, agentDir) });
  await loader.reload();
  const { skills, diagnostics } = loader.getSkills();
  expect(diagnostics).toEqual([]);
  expect(skills.map((skill) => skill.name)).toEqual(["comchatx-plugins"]);
  expect(skills[0]!.description).toContain("no tool or skill here does");
});

it("the skill's body is at most 371 words and copies no plugin's name", () => {
  const text = body();
  expect(text.split(/\s+/).filter(Boolean).length).toBeLessThanOrEqual(371);
  // A plugin is named by the list at the time it is read, never here: `cx-` alone, as the prefix, is the only spelling allowed.
  expect(text.match(/cx-[a-z0-9]/g) ?? []).toEqual([]);
  expect(text).toContain("https://registry.npmjs.org/-/org/comchatx/package");
});
