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