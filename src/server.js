import app from './app.js';
import { connectDB } from './config/db.js';
import { env } from './config/env.js';
import { startBot } from './bot/bot.js';

const start = async () => {
  await connectDB();
  app.listen(env.port, () => {
    console.log(`TilUp server running on port ${env.port}`);
  });
  startBot();
};

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
