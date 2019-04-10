import loggers from './logging';

import Discord from './discord';
import Pterodactyl from './ptero';

const log = loggers('app');

log.info('Discord Pterodactyl Bot starting...');

const discord = new Discord();
const pterodactyl = new Pterodactyl();

discord.connect();
