import { parse, format, formatDistanceToNow } from 'date-fns';

import colors from './colors';
import configs from './config';
import loggers from './logging';

import Discord, { getChannelsForServer, getAllChannels } from './discord';
import Pterodactyl from './ptero';
import Storage from './storage';
import { RichEmbed } from 'discord.js';

const { pterodactyl: pteroConfig, discord: discordConfig } = configs;
const log = loggers('app');

const { pollingIntervalMs } = pteroConfig;
const { dateFormat } = discordConfig;

const pterodactyl = new Pterodactyl();
const discord = new Discord();
const storage = new Storage();

const execute = async () => {
  for (const server of await pterodactyl.getAllServers()) {
    const { id, name } = server;
    const status = await pterodactyl.getServerStatus(id);

    if (
      Array.isArray(pteroConfig.servers) &&
      !pteroConfig.servers.includes(name)
    ) {
      log.debug(
        `Skipping ${name} as it is not in the list of servers to watch`
      );
      continue;
    }

    const info = {
      id,
      name,
      status,
      updated: format(new Date(), 'x')
    };
    const statusDiff = await storage.checkStore(id, info);

    if (statusDiff) {
      const { old: oldStatus, new: newStatus } = statusDiff;

      log.info(
        `${name} was ${oldStatus.status} and is now ${newStatus.status}`
      );

      const lastUpdated = parseInt(oldStatus.updated, 10);
      const message = new RichEmbed().setTitle(
        `${name} is now ${newStatus.status}`
      );

      if (lastUpdated > 0) {
        const lastUpdatedDate = parse(lastUpdated, 't', Date.now());

        message.setDescription(
          `Previously, the server had been ${
            oldStatus.status
          } since ${formatDistanceToNow(lastUpdatedDate)} ago at ${format(
            lastUpdatedDate,
            dateFormat
          )}`
        );
      } else {
        message.setDescription(
          `Previously, the server had been ${oldStatus.status}`
        );
      }

      const statusColor = colors[newStatus.status];

      if (statusColor) {
        message.setColor(statusColor);
      } else {
        message.setColor(colors.unknown);
      }

      const channels = getChannelsForServer(name);

      if (channels.length === 0) {
        channels.push.apply(channels, getAllChannels());
      }

      for (const channelId of channels) {
        log.info(`Notifying ${channelId} of state change...`);
        await discord.message(channelId, message);
      }
    } else {
      log.info(`No change in ${name} - still ${status}`);
    }
  }
};

log.info(
  `Discord Pterodactyl Bot checking every ${(
    pteroConfig.pollingIntervalMs / 1000.0
  ).toFixed(1)}s...`
);
discord.connect();
setInterval(execute, pollingIntervalMs);
execute();
