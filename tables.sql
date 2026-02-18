CREATE TABLE guild_settings(
  guild_id TEXT PRIMARY KEY,
  alerts_channel_id TEXT,
  birthday_channel_id TEXT,
  birthday_role_id TEXT,
  counting_channel_id TEXT
);

CREATE TABLE birthdays(
  guild_id TEXT,
  user_id TEXT,
  day INT NOT NULL,
  month INT NOT NULL,
  last_celebrated_year INT,
  PRIMARY KEY (guild_id, user_id)
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
  guild_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  type moderation_type NOT NULL,
  at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  moderator_id TEXT NOT NULL,
  reason TEXT NOT NULL
);

CREATE TYPE ticket_status AS ENUM('open', 'closed');

CREATE TABLE tickets(
  id SERIAL PRIMARY KEY,
  guild_id TEXT NOT NULL,
  channel_id TEXT NOT NULL,
  owner_id TEXT NOT NULL,
  status ticket_status NOT NULL DEFAULT 'open',
  closed_at TIMESTAMPTZ
);

CREATE TABLE ticket_messages(
  id SERIAL PRIMARY KEY,
  ticket_id INTEGER REFERENCES tickets(id) NOT NULL,
  author_id TEXT NOT NULL,
  content TEXT NOT NULL,
  sent_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE temp_roles(
  id SERIAL PRIMARY KEY,
  guild_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  role_id TEXT NOT NULL,
  expires_on TIMESTAMPTZ NOT NULL,
  already_removed BOOLEAN DEFAULT false
);