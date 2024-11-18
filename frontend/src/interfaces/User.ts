export interface IUser{
  username: string | null,
  telegram_id: number,
  balance: number,
  premium: boolean,
}

export interface UserProps{
  data: IUser
  setUser: (user: IUser) => void;
}