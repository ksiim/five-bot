export interface IUser{
  id: number,
  username:string,
  energy: number,
  balance:number
}

export interface UserProps{
  data: IUser
  setUser: (user: IUser) => void;
}