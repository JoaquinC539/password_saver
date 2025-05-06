import { DB } from "../db";
import { DBCountResult, MasterPassword } from "../interfaces/data";
import bcrypt from "bcrypt"
export class MasterPasswordService{
    private static instance:MasterPasswordService;
    private  db:DB=DB.getDB();

    private constructor(){}

    public static getInstance():MasterPasswordService{
        if(!MasterPasswordService.instance){
            MasterPasswordService.instance=new MasterPasswordService();
        }
        return MasterPasswordService.instance;
    }
    public async getMasterPasswordCount():Promise<number | null>{
        const sqlScript=`
        SELECT COUNT(*)
        FROM mainPassword;
        `
        const result=await this.db.execQueryReturn<DBCountResult>(sqlScript);
        if(result===null) return null;
        if(result.length===0){
            return 0;
        }
        
        return result[0]["COUNT(*)"];
    }
    public async insertMasterPassword(password:string):Promise<boolean>{
        const saltRounds=10;
        const salt=bcrypt.genSaltSync(saltRounds);
        const hashPassword=bcrypt.hashSync(password,salt);        
        const sqlScript=`
        INSERT INTO mainPassword (password) VALUES (?);
        `
       await this.db.preparedQuery(sqlScript,hashPassword); 
        return true;
    }
    public async makeLoginComparission(password:string):Promise<boolean|null>{
        const sqlScript=`
        SELECT * FROM mainPassword;
        `;
        try {
            const res=await this.db.execQueryReturn<MasterPassword>(sqlScript);
            if(res===null) return null;
            const hashPassword=res[0]["password"];
            const samePassword=bcrypt.compareSync(password,hashPassword);
            return samePassword;
        } catch (error) {
            return null;
        }
        
    }
}