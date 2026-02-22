import { startApiService } from "./api";
import { client } from "./client";
import { token } from "./environment";
import { registerEvents } from "./events/register";
import { publishRedditPosts } from "./reddit";

await registerEvents();
client.login(token());
startApiService();
const TWELVE_HOURS = 12 * 60 * 60 * 1000;
setTimeout(publishRedditPosts, TWELVE_HOURS);
await publishRedditPosts();
