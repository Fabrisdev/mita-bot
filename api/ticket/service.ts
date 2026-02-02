import { Ticket } from "../../db";
import type { TicketModel } from "./model";

export namespace TicketService {
	export async function getAll({ guildId }: TicketModel.GetAll) {
		return Ticket.all(guildId);
	}
}
