import {  pbkdf2Sync, randomBytes } from "crypto";
import { DB } from "../db";
import { DBCountResult, MasterPassword } from "../interfaces/data";
import bcrypt from "bcrypt"
export class MasterPasswordService {
    private static instance: MasterPasswordService;
    private db: DB = DB.getDB();
    
    private encryptKey:string="";


    private constructor() { }

    public static getInstance(): MasterPasswordService {
        if (!MasterPasswordService.instance) {
            MasterPasswordService.instance = new MasterPasswordService();
        }
        return MasterPasswordService.instance;
    }
    public async getMasterPasswordCount(): Promise<number | null> {
        const sqlScript = `
        SELECT COUNT(*)
        FROM mainPassword;
        `
        const result = await this.db.execQueryReturn<DBCountResult>(sqlScript);
        if (result === null) return null;
        if (result.length === 0) {
            return 0;
        }

        return result[0]["COUNT(*)"];
    }
    private generateEncryptKey(password:string,salt:string):string{
        const encryptionKey = pbkdf2Sync(
                password,
                salt,
                600000,
                32,
                'sha512'
            );
            
        return encryptionKey.toString("base64");;
    }
    public async insertMasterPassword(password: string): Promise<boolean | null> {
        try {
            const keySalt = randomBytes(32).toString('base64');            
            const saltRounds = 10;
            const salt = bcrypt.genSaltSync(saltRounds);
            const hashPassword = bcrypt.hashSync(password, salt);
            const sqlScript = `
                INSERT INTO mainPassword (password_hash,key_salt) VALUES (?,?);
            `;
            const inserted = await this.db.preparedQuery(sqlScript, hashPassword,keySalt);            
            this.encryptKey=this.generateEncryptKey(password,keySalt);
            return inserted;
        } catch (error) {
            return null;
        }

    }
    public async makeLoginComparission(password: string): Promise<boolean | null> {
        const sqlScript = `
        SELECT * FROM mainPassword;
        `;
        try {
            const res = await this.db.execQueryReturn<MasterPassword>(sqlScript);
            if (res === null) return null;
            const hashPassword = res[0]["password_hash"];

            const samePassword = bcrypt.compareSync(password, hashPassword);
            if(samePassword){
                this.encryptKey=this.generateEncryptKey(password,res[0].key_salt);
            }
            return samePassword;
        } catch (error) {
            return null;
        }

    }
    public getEncryptKey(): string {
        if (!this.encryptKey) {
            throw new Error("Encryption key not initialized. Did you log in?");
        }
        return this.encryptKey;
    }
}