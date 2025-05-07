import { DB } from "../db";
import {  Password, PasswordDTO, UpdatePayload } from "../interfaces/data";
import { decrypt, encrypt } from "./crypt";

import { MasterPasswordService } from "./MasterPasswordService";
export class PasswordsService {
    private static instance: PasswordsService;
    private db: DB = DB.getDB();
    private masterPasswordService:MasterPasswordService;
    private encyptKey:string="";
    private constructor() {
        this.masterPasswordService=MasterPasswordService.getInstance();
        
        
     }
    private  setAndGetEncryptKey():string{
        if(this.encyptKey){
            return this.encyptKey;
        }
        const encrypKey= this.masterPasswordService.getEncryptKey();
        this.encyptKey=encrypKey;
        return encrypKey;

    }
    public static getInstance(): PasswordsService {
        if (!PasswordsService.instance) {
            PasswordsService.instance = new PasswordsService();
        }
        return PasswordsService.instance;
    }
    public async getAllPasswords(): Promise<Password[] | null> {
        const sqlScript = `
        SELECT * FROM passwords;
        `;
        try {
            const key= this.setAndGetEncryptKey();
            const data = await this.db.execQueryReturn<Password>(sqlScript);
            const dataParsed:Password[]=[]
            if(data ){
                data.forEach((password)=>{
                    const decpss=decrypt(password.password,key);
                    dataParsed.push({...password,"password":decpss})
                })
            }
            return dataParsed;
        } catch (error) {
            console.error("An error ocurred getting passwords",error)
            return null;
        }
    }
    public async addPassword(password: PasswordDTO): Promise<boolean|null> {
        try {
            
            const columns = ['name','username', 'password'];
            const values = ['?', '?','?'];

            const encrypKey= this.setAndGetEncryptKey();
            const encryptedPassword=encrypt(password.password,encrypKey)
            const params:string[] = [password.name,password.username, encryptedPassword];            
            if (password.notes) {
                columns.push('notes');
                values.push('?');
                params.push(password.notes);
            }
            const sqlScript = `INSERT INTO passwords (${columns.join(',')}) VALUES (${values.join(',')})`;
            const inserted=await this.db.preparedQuery(sqlScript,...params)
            return inserted;
            }catch(err){
                console.error("Error adding password: ",err);
                return null;
            }
    }
    public async getSinglePasswordById(id:number):Promise<Password[] | null>{
        const sqlScript= `
        SELECT * FROM passwords 
        WHERE id = ?;
        `;
        try {
            const key= this.setAndGetEncryptKey();
            const password=await this.db.preparedQueryReturn<Password>(sqlScript,String(id))
            
            const dataParsed:Password[]=[]
            if(password ){
                password.forEach((password)=>{
                    const decpss=decrypt(password.password,key);
                    dataParsed.push({...password,"password":decpss})
                })
            }
            return dataParsed;  
        } catch (error) {
            console.error("An error ocurred getting password",error)
            return null;
        }
    }
    public async updatePassword(data:UpdatePayload):Promise<boolean|null>{
        try {
            const id=data.id;
            const password=data.password            
            const columns = ['name','username', 'password'];
            const encrypKey= this.setAndGetEncryptKey();
            const encryptedPassword=encrypt(password.password,encrypKey)
            const params:string[] = [password.name,password.username, encryptedPassword];            
            if (password.notes) {
                columns.push('notes');
                params.push(password.notes);
            }
            params.push(String(id));
            let joiner:string="";
            for(let i=0;i<columns.length;i++){
                if(i===columns.length-1){
                    joiner+=`${columns[i]}=?`
                }else{
                    joiner+=`${columns[i]}=?,`
                }
            }
            const sqlScript=`
                UPDATE passwords
                SET ${joiner}
                WHERE id=?;
            `;
            const updated=this.db.preparedQuery(sqlScript,...params);
            return updated
        } catch (error) {
            console.error("An error ocurred updating the record",error)
            return null;
        }
    }
    public async deletePassword(id:number):Promise<boolean|null>{
        const sqlScript=`
            DELETE FROM passwords
            WHERE id=?;
        `;
        try {
            const deleted= await this.db.preparedQuery(sqlScript,String(id));
            return deleted;
        } catch (error) {
            console.error("Error deletting password:",error)
            return null;
        }
    }
        

        
        
}