import { mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { expect, it } from "vitest";
import { build } from "../scripts/build.mjs";
import { loadPackage, scratch } from "./pi.js";

const ROOT = resolve(fileURLToPath(new URL("..", import.meta.url)));
const ASSISTANT = [
  "You are cx, a seller's assistant on ComChatX.",
  "You work out what to do and do it with the tools and skills you have, and give your reasons when the seller asks for them.",
  "What you can offer a seller is what those tools and skills let you do.",
].join(" ");

it("the pinned pi loads the extension from the built dist/ and its one section joins the prompt's options, forcing nothing", async () => {
  expect(build(ROOT)).toEqual([join(ROOT, "dist", "extensions", "assistant.js")]);
  const { extensions, errors, runner } = await loadPackage(ROOT);
  expect(errors).toEqual([]);
  expect(extensions.map((extension) => extension.path)).toEqual([join(ROOT, "dist", "extensions", "assistant.js")]);
  expect(extensions.map((extension) => [...extension.handlers.keys()])).toEqual([["before_agent_start"]]);
  const { systemPromptOptions } = await runner.emitBeforeAgentStart({ messageType: "user", prompt: "Hello" }, { cwd: "/project" });
  expect(systemPromptOptions.sections).toMatchObject({ assistant: ASSISTANT });
  expect(systemPromptOptions.forceSystemPrompt).toBeUndefined();
});

it("the build refuses a test under src/extensions/, which pi would load as an extension", () => {
  const root = scratch();
  mkdirSync(join(root, "src", "extensions"), { recursive: true });
  writeFileSync(join(root, "src", "extensions", "assistant.ts"), "export default () => {};\n");
  writeFileSync(join(root, "src", "extensions", "assistant.test.ts"), "export {};\n");
  expect(() => build(root)).toThrow("src/extensions/assistant.test.ts is not an extension; tests live under test/");
});
