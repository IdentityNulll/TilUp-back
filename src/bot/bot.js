import { Telegraf, Markup } from 'telegraf';
import { env } from '../config/env.js';

let bot = null;

const stopBot = (signal) => {
  if (!bot) return;
  bot.stop(signal);
};

export const startBot = () => {
  if (!env.botToken) {
    console.warn('BOT_TOKEN topilmadi — Telegram bot ishga tushirilmadi.');
    return null;
  }

  bot = new Telegraf(env.botToken);

  bot.start((ctx) =>
    ctx.reply(
      "Assalomu alaykum! TilUp — ingliz tili sertifikatiga (C dan A+ gacha) tayyorgarlik ko'rish uchun ilova.\n\nBoshlash uchun quyidagi tugmani bosing 👇",
      Markup.inlineKeyboard([Markup.button.webApp('🚀 Ilovani ochish', env.webAppUrl)])
    )
  );

  bot.catch((err) => {
    console.error('Telegram bot xatosi:', err.message);
  });

  console.log('Bot launching polling...');
  // dropPendingUpdates avoids replaying stale /start commands after a redeploy
  // and reduces 409 conflicts when an old instance is still winding down.
  bot
    .launch({ dropPendingUpdates: true })
    .catch((err) => {
      console.error('Bot polling error:', err.message);
      process.exit(1);
    });

  // Polling started (launch doesn't return until it stops)
  console.log(`✓ Bot polling active (WebApp: ${env.webAppUrl})`);

  process.once('SIGINT', () => {
    stopBot('SIGINT');
    process.exit(0);
  });
  process.once('SIGTERM', () => {
    stopBot('SIGTERM');
    process.exit(0);
  });
  process.once('SIGUSR2', () => {
    stopBot('SIGUSR2');
    process.kill(process.pid, 'SIGUSR2');
  });

  return bot;
};
