import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { expect, it } from "vitest";
import assistant, { ASSISTANT as SHIPPED, SECTION as SHIPPED_SECTION } from "../src/extensions/assistant.js";

// The ruled words, written here and not read from the extension: a change to either is a change to this file.
const SECTION = "assistant";
const SENTENCES = [
  "You are cx, a seller's assistant on ComChatX.",
  "You work out what to do and do it with the tools and skills you have, and give your reasons when the seller asks for them.",
  "When you propose something, give one line of reason and its source; give the whole analysis only when the seller asks, name a file by its title and never by its path, and never paste a report into the conversation.",
  "What you can offer a seller is what those tools and skills let you do.",
];
const ASSISTANT = SENTENCES.join(" ");

it("the extension registers one handler, which sets the section on pi's options and returns nothing, so pi keeps its transcript delta", () => {
  const handlers: [string, (event: { systemPromptOptions: { sections: Record<string, string> } }) => unknown][] = [];
  assistant({ on: (name: string, handler: never) => handlers.push([name, handler]) } as unknown as ExtensionAPI);
  expect(handlers.map(([name]) => name)).toEqual(["before_agent_start"]);
  const event = { systemPromptOptions: { sections: { other: "kept" } } };
  expect(handlers[0]![1](event)).toBeUndefined();
  expect(event.systemPromptOptions.sections).toEqual({ other: "kept", [SECTION]: ASSISTANT });
});

it("the section is the four sentences of who cx is, naming no tool, source, command or marketplace", () => {
  expect(SHIPPED.split(/(?<=\.) /)).toEqual(SENTENCES);
  expect(SHIPPED_SECTION).toBe(SECTION);
  const words = ASSISTANT.toLowerCase().match(/[a-z0-9-]+/g)!;
  // pi's own tools, the data sources ComChatX offers and their suppliers, and the marketplace.
  for (const named of ["read", "bash", "edit", "write", "cx-keepa", "keepa", "cx-amazon-sp-api", "amazon"]) expect(words, `the section names ${named}`).not.toContain(named);
  for (const named of ["cx get", "cx estimate", "cx raw", "pi install", "/tenant", "`"]) expect(ASSISTANT, `the section names ${named}`).not.toContain(named);
});
