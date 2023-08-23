const winston = require('winston');

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf((info) => {
      return `${info.timestamp} [${info.level.toUpperCase()}]: ${info.message}`;
    })
  ),
});

module.exports = logger;
