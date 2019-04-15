import storage from 'node-persist';

import loggers from './logging';

const log = loggers('storage');

export default class Storage {
  async checkStore(key, info) {
    await storage.init({ dir: './data' });

    const { name, status: currentStatus } = info;
    const lastStatus = await storage.getItem(key);

    if (!lastStatus || currentStatus !== lastStatus.status) {
      const oldStatus = lastStatus || {
        status: 'off',
        updated: 0
      };

      log.info(`${name} (${key}) needs a notification!`);
      await storage.setItem(key, info);
      return {
        old: oldStatus,
        new: info
      };
    } else {
      log.info(`${name} (${key}) does not need a notification.`);
      return null;
    }
  }
}
