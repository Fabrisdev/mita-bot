import fs from "node:fs/promises";
import path from "node:path";

const EXPECTED_EXTENSION = ".command.ts";
const EXPECTED_FOLDERNAME = "commands";

export async function fetchCommands() {
	const commands = [];
	const files = await fs.readdir(EXPECTED_FOLDERNAME);
	for (const file of files) {
		if (!file.endsWith(EXPECTED_EXTENSION)) continue;
		const importedFile = await import(
			path.join("..", EXPECTED_FOLDERNAME, file)
		);
		const command = importedFile.default;
		commands.push(command);
	}
	return commands;
}
