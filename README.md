# Screechr

This software monitors a configurable list of Pterodactyl servers and notifies a Discord text channel when the status changes.

## Quick Start

If you're familiar with Node and/or Discord bot configuration then you can likely use this Quick Start guide. If not, see the "Tutorial" section below.

> npm install
> npm run build
> cp .screechrrc.default.yml .screechrrc.yml

Now, edit `.screechrrc.yml` using your favorite text editor. Set the `discord.clientId` to your Discord Client ID. Then, run

> npm start

The application will print a URL and then exit. Open the URL in your web browser. This allows you to select which server you want the bot to join. Once you have created the bot, you can copy its token and place it in the `discord.botToken` field in `.screechrrc.yml`. You must also set `discord.channelId` to the numeric channel ID that you want Screechr to send messages to.

Set `pterodactyl.baseUrl` (it should be a URL to your Pterodactyl panel login page) and generate an Account API token at

> https://your.pterodactyl.panel/account/api

Replacing the hostname with your own. Set `pterodactyl.token` to the generated token. Finally, run

> npm start

Now, any time one of your Pterodactyl servers changes state, the configured channel will get a message.

Use a tool like [PM2](https://www.npmjs.com/package/pm2) or [Forever](https://www.npmjs.com/package/forever) to run Screechr in the background. `lib/index.js` is the application entry point.

## Tutorial

This application has the following prerequisites:

- [NodeJS](https://nodejs.org/en/download/) 8+
- A Discord [developer account](https://discordapp.com/developers)

You will need to use the [Discord Applications](https://discordapp.com/developers/applications/) page to create a client ID. Click "New Application" in the upper right and give it a name. Find the "Client ID" number under the app name and save it for later. From there, click on the Bot link in the left-hand navbar and create a bot user for your application.

This section will be integrated into the Quick Start guide soon.

## Notes

You can set the `pollingIntervalMs` to whatever you like, but be aware that Pterodactyl limits you to one request per second. This means that if you have many servers to check or a very low polling interval, Screechr will rate-limit itself to avoid hammering your Pterodactyl panel with requests.