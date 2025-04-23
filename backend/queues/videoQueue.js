import { Queue } from 'bullmq';
import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config(); 

// ✅ Create Redis connection using ioredis
const connection = new Redis({
    host: process.env.REDIS_HOST, 
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
    maxRetriesPerRequest: null, // 🔥 Important: Prevent Redis conflicts
});

connection.on("error", (err) => console.error("\t❌ Redis Error:", err));
connection.on("connect", () => console.log("\t✅ Redis Connected (Queue)"));

const videoQueue = new Queue("videoQueue", { connection });

videoQueue.on("completed", (job) => {
    console.log(`\t✅ Job ${job.id} completed`);
});

videoQueue.on("failed", (job, err) => {
    console.error(`\t❌ Job ${job.id} failed:`, err);
});

export default videoQueue;
