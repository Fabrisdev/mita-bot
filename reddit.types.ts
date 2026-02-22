export interface RedditData {
	kind: string;
	data: Data;
}

export interface Data {
	after: string;
	dist: number;
	modhash: string;
	geo_filter: any;
	children: Children[];
	before: any;
}

export interface Children {
	kind: string;
	data: Data2;
}

export interface Data2 {
	approved_at_utc: any;
	subreddit: string;
	selftext: string;
	author_fullname: string;
	saved: boolean;
	mod_reason_title: any;
	gilded: number;
	clicked: boolean;
	title: string;
	link_flair_richtext: LinkFlairRichtext[];
	subreddit_name_prefixed: string;
	hidden: boolean;
	pwls: number;
	link_flair_css_class: string;
	downs: number;
	thumbnail_height?: number;
	top_awarded_type: any;
	hide_score: boolean;
	name: string;
	quarantine: boolean;
	link_flair_text_color: string;
	upvote_ratio: number;
	author_flair_background_color?: string;
	subreddit_type: string;
	ups: number;
	total_awards_received: number;
	media_embed: MediaEmbed;
	thumbnail_width?: number;
	author_flair_template_id?: string;
	is_original_content: boolean;
	user_reports: any[];
	secure_media?: SecureMedia;
	is_reddit_media_domain: boolean;
	is_meta: boolean;
	category: any;
	secure_media_embed: SecureMediaEmbed;
	link_flair_text: string;
	can_mod_post: boolean;
	score: number;
	approved_by: any;
	is_created_from_ads_ui: boolean;
	author_premium: boolean;
	thumbnail: string;
	edited: any;
	author_flair_css_class: any;
	author_flair_richtext: AuthorFlairRichtext[];
	gildings: Gildings;
	content_categories: any;
	is_self: boolean;
	mod_note: any;
	created: number;
	link_flair_type: string;
	wls: number;
	removed_by_category: any;
	banned_by: any;
	author_flair_type: string;
	domain: string;
	allow_live_comments: boolean;
	selftext_html?: string;
	likes: any;
	suggested_sort: any;
	banned_at_utc: any;
	view_count: any;
	archived: boolean;
	no_follow: boolean;
	is_crosspostable: boolean;
	pinned: boolean;
	over_18: boolean;
	all_awardings: any[];
	awarders: any[];
	media_only: boolean;
	link_flair_template_id: string;
	can_gild: boolean;
	spoiler: boolean;
	locked: boolean;
	author_flair_text?: string;
	treatment_tags: any[];
	visited: boolean;
	removed_by: any;
	num_reports: any;
	distinguished?: string;
	subreddit_id: string;
	author_is_blocked: boolean;
	mod_reason_by: any;
	removal_reason: any;
	link_flair_background_color: string;
	id: string;
	is_robot_indexable: boolean;
	report_reasons: any;
	author: string;
	discussion_type: any;
	num_comments: number;
	send_replies: boolean;
	contest_mode: boolean;
	mod_reports: any[];
	author_patreon_flair: boolean;
	author_flair_text_color?: string;
	permalink: string;
	stickied: boolean;
	url: string;
	subreddit_subscribers: number;
	created_utc: number;
	num_crossposts: number;
	media?: Media;
	is_video: boolean;
	post_hint?: string;
	url_overridden_by_dest?: string;
	preview?: Preview;
	is_gallery?: boolean;
	media_metadata?: MediaMetadata;
	gallery_data?: GalleryData;
	crosspost_parent_list?: CrosspostParentList[];
	crosspost_parent?: string;
}

export interface LinkFlairRichtext {
	e: string;
	t: string;
}

export interface MediaEmbed {
	content?: string;
	width?: number;
	scrolling?: boolean;
	height?: number;
}

export interface SecureMedia {
	type?: string;
	oembed?: Oembed;
	reddit_video?: RedditVideo;
}

export interface Oembed {
	provider_url: string;
	version: string;
	title: string;
	type: string;
	thumbnail_width: number;
	height: number;
	width: number;
	html: string;
	author_name: string;
	provider_name: string;
	thumbnail_url: string;
	thumbnail_height: number;
	author_url: string;
}

