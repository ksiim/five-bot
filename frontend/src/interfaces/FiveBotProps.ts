import {IUser} from './User.ts'

export interface FiveBotProps {
  data: IUser;
  setUser: (user: IUser) => void;
}