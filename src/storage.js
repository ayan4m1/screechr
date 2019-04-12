import storage from 'node-persist';

import loggers from './logging';

const log = loggers('storage');

export default class Storage {
  async checkStore(key, info) {
    await storage.init({ dir: './data' });

    const { name, status: currentStatus } = info;
    const lastStatus = (await storage.getItem(key)) || 0;

    if (currentStatus !== lastStatus.status) {
      log.info(`${name} (${key}) needs a notification!`);
      await storage.setItem(key, info);
      return {
        old: lastStatus,
        new: info
      };
    } else {
      log.info(`${name} (${key}) does not need a notification.`);
      return null;
    }
  }
}