export interface RedditVideo {
	bitrate_kbps: number;
	fallback_url: string;
	has_audio: boolean;
	height: number;
	width: number;
	scrubber_media_url: string;
	dash_url: string;
	duration: number;
	hls_url: string;
	is_gif: boolean;
	transcoding_status: string;
}

export interface SecureMediaEmbed {
	content?: string;
	width?: number;
	scrolling?: boolean;
	media_domain_url?: string;
	height?: number;
}

export interface AuthorFlairRichtext {
	e: string;
	t?: string;
	a?: string;
	u?: string;
}

export type Gildings = {};

export interface Media {
	type?: string;
	oembed?: Oembed2;
	reddit_video?: RedditVideo2;
}

export interface Oembed2 {
	provider_url: string;
	version: string;
	title: string;
	type: string;
	thumbnail_width: number;
	height: number;
	width: number;
	html: string;
	author_name: string;
	provider_name: string;
	thumbnail_url: string;
	thumbnail_height: number;
	author_url: string;
}

export interface RedditVideo2 {
	bitrate_kbps: number;
	fallback_url: string;
	has_audio: boolean;
	height: number;
	width: number;
	scrubber_media_url: string;
	dash_url: string;
	duration: number;
	hls_url: string;
	is_gif: boolean;
	transcoding_status: string;
}

export interface Preview {
	images: Image[];
	enabled: boolean;
}

export interface Image {
	source: Source;
	resolutions: Resolution[];
	variants: Variants;
	id: string;
}

export interface Source {
	url: string;
	width: number;
	height: number;
}

export interface Resolution {
	url: string;
	width: number;
	height: number;
}

export interface Variants {
	obfuscated?: Obfuscated;
	nsfw?: Nsfw;
}

export interface Obfuscated {
	source: Source2;
	resolutions: Resolution2[];
}

export interface Source2 {
	url: string;
	width: number;
	height: number;
}

export interface Resolution2 {
	url: string;
	width: number;
	height: number;
}

export interface Nsfw {
	source: Source3;
	resolutions: Resolution3[];
}

export interface Source3 {
	url: string;
	width: number;
	height: number;
}

export interface Resolution3 {
	url: string;
	width: number;
	height: number;
}

export interface MediaMetadata {
	tav0xvfvb3kg1?: Tav0xvfvb3kg1;
	vsjlrdetb3kg1?: Vsjlrdetb3kg1;
	wo2oqecub3kg1?: Wo2oqecub3kg1;
	j651k01vb3kg1?: J651k01vb3kg1;
	tjpsg7xhobkg1?: Tjpsg7xhobkg1;
	"7ivqe32iobkg1"?: N7ivqe32iobkg1;
	gbrjof7iobkg1?: Gbrjof7iobkg1;
	"3j15jkuzddkg1"?: N3j15jkuzddkg1;
	r5jae95zddkg1?: R5jae95zddkg1;
	yjfgx3e8edkg1?: Yjfgx3e8edkg1;
	whscswnclpkg1?: Whscswnclpkg1;
	ermuwo8alpkg1?: Ermuwo8alpkg1;
	kskeofxjfxkg1?: Kskeofxjfxkg1;
	zxeb4zsffxkg1?: Zxeb4zsffxkg1;
	nouj61ewixkg1?: Nouj61ewixkg1;
	"6yrvhoqwixkg1"?: N6yrvhoqwixkg1;
	roajqwovixkg1?: Roajqwovixkg1;
}

export interface Tav0xvfvb3kg1 {
	status: string;
	e: string;
	m: string;
	p: P[];
	s: S;
	id: string;
}

export interface P {
	y: number;
	x: number;
	u: string;
}

export interface S {
	y: number;
	x: number;
	u: string;
}

export interface Vsjlrdetb3kg1 {
	status: string;
	e: string;
	m: string;
	p: P2[];
	s: S2;
	id: string;
}

export interface P2 {
	y: number;
	x: number;
	u: string;
}

export interface S2 {
	y: number;
	x: number;
	u: string;
}

