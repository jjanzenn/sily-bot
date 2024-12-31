# Sily Bot

A bot that automates silliness.

## How to run

1. Create a new bot at https://discord.com/developers/applications/
2. Set your Interactions Endpoint URL here: https://discord.com/developers/applications/<id\>/information
3. Clone the latest version of `sily-bot` with `git clone https://git.jjanzen.ca/index.cgi/sily-bot.git`
4. Populate your `.env` file
    * APP_ID and PUBLIC_KEY are found at https://discord.com/developers/applications/<id\>/information
    * DISCORD_TOKEN is found by reseting the token at https://discord.com/developers/applications/<id\>/bot
    * TIMEZONE is base on the [IANA time zone database](https://www.iana.org/time-zones) e.g. `America/Winnipeg`
    * PORT is the port that the application should run on. This value is optional and defaults to 3000.
5. Install dependencies with `npm install`
6. Register the bot commands with `npm run register`
7. Run the bot with `npm run start`

The `.env` file is formatted as:
```ini
APP_ID=<APPLICATION ID>
DISCORD_TOKEN=<TOKEN>
PUBLIC_KEY=<PUBLIC KEY>
TIMEZONE=<TIMEZONE>
PORT=<PORT> # optional
```

### Note on accessing the bot

This bot requires that there be a publicly accessible interactions endpoint URL. You're on your own for this as the setup entirely depends on your system. I run an Apache webserver that proxies requests for `/sily-bot` to `http://127.0.0.1:3000/` with the following:
```xml
<VirtualHost *:443>
# ...
  SSLProxyEngine on

  <Location /sily-bot>
    ProxyPass http://127.0.0.1:3000/
    ProxyPassReverse http://127.0.0.1:3000/
  </Location>
</VirtualHost>
```

## Current Abilities

|Command|Description|
|---|---|
|`/blep`|blep.|
|`/catfact`|Get a fact about cats|
|`/fomx`|Get an image of a fox|
|`/help`|Show a help message|
|`/pet`|You can pet sily-bot.|
|`/schedule-message <message> <cron>`|Schedule a message to be send later. Works like Linux cron jobs in the format `second minute hour day month weekday`. Put the number (or name of month or weekday) in each spot. If you want it to run every second, minute, etc. instead of once when it reaches the provided number, use a `*` instead of a number. For instance, to run a job every minute on January 4th, you might use `0 * * 4 January *`.|
