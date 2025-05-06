// types/database.ts
export interface genericJsonObject {
  error: boolean;

  [key: string]: number | string | boolean;
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
  password:string;
  enforce_single_row:number;
}
