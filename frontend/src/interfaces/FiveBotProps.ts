import {IUser} from './User.ts'
import React from 'react';

export interface FiveBotProps {
  data: IUser;
  setUser: React.Dispatch<React.SetStateAction<IUser>>;
}