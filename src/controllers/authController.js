import bcrypt from 'bcryptjs';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.js';
import { signToken } from '../utils/jwt.js';
import { env } from '../config/env.js';

const googleClient = new OAuth2Client(env.googleClientId);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const respondWithSession = (res, user, status = 200) => {
  res.status(status).json({ token: signToken(user._id), user });
};

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Ism, email va parol talab qilinadi');
  }
  if (!EMAIL_RE.test(email)) {
    res.status(400);
    throw new Error("Email formati noto'g'ri");
  }
  if (password.length < 6) {
    res.status(400);
    throw new Error("Parol kamida 6 ta belgidan iborat bo'lishi kerak");
  }

  const normalizedEmail = email.toLowerCase().trim();
  const existing = await User.findOne({ email: normalizedEmail });
  if (existing) {
    res.status(409);
    throw new Error('Bu email allaqachon roʻyxatdan oʻtgan');
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    passwordHash,
    authProvider: 'local',
  });

  respondWithSession(res, user, 201);
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Email va parol talab qilinadi');
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+passwordHash');
  if (!user || !user.passwordHash) {
    res.status(401);
    throw new Error(
      user && !user.passwordHash
        ? 'Bu hisob Google orqali yaratilgan. Google bilan kiring.'
        : "Email yoki parol noto'g'ri"
    );
  }

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) {
    res.status(401);
    throw new Error("Email yoki parol noto'g'ri");
  }

  respondWithSession(res, user);
};

export const googleLogin = async (req, res) => {
  const { credential } = req.body;
  if (!credential) {
    res.status(400);
    throw new Error('Google tokeni topilmadi');
  }
  if (!env.googleClientId) {
    res.status(500);
    throw new Error('GOOGLE_CLIENT_ID sozlanmagan');
  }

  let payload;
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: env.googleClientId,
    });
    payload = ticket.getPayload();
  } catch {
    res.status(401);
    throw new Error("Google tokeni yaroqsiz");
  }

  const { sub: googleId, email, name, picture } = payload;
  const normalizedEmail = email?.toLowerCase().trim();

  let user = await User.findOne({ googleId });
  if (!user && normalizedEmail) {
    // Link Google to an existing email account, or create a new one.
    user = await User.findOne({ email: normalizedEmail });
    if (user) {
      user.googleId = googleId;
      user.authProvider = user.passwordHash ? 'both' : 'google';
      if (!user.avatarUrl) user.avatarUrl = picture;
      await user.save();
    }
  }
  if (!user) {
    user = await User.create({
      googleId,
      email: normalizedEmail,
      name: name || 'Foydalanuvchi',
      avatarUrl: picture || null,
      authProvider: 'google',
    });
  }

  respondWithSession(res, user);
};
