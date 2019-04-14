# Screechr

This software monitors a configurable list of Pterodactyl servers and notifies a Discord text channel when the status changes.

## Tutorial / Usage

This application has the following prerequisites:

- [Node.js](https://nodejs.org/en/download/) 8+
- A Discord [developer account](https://discordapp.com/developers)
- A working [Pterodactyl](https://pterodactyl.io) panel

You will need to use the [Discord Applications](https://discordapp.com/developers/applications/) page to create an application, which gives you a client ID to use during setup. Click "New Application" in the upper right and give it a name. Find the "Client ID" number below the app name and save it for later. Click on the Bot link in the left-hand navbar and create a bot user for your application as well. Reveal the "Bot Token" and save this for later as well.

First, run the following in the source directory

> npm install

This will install the project dependencies and run the build script that compiles `src/` to `lib/`.

> cp .screechrrc.default.yml .screechrrc.yml

This copies the default config file into place. Edit `.screechrrc.yml` using your favorite text editor. Set the `discord.clientId` to your Discord Client ID. Set the `discord.botToken` to your Discord Bot Token.

Set `pterodactyl.baseUrl` to the URL to your Pterodactyl panel and generate an Account API token at

> https://your.pterodactyl.panel/account/api

Replacing the base URL with your own. Set `pterodactyl.token` to the generated token.

Then, run

> npm start

The application will print a URL to the console. Hit Ctrl+C to stop the bot and open the URL in your web browser. This allows you to select which server you want the bot to join.

You must also set the `discord.channelId` to the numeric channel ID (right-click and Copy ID in Discord) that you want Screechr to send messages to. Finally, run

> npm start

Now, any time one of your Pterodactyl servers changes state, the configured channel will get a message. Hitting Ctrl+C will stop the bot.

Use a tool like [PM2](https://www.npmjs.com/package/pm2) or [Forever](https://www.npmjs.com/package/forever) to run Screechr in the background. `lib/index.js` is the application entry point.

## Configuration

Screechr uses [Cosmiconfig](https://github.com/davidtheclark/cosmiconfig#cosmiconfig), which supports JSON, YAML, or JS-based configuration. The default configuration file is in YAML format, but it should be easily portable if you prefer to work in another.

Your configuration filename should start with `.screechrrc` (note the two Rs at the end) and end with an extension appropriate for the format of the document (e.g. `.screechrrc.yml`).

Please see the [default configuration](.screechrrc.default.yml) for detailed documentation and examples on each of the available options.

## Notes

You can set the `pollingIntervalMs` to whatever you like, but be aware that Pterodactyl limits you to one request per second. This means that if you have many servers to check or a very low polling interval, Screechr will rate-limit itself to avoid hammering your Pterodactyl panel with requests.
