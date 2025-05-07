// types/database.ts
export interface genericJsonObject {
  error: boolean;

  [key: string]: number | string | boolean|any[]|{[key:string]:any};
}
export interface DBCountResult {
  'COUNT(*)': number;
}

export interface DBError {
  message: string;
  code?: string;
}
export interface MasterPassword{
  id:number;
  password_hash:string;  
  key_salt:string;  
  enforce_single_row:number;
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
