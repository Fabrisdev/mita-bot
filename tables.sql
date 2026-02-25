CREATE TABLE birthdays(
  user_id TEXT PRIMARY KEY,
  day INT NOT NULL,
  month INT NOT NULL,
  last_celebrated_year INT
);

CREATE TYPE moderation_type AS ENUM (
  'ban',
  'unban',
  'kick',
  'timeout',
  'warn'
);

CREATE TABLE history(
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  type moderation_type NOT NULL,
  at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  moderator_id TEXT NOT NULL,
  reason TEXT NOT NULL
);

CREATE TABLE temp_roles(
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  role_id TEXT NOT NULL,
  expires_on TIMESTAMPTZ NOT NULL,
  already_removed BOOLEAN DEFAULT false
);

CREATE TABLE already_sent_reddit_posts(
  id TEXT PRIMARY KEY
);

CREATE TABLE starboard(
  message_id TEXT PRIMARY KEY,
  starboard_message_id TEXT NOT NULL
);