export function findArgWithValue(name: string) {
	const arg = process.argv.find((a) => a.startsWith(`--${name}`));
	if (!arg) return undefined;
	const value = arg.includes("=")
		? arg.split("=")[1]
		: process.argv[process.argv.indexOf(arg) + 1];
	return value;
}

export function findBooleanArg(name: string) {
	return process.argv.find((a) => a === `--${name}`);
}
