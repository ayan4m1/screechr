import unique from 'array-unique';
import { Client, RichEmbed } from 'discord.js';

import colors from './colors';
import configs from './config';
import loggers from './logging';

const { discord: config, mapping: mappings } = configs;
const log = loggers('discord');

if (!Array.isArray(mappings) || mappings.length === 0) {
  log.error('Invalid mapping array present in the configuration!');
  throw new Error('Invalid server <-> channel mapping!');
}

const distinctChannels = unique(mappings.flatMap(map => map.channels));

export const getServersForChannel = id => {
  const matching = mappings.filter(
    items => !items.channels && items.channels.includes(id)
  );

  return matching.flatMap(map => map.servers);
};

export const getChannelsForServer = name => {
  const matching = mappings.filter(items => {
    return !items.servers || items.servers.includes(name);
  });

  return matching.flatMap(map => map.channels);
};

export const getAllChannels = () => distinctChannels;

const logAuthorizeLink = () => {
  try {
    if (!config.clientId) {
      log.error('You must specify a clientId in the configuration!');
      log.info(
        'You can get a Discord client ID from https://discordapp.com/developers/applications/'
      );

      throw new Error('Missing Discord client ID!');
    } else if (!config.botToken) {
      log.error('You must specify a botToken in the configuration!');
      log.info(
        `You can get a Discord bot token from https://discordapp.com/developers/applications/${config.clientId}/bots`
      );

      throw new Error('Missing Discord bot token!');
    }

    log.info(
      `To join the bot to a server, go to https://discordapp.com/api/oauth2/authorize?client_id=${config.clientId}&permissions=157696&scope=bot`
    );
  } catch (error) {
    log.error(error.message);
    log.error(error.stack);
    throw error;
  }
};

export default class Discord {
  constructor() {
    const client = new Client();

    client.on('error', error => {
      log.error(error.message);
      log.error(error.stack);
    });

    client.on('ready', async () => {
      log.info(
        `Connected to ${client.guilds.size} servers with ${client.users.size} users.`
      );
    });

    client.on('guildCreate', async guild => {
      log.info(
        `Joined a server called ${guild.name} with ${guild.memberCount} users.`
      );

      for (const channelId of distinctChannels) {
        const servers = getServersForChannel(channelId);
        const serverList =
          servers.length > 0 ? servers.join(', ') : 'all servers';

        await this.message(
          channelId,
          new RichEmbed()
            .setTitle('Screechr has arrived.')
            .setColor(colors.pteroBlue)
            .setDescription(
              `Status updates about ${serverList} will be communicated here!`
            )
        );
      }
    });

    client.on('guildDelete', async guild => {
      log.info(`Left a server called ${guild.name}`);
    });

    this.client = client;
    this.connect = this.connect.bind(this);
    this.getChannel = this.getChannel.bind(this);
    this.message = this.message.bind(this);
  }

  connect() {
    logAuthorizeLink();

    this.client.login(config.botToken);
  }

  getChannel(id) {
    const channel = this.client.channels.get(id);

    if (!channel) {
      log.error(`Unable to get channel with ID ${id}`);
      return null;
    }

    return channel;
  }

  async message(channelId, message) {
    try {
      const channel = this.getChannel(channelId);

      if (channel) {
        return await channel.send(message);
      }
    } catch (error) {
      log.error(error.message);
      log.error(error.stack);
    }
  }
}
