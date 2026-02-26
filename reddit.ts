import { EmbedBuilder } from "discord.js";
import { client } from "./client";
import { REDDIT_POSTS_CHANNEL_ID } from "./consts";
import { Reddit } from "./database/reddit";
import { Log } from "./log";
import type { Children, Data2, RedditData } from "./reddit.types";

export async function publishRedditPosts() {
	const embeds = await getEmbeds();
	if (embeds === null) return;
	const channel = await client.channels
		.fetch(REDDIT_POSTS_CHANNEL_ID)
		.catch(() => null);
	if (channel === null || !channel.isSendable()) return;
	for (const embed of embeds) {
		await channel.send({
			embeds: [embed],
		});
	}
}

async function getEmbeds() {
	const posts = await fetchPosts();
	if (posts === null) return null;
	const embeds: EmbedBuilder[] = [];
	for (const post of posts) {
		const embed = formatPostIntoEmbed(post.data);
		embeds.push(embed);
	}
	return embeds;
}

function formatPostIntoEmbed(d: Data2) {
	const image =
		d.post_hint === "image"
			? d.url
			: d.preview?.images?.[0]?.source?.url?.replaceAll("&amp;", "&") || null;

	const embed = new EmbedBuilder()
		.setTitle(d.title)
		.setURL(`https://reddit.com${d.permalink}`)
		.setDescription(d.selftext ? d.selftext.slice(0, 2000) : null)
		.setFooter({
			text: `⬆️ ${d.score} | u/${d.author}`,
		});

	if (image) {
		embed.setImage(image);
	}
	return embed;
}

async function fetchPosts() {
	Log.log("Fetching Reddit posts...");
	const url = "https://www.reddit.com/r/MiSideReddit/hot.json";

	const posts = (await fetch(url, {
		headers: {
			"User-Agent":
				"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
			Accept: "application/json",
			"Accept-Language": "en-US,en;q=0.9",
		},
	})
		.then(async (res) => {
			if (res.ok) return res.json();
			await Log.errorWithoutMessaging(
				"Failed fetching Reddit posts. More info below:",
			);
			console.error(res);
			throw res;
		})
		.catch(() => null)) as RedditData | null;
	if (posts === null) return null;
	Log.log(`${posts.data.children.length} posts fetched.`);
	const filteredPosts: Children[] = [];
	for (const post of posts.data.children) {
		if (post.data.score < 100) continue;
		const isNew = await Reddit.markAsSentIfNew(post.data.id);
		if (!isNew) continue;
		filteredPosts.push(post);
	}
	Log.log(`After filtering, ${filteredPosts.length} posts sent to the guild.`);
	return filteredPosts;
}
