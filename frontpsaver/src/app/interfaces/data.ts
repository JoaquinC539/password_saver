export interface LoginMaster{
    error:boolean;
    authenticated:boolean;
  }

  export interface Password{
    id:number;
    name:string;
    username:string;
    password:string;
    notes:string;
    created_at:Date;
  }
  export interface Password{
    id:number;
    name:string;
    username:string;
    password:string;
    notes:string;
    created_at:Date;
  }
  export interface PasswordDTO{
    name:string;
    username:string;
    password:string;
    notes?:string;
  }
export interface UpdatePayload{
  id:number;
  password:PasswordDTO;
}