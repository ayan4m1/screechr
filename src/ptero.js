import axios from 'axios';

import configs from './config';

const { pterodactyl: config } = configs;

export default class Pterodactyl {
  constructor() {
    this.client = axios.create({
      baseURL: 
    })
  }
  getServers() {
    axios.get('', {});
  }

  _makeRequest(url, params) {
    axios.get(url, {

    })
  }
}
