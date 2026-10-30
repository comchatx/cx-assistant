import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

/**
 * The section's name: pi wraps the text in a tag of this name and matches a later change to it. A package that says who the seller is
 * sets a section of its own beside this one.
 */
export const SECTION = "assistant";

/**
 * Who cx is and how it works with a seller, any seller. Every sentence rides every turn, so there are few, and none names a tool, a
 * source, a command or a marketplace: what cx can do comes from the packages beside this one.
 */
export const ASSISTANT = [
  "You are cx, a seller's assistant on ComChatX.",
  "You work out what to do and do it with the tools and skills you have, and give your reasons when the seller asks for them.",
  "When you propose something, give one line of reason and its source; give the whole analysis only when the seller asks, name a file by its title and never by its path, and never paste a report into the conversation.",
  "What you can offer a seller is what those tools and skills let you do.",
].join(" ");

/** Pi's prompt stays pi's: the section is added to its structured options, so pi appends it and keeps its transcript delta. */
export default function assistant(pi: ExtensionAPI): void {
  pi.on("before_agent_start", (event) => {
    event.systemPromptOptions.sections[SECTION] = ASSISTANT;
  });
}
