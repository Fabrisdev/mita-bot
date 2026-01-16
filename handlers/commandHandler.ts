import fs from "node:fs/promises";
import path from "node:path";
import type { Command } from "../commands/types";

const EXPECTED_EXTENSION = ".command.ts";
const EXPECTED_FOLDERNAME = "commands";

export async function fetchCommands() {
	const commands = new Map<string, Command>();
	const files = await fs.readdir(EXPECTED_FOLDERNAME);
	for (const file of files) {
		if (!file.endsWith(EXPECTED_EXTENSION)) continue;
		const importedFile = await import(
			path.join("..", EXPECTED_FOLDERNAME, file)
		);
		const command = importedFile.default;
		const name = file.slice(0, -EXPECTED_EXTENSION.length);
		commands.set(name, command);
	}
	return commands;
}