export interface Wo2oqecub3kg1 {
	status: string;
	e: string;
	m: string;
	p: P3[];
	s: S3;
	id: string;
}

export interface P3 {
	y: number;
	x: number;
	u: string;
}

export interface S3 {
	y: number;
	x: number;
	u: string;
}

export interface J651k01vb3kg1 {
	status: string;
	e: string;
	m: string;
	p: P4[];
	s: S4;
	id: string;
}

export interface P4 {
	y: number;
	x: number;
	u: string;
}

export interface S4 {
	y: number;
	x: number;
	u: string;
}

export interface Tjpsg7xhobkg1 {
	status: string;
	e: string;
	m: string;
	p: P5[];
	s: S5;
	id: string;
}

export interface P5 {
	y: number;
	x: number;
	u: string;
}

export interface S5 {
	y: number;
	gif: string;
	mp4: string;
	x: number;
}

export interface N7ivqe32iobkg1 {
	status: string;
	e: string;
	m: string;
	p: P6[];
	s: S6;
	id: string;
}

export interface P6 {
	y: number;
	x: number;
	u: string;
}

export interface S6 {
	y: number;
	x: number;
	u: string;
}

export interface Gbrjof7iobkg1 {
	status: string;
	e: string;
	m: string;
	p: P7[];
	s: S7;
	id: string;
}

export interface P7 {
	y: number;
	x: number;
	u: string;
}

export interface S7 {
	y: number;
	x: number;
	u: string;
}

export interface N3j15jkuzddkg1 {
	status: string;
	e: string;
	m: string;
	p: P8[];
	s: S8;
	id: string;
}

export interface P8 {
	y: number;
	x: number;
	u: string;
}

export interface S8 {
	y: number;
	x: number;
	u: string;
}

export interface R5jae95zddkg1 {
	status: string;
	e: string;
	m: string;
	p: P9[];
	s: S9;
	id: string;
}

export interface P9 {
	y: number;
	x: number;
	u: string;
}

export interface S9 {
	y: number;
	x: number;
	u: string;
}

export interface Yjfgx3e8edkg1 {
	status: string;
	e: string;
	m: string;
	p: P10[];
	s: S10;
	id: string;
}

export interface P10 {
	y: number;
	x: number;
	u: string;
}

export interface S10 {
	y: number;
	x: number;
	u: string;
}

export interface Whscswnclpkg1 {
	status: string;
	e: string;
	m: string;
	o: O[];
	p: P11[];
	s: S11;
	id: string;
}

export interface O {
	y: number;
	x: number;
	u: string;
}

export interface P11 {
	y: number;
	x: number;
	u: string;
}

export interface S11 {
	y: number;
	x: number;
	u: string;
}

export interface Ermuwo8alpkg1 {
	status: string;
	e: string;
	m: string;
	o: O2[];
	p: P12[];
	s: S12;
	id: string;
}

export interface O2 {
	y: number;
	x: number;
	u: string;
}

export interface P12 {
	y: number;
	x: number;
	u: string;
}

export interface S12 {
	y: number;
	x: number;
	u: string;
}

export interface Kskeofxjfxkg1 {
	status: string;
	e: string;
	m: string;
	o: O3[];
	p: P13[];
	s: S13;
	id: string;
}

export interface O3 {
	y: number;
	x: number;
	u: string;
}

export interface P13 {
	y: number;
	x: number;
	u: string;
}

export interface S13 {
	y: number;
	x: number;
	u: string;
}

export interface Zxeb4zsffxkg1 {
	status: string;
	e: string;
	m: string;
	o: O4[];
	p: P14[];
	s: S14;
	id: string;
}

export interface O4 {
	y: number;
	x: number;
	u: string;
}

export interface P14 {
	y: number;
	x: number;
	u: string;
}

export interface S14 {
	y: number;
	x: number;
	u: string;
}

export interface Nouj61ewixkg1 {
	status: string;
	e: string;
	m: string;
	p: P15[];
	s: S15;
	id: string;
}

export interface P15 {
	y: number;
	x: number;
	u: string;
}

export interface S15 {
	y: number;
	x: number;
	u: string;
}

