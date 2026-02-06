export function parseDuration(duration: string) {
	const match = duration.trim().match(/^(\d+)\s*(s|m|h|d)$/i);
	if (!match) return null;
	if (match[1] === undefined || match[2] === undefined) return null;
	const value = Number(match[1]);
	const unit = match[2].toLowerCase();

	const multipliers: Record<string, number> = {
		s: 1_000,
		m: 60_000,
		h: 3_600_000,
		d: 86_400_000,
	};

	return value * (multipliers[unit] as number);
}
