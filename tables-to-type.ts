export type GuildSettings = {
	guild_id: string;
	alerts_channel_id: string | null;
	birthday_channel_id: string | null;
	birthday_role_id: string | null;
	counting_channel_id: string | null;
};

export type Birthday = {
	guild_id: string;
	user_id: string;
	day: number;
	month: number;
	last_celebrated_year: number;
};

export type ModerationType = "ban" | "unban" | "kick" | "timeout" | "warn";

export type History = {
	id: number;
	guild_id: string;
	user_id: string;
	type: ModerationType;
	at: Date;
	moderator_id: string;
	reason: string;
};

export type TicketStatus = "open" | "closed";

export type Ticket = {
	id: number;
	guild_id: string;
	owner_id: string;
	status: TicketStatus;
	closed_at: Date | null;
};

export type TicketMessage = {
	id: number;
	ticket_id: number;
	author_id: string;
	content: string;
	sent_at: Date;
};

export type TempRole = {
	id: number;
	guild_id: string;
	user_id: string;
	role_id: string;
	expires_on: Date | null;
	already_removed: boolean;
};
