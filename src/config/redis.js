const { createClient } = require("redis");

const redisHost = process.env.REDIS_HOST || "localhost";

const client = createClient({
  socket: {
    host: redisHost,
    port: 6379
  }
});

client.on("error", (err) => {
  console.error("Redis Error:", err);
});

client.connect();

module.exports = client;