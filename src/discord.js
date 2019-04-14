import { Client, RichEmbed } from 'discord.js';

import configs from './config';
import loggers from './logging';

const { discord: config } = configs;
const log = loggers('discord');

const logAuthorizeLink = () => {
  try {
    if (!config.clientId) {
      log.error('You must specify a clientId in the configuration!');
      log.info(
        'You can get a Discord client ID from https://discordapp.com/developers/applications/'
      );

      throw new Error('Missing clientId!');
    } else if (!config.botToken) {
      log.error('You must specify a botToken in the configuration!');
      log.info(
        `You can get a Discord bot token from https://discordapp.com/developers/applications/${
          config.clientId
        }/bots`
      );

      throw new Error('Missing botToken!');
    } else if (!config.channelId) {
      log.error('You must specify a channelId in the configuration!');
      log.info(
        "You can get a channel's ID by right clicking on it and selecting Copy ID"
      );

      throw new Error('Missing channelId!');
    }

    log.info(
      `To join the bot to a server, go to https://discordapp.com/api/oauth2/authorize?client_id=${
        config.clientId
      }&permissions=157696&scope=bot`
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

      const channel = client.channels.get(config.channelId);

      if (!channel) {
        log.error(`Unable to get channel with ID ${config.channelId}`);
        return;
      }

      const embed = new RichEmbed()
        .setTitle('Screechr has arrived.')
        .setColor('#10529f')
        .setDescription(
          `Server status will be communicated in #${channel.name}`
        );

      channel.send(embed);
    });

    this.client = client;
    this.connect = this.connect.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
  }

  connect() {
    logAuthorizeLink();

    this.client.login(config.botToken);
  }

  async sendMessage(message) {
    const channel = this.client.channels.get(config.channelId);

    if (!channel) {
      log.error(`Unable to get channel with ID ${config.channelId}`);
      return;
    }

    return await channel.send(message);
  }
}
