import crypto from 'crypto';
import { env } from '../config/env.js';

const MAX_AUTH_AGE_SECONDS = 24 * 60 * 60;

/**
 * Validates Telegram WebApp initData per:
 * https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app
 */
export const validateInitData = (initData) => {
  if (!initData || typeof initData !== 'string') {
    throw new Error('initData topilmadi');
  }

  const params = new URLSearchParams(initData);
  const hash = params.get('hash');
  if (!hash) {
    throw new Error('initData imzosi (hash) topilmadi');
  }
  params.delete('hash');

  const dataCheckString = [...params.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');

  const secretKey = crypto.createHmac('sha256', 'WebAppData').update(env.botToken).digest();
  const computedHash = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

  if (computedHash !== hash) {
    throw new Error("initData imzosi noto'g'ri");
  }

  const authDate = Number(params.get('auth_date'));
  if (!authDate || Date.now() / 1000 - authDate > MAX_AUTH_AGE_SECONDS) {
    throw new Error("initData muddati o'tgan");
  }

  const userJson = params.get('user');
  if (!userJson) {
    throw new Error('initData ichida foydalanuvchi maʼlumoti yoʻq');
  }

  const telegramUser = JSON.parse(userJson);

  return {
    telegramId: String(telegramUser.id),
    firstName: telegramUser.first_name,
    lastName: telegramUser.last_name,
    username: telegramUser.username,
    photoUrl: telegramUser.photo_url,
    languageCode: telegramUser.language_code,
  };
};

/**
 * Dev-only helper: accepts a plain mock user object instead of real initData,
 * so the auth flow can be exercised outside Telegram during local development.
 */
export const parseMockUser = (mockUser) => {
  if (!mockUser || !mockUser.id) {
    throw new Error("mockUser.id talab qilinadi");
  }

  return {
    telegramId: String(mockUser.id),
    firstName: mockUser.first_name || 'Test',
    lastName: mockUser.last_name || 'User',
    username: mockUser.username || 'testuser',
    photoUrl: mockUser.photo_url || null,
    languageCode: mockUser.language_code || 'uz',
  };
};
