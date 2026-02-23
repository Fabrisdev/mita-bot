import { client } from "./client";
import { token } from "./environment";
import { registerEvents } from "./events/register";

await registerEvents();
client.login(token());
