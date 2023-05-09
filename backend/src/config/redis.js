const { createClient } = require('redis');

const client = createClient(process.env.REDIS_PORT || 6379);

(async () => {
  await client.connect();
})();

client.on('connect', () => {
  console.log('redis connect');
});

client.on('error', (err) => console.log('Redis Client Error', err));

module.exports = client;
