import { Request, Response } from 'express';
import { clerkClient } from '../index';

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  const userSettings = req.body;
  const userId = req.params.userId;

  if (!userId) return;
  try {
    const user = await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        userType: userSettings.publicMetaData.userType,
        settings: userSettings.publicMetaData.settings,
      },
    });
    res.status(202).json({ data: user });
    return;
  } catch (error) {
    res.status(202).json({ message: 'User update Failed Server Error', error });
    return;
  }
};
