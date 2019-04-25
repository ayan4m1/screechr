import axios from 'axios';
import Bottleneck from 'bottleneck';

import configs from './config';
import loggers from './logging';

const { pterodactyl: config } = configs;
const log = loggers('ptero');

export default class Pterodactyl {
  constructor() {
    if (!config.baseUrl) {
      log.error(
        'You must specify a Pterodactyl panel URL in the configuration!'
      );

      throw new Error('Missing baseUrl!');
    } else if (!config.token) {
      log.error(
        'You must specify a Pterodactyl API token in the configuration!'
      );

      throw new Error('Missing token!');
    }

    this.client = axios.create({
      baseURL: config.baseUrl
    });
    this.limiter = new Bottleneck({
      reservoir: 60,
      reservoirRefreshAmount: 60,
      reservoirRefreshInterval: 60000,
      maxConcurrent: 2,
      minTime: 500
    });
  }

  async getServerStatus(id) {
    const response = await this.limiter.schedule(() =>
      this.makeRequest(`/client/servers/${id}/utilization`)
    );
    const { data } = response;

    if (!data) {
      return 'unknown';
    }

    return data.attributes.state;
  }

  async getAllServers() {
    const result = [];
    const response = await this.limiter.schedule(() =>
      this.makeRequest('/client')
    );
    const { data } = response;

    if (!data) {
      return result;
    }

    for (const { attributes } of data.data.filter(
      entry => entry.object === 'server'
    )) {
      result.push({
        id: attributes.identifier,
        name: attributes.name
      });
    }

    if (data.meta.pagination.total_pages > 1) {
      log.warn(
        'There were additional pages of results but I do not know how to fetch them.'
      );
    }

    return result;
  }

  makeRequest(url, params) {
    const fullUrl = `/api${url}`;

    log.debug(`Requesting ${fullUrl}`);
    try {
      return this.client.get(fullUrl, {
        headers: {
          Authorization: `Bearer ${config.token}`,
          'Content-Type': 'application/json',
          Accept: 'Application/vnd.pterodactyl.v1+json'
        },
        params
      });
    } catch (error) {
      log.error(error);
    }
  }
}
