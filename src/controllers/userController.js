import bcrypt from 'bcryptjs';
import User from '../models/User.js';

export const getCurrentUser = async (req, res) => {
  res.status(200).json({ user: req.user });
};

export const updateProfile = async (req, res) => {
  const { name, avatarUrl } = req.body;
  const user = req.user;

  if (typeof name === 'string' && name.trim()) user.name = name.trim();
  if (typeof avatarUrl === 'string') user.avatarUrl = avatarUrl;

  await user.save();
  res.status(200).json({ user });
};

/**
 * Sets a new password. Requires the current password if the account already
 * has one; Google-only accounts (no password yet) can set one without it.
 */
export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!newPassword || newPassword.length < 6) {
    res.status(400);
    throw new Error("Yangi parol kamida 6 ta belgidan iborat bo'lishi kerak");
  }

  const user = await User.findById(req.user._id).select('+passwordHash');

  if (user.passwordHash) {
    if (!currentPassword) {
      res.status(400);
      throw new Error('Joriy parolni kiriting');
    }
    const match = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!match) {
      res.status(401);
      throw new Error("Joriy parol noto'g'ri");
    }
  }

  user.passwordHash = await bcrypt.hash(newPassword, 10);
  user.authProvider = user.googleId ? 'both' : 'local';
  await user.save();

  res.status(200).json({ message: 'Parol yangilandi' });
};
