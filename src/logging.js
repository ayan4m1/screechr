import { Container, format, transports } from 'winston';

import configs from './config';

const { combine, label, prettyPrint, printf, timestamp } = format;
const { logging: config } = configs;

const loggers = {};
const container = new Container();

const createLogger = (category, categoryLabel) => {
  let formatter = (data) => `[${data.level}][${data.label}] ${data.message}`;
  const formatters = [label({ label: categoryLabel })];

  if (config.timestamp !== false) {
    formatters.push(timestamp({ format: config.timestamp }));
    formatter = (data) =>
      `${data.timestamp} [${data.level}][${data.label}] ${data.message}`;
  }

  formatters.push(prettyPrint(), printf(formatter));
  container.add(category, {
    transports: [
      new transports.Console({
        format: combine.apply(null, formatters)
      })
    ]
  });

  return container.get(category);
};

export default (category, categoryLabel = category) => {
  if (!loggers[category]) {
    loggers[category] = createLogger(category, categoryLabel);
  }

  return loggers[category];
};
