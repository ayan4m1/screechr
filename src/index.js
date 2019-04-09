import configs from './config';
import loggers from './logging';
import { Client, RichEmbed } from 'discord.js';

const { discord } = configs;
const log = loggers('app');

const logAuthorizeLink = () => {
  try {
    if (!discord.clientId) {
      log.error('You must specify a clientId in the configuration!');
      log.info(
        'You can get a Discord client ID from https://discordapp.com/developers/applications/'
      );
      return;
    }

    log.info(
      `To join the bot to a server, go to https://discordapp.com/api/oauth2/authorize?client_id=${
        discord.clientId
      }&permissions=157696&scope=bot`
    );
    log.info(
      'Then, set the botToken in your configuration file and try this again.'
    );
  } catch (error) {
    log.error(error);
    throw error;
  }
};

if (!discord.botToken) {
  logAuthorizeLink();
}

const client = new Client();

client.on('error', error => {
  log.error(error);
});

client.on('ready', async () => {
  log.info(`Joined a server with ${client.users.size} users.`);

  for (const channel of client.channels) {
    // eslint-disable-next-line
    console.dir(channel);

    const embed = new RichEmbed({
      title: 'Screechr has arrived.',
      color: '#10529f',
      description: `Pterodactyl server status will be communicated in ${
        discord.channel
      }`,
      footer: 'We were invited, promise.'
    });

    const result = await channel.send(embed);

    // eslint-disable-next-line
    console.dir(result);
  }
});

client.login(discord.botToken);
