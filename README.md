# Mita bot
Mita bot is a Discord bot developed for Mita's Heart community.

## Installation
1. Clone the repo
    ```bash
    bun install
    ```
2. Install dependencies
    ```bash
    bun install
    ```
3. Create .env file
    ```bash
    cp .example.env .env
    ```
4. Populate .env fields

## Deploy commands
```bash
bun deploy:commands
```

## Start bot
```bash
bun run start
```

## Setup the database
1. Create the network so other containers can access it.
    ```bash
    docker network create bot-network
    ```
2. Create the bot database
    ```bash
    docker run --name bot-db \
        --network bot-network \
        -e POSTGRES_PASSWORD=YOUR_PASSWORD \
        -p 5432:5432 \
        -v pgdata:/var/lib/postgresql \
        -d postgres:18.2
    ```
3. Optional: Setup a GUI service to work easily with it.
    ```bash
    docker run --name pgadmin \
        --network bot-network \
        -e PGADMIN_DEFAULT_EMAIL=YOUR_EMAIL \
        -e PGADMIN_DEFAULT_PASSWORD=YOUR_PASSWORD \
        -p 5050:80 \
        -d dpage/pgadmin4
    ```
4. Make sure to have added the `DATABASE_URL` environment variable
5. Populate the database by running `bun run db:populate`
6. Generate the types with `bun run db:generate`

For more scripts, you can check out the `package.json` file.