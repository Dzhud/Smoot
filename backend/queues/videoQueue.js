const { Queue } = require("bullmq");
const Redis = require("ioredis");

// ✅ Create Redis connection using ioredis
const connection = new Redis({
    host: "127.0.0.1", // Ensure this matches your Redis setup
    port: 6379,
    maxRetriesPerRequest: null, // 🔥 Important: Prevent Redis conflicts
});

connection.on("error", (err) => console.error("\t❌ Redis Error:", err));
connection.on("connect", () => console.log("\t✅ Redis Connected (Queue)"));

const videoQueue = new Queue("videoQueue", { connection });

module.exports = videoQueue;
