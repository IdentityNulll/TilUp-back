import User from '../models/User.js';
import { signToken } from '../utils/jwt.js';
import { validateInitData, parseMockUser } from '../services/telegramAuthService.js';
import { isProduction } from '../config/env.js';

export const loginWithTelegram = async (req, res) => {
  const { initData, mockUser } = req.body;

  let telegramProfile;
  if (!isProduction && mockUser) {
    telegramProfile = parseMockUser(mockUser);
  } else {
    telegramProfile = validateInitData(initData);
  }

  let user = await User.findOne({ telegramId: telegramProfile.telegramId });
  let isNewUser = false;

  if (!user) {
    user = await User.create(telegramProfile);
    isNewUser = true;
  } else {
    user.firstName = telegramProfile.firstName;
    user.lastName = telegramProfile.lastName;
    user.username = telegramProfile.username;
    user.photoUrl = telegramProfile.photoUrl;
    user.languageCode = telegramProfile.languageCode;
    await user.save();
  }

  const token = signToken(user._id);

  res.status(200).json({ token, user, isNewUser });
};
