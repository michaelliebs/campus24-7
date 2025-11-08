export interface IUserSignup {
  name: string;
  email: string;
  password: string;
  status?: string;
  major?: string;
  bio?: string;
}

export interface IUserLogin {
  email: string;
  password: string;
}
