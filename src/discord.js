import configs from './config';
import loggers from './logging';
import { Client, RichEmbed } from 'discord.js';

const { discord: config } = configs;
const log = loggers('discord');

const logAuthorizeLink = () => {
  try {
    if (!config.clientId) {
      log.error('You must specify a clientId in the configuration!');
      log.info(
        'You can get a Discord client ID from https://discordapp.com/developers/applications/'
      );
      return;
    }

    log.info(
      `To join the bot to a server, go to https://discordapp.com/api/oauth2/authorize?client_id=${
        config.clientId
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

export default class Discord {
  constructor() {
    const client = new Client();

    client.on('error', error => {
      log.error(error);
    });

    client.on('ready', async () => {
      log.info(`Joined a server with ${client.users.size} users.`);

      for (const channel of client.channels) {
        const embed = new RichEmbed({
          title: 'Screechr has arrived.',
          color: '#10529f',
          description: `Pterodactyl server status will be communicated in ${
            config.channel
          }`,
          footer: 'We were invited, promise.'
        });

        await channel.send(embed);
      }
    });

    this.client = client;
    this.connect = this.connect.bind(this);
  }

  connect() {
    if (!config.botToken) {
      logAuthorizeLink();
    }

    this.client.login(config.botToken);
  }
}
