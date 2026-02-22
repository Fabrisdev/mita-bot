import { startApiService } from "./api";
import { client } from "./client";
import { token } from "./environment";
import { registerEvents } from "./events/register";
import { publishRedditPosts } from "./reddit";

await registerEvents();
client.login(token());
startApiService();
await publishRedditPosts();
