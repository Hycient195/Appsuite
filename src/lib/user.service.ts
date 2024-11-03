// lib/userService.ts
import UserModel, { IUserModel } from '@/models/user.model';
import dbConnect from './mongodb';

export async function upsertUser(user: IUserModel) {
  await dbConnect();

  const existingUser = await UserModel.findOne({ id: user.id });

  if (existingUser) {
    existingUser.updatedAt = new Date();
    await existingUser.save();
    return { user: existingUser, created: false };
  } else {
    const newUser = new UserModel(user);
    await newUser.save();
    return { user: newUser, created: true };
  }
}