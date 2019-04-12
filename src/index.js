import { format } from 'date-fns';

import colors from './colors';
import configs from './config';
import loggers from './logging';

import Discord from './discord';
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
  for (const server of await pterodactyl.getServers()) {
    const { id, name } = server;
    const status = await pterodactyl.getServerStatus(id);

    if (Array.isArray(pteroConfig.servers) && !pteroConfig.servers.includes()) {
      continue;
    }

    const info = {
      id,
      name,
      status
    };
    const statusDiff = await storage.checkStore(id, info);

    if (statusDiff) {
      const { old: oldStatus, new: newStatus } = statusDiff;

      log.info(`${name} was ${oldStatus.status}, now ${newStatus.status}`);

      const message = new RichEmbed()
        .setTitle(`${name} is now ${newStatus.status}`)
        .setDescription(
          `Previously, the server had been ${oldStatus.status} since ${format(
            new Date(),
            dateFormat
          )}`
        );

      const statusColor = colors[newStatus.status];

      if (statusColor) {
        message.setColor(statusColor);
      } else {
        message.setColor(colors.unknown);
      }

      await discord.sendMessage(message);
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
