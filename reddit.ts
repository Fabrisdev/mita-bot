import { EmbedBuilder } from "discord.js";
import { client } from "./client";
import type { RedditData } from "./reddit.types";

export async function publishRedditPosts() {
	const posts = await fetchPosts();
	if (posts === null) return;
	const channel = await client.channels.fetch("1474975172565143713");
	if (channel === null)
		throw new Error("Failed fetching reddit Discord channel");
	if (!channel.isSendable()) throw new Error("Can't send there!");

	for (const item of posts.data.children) {
		const d = item.data;

		const image =
			d.post_hint === "image"
				? d.url
				: d.preview?.images?.[0]?.source?.url?.replaceAll("&amp;", "&") || null;

		const embed = new EmbedBuilder()
			.setTitle(d.title)
			.setURL(`https://reddit.com${d.permalink}`)
			.setDescription(d.selftext ? d.selftext.slice(0, 2000) : null)
			.setFooter({
				text: `👍 ${d.score} | u/${d.author}`,
			});

		if (image) {
			embed.setImage(image);
		}
		await channel.send({
			embeds: [embed],
		});
	}
}

async function fetchPosts() {
	const url = "https://www.reddit.com/r/MiSideReddit/hot.json";

	return (await fetch(url, {
		headers: {
			"User-Agent":
				"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
			Accept: "application/json",
			"Accept-Language": "en-US,en;q=0.9",
		},
	})
		.then((res) => res.json())
		.catch(() => null)) as RedditData | null;
}