export interface N6yrvhoqwixkg1 {
	status: string;
	e: string;
	m: string;
	p: P16[];
	s: S16;
	id: string;
}

export interface P16 {
	y: number;
	x: number;
	u: string;
}

export interface S16 {
	y: number;
	x: number;
	u: string;
}

export interface Roajqwovixkg1 {
	status: string;
	e: string;
	m: string;
	p: P17[];
	s: S17;
	id: string;
}

export interface P17 {
	y: number;
	x: number;
	u: string;
}

export interface S17 {
	y: number;
	x: number;
	u: string;
}

export interface GalleryData {
	items: Item[];
}

export interface Item {
	media_id: string;
	id: number;
	caption?: string;
}

export interface CrosspostParentList {
	approved_at_utc: any;
	subreddit: string;
	selftext: string;
	author_fullname: string;
	saved: boolean;
	mod_reason_title: any;
	gilded: number;
	clicked: boolean;
	title: string;
	link_flair_richtext: any[];
	subreddit_name_prefixed: string;
	hidden: boolean;
	pwls: any;
	link_flair_css_class: any;
	downs: number;
	thumbnail_height: number;
	top_awarded_type: any;
	hide_score: boolean;
	name: string;
	quarantine: boolean;
	link_flair_text_color: string;
	upvote_ratio: number;
	author_flair_background_color: any;
	subreddit_type: string;
	ups: number;
	total_awards_received: number;
	media_embed: MediaEmbed2;
	thumbnail_width: number;
	author_flair_template_id: any;
	is_original_content: boolean;
	user_reports: any[];
	secure_media: any;
	is_reddit_media_domain: boolean;
	is_meta: boolean;
	category: any;
	secure_media_embed: SecureMediaEmbed2;
	link_flair_text: any;
	can_mod_post: boolean;
	score: number;
	approved_by: any;
	is_created_from_ads_ui: boolean;
	author_premium: boolean;
	thumbnail: string;
	edited: boolean;
	author_flair_css_class: any;
	author_flair_richtext: any[];
	gildings: Gildings2;
	post_hint: string;
	content_categories: any;
	is_self: boolean;
	mod_note: any;
	created: number;
	link_flair_type: string;
	wls: any;
	removed_by_category: any;
	banned_by: any;
	author_flair_type: string;
	domain: string;
	allow_live_comments: boolean;
	selftext_html: any;
	likes: any;
	suggested_sort: any;
	banned_at_utc: any;
	url_overridden_by_dest: string;
	view_count: any;
	archived: boolean;
	no_follow: boolean;
	is_crosspostable: boolean;
	pinned: boolean;
	over_18: boolean;
	preview: Preview2;
	all_awardings: any[];
	awarders: any[];
	media_only: boolean;
	can_gild: boolean;
	spoiler: boolean;
	locked: boolean;
	author_flair_text: any;
	treatment_tags: any[];
	visited: boolean;
	removed_by: any;
	num_reports: any;
	distinguished: any;
	subreddit_id: string;
	author_is_blocked: boolean;
	mod_reason_by: any;
	removal_reason: any;
	link_flair_background_color: string;
	id: string;
	is_robot_indexable: boolean;
	report_reasons: any;
	author: string;
	discussion_type: any;
	num_comments: number;
	send_replies: boolean;
	contest_mode: boolean;
	mod_reports: any[];
	author_patreon_flair: boolean;
	author_flair_text_color: any;
	permalink: string;
	stickied: boolean;
	url: string;
	subreddit_subscribers: number;
	created_utc: number;
	num_crossposts: number;
	media: any;
	is_video: boolean;
}

export type MediaEmbed2 = {};

export type SecureMediaEmbed2 = {};

export type Gildings2 = {};

export interface Preview2 {
	images: Image2[];
	enabled: boolean;
}

export interface Image2 {
	source: Source4;
	resolutions: Resolution4[];
	variants: Variants2;
	id: string;
}

export interface Source4 {
	url: string;
	width: number;
	height: number;
}

export interface Resolution4 {
	url: string;
	width: number;
	height: number;
}

export type Variants2 = {};
