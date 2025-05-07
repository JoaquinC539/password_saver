import { ipcMain } from "electron";
import { genericJsonObject, PasswordDTO, UpdatePayload } from "../interfaces/data";
import { PasswordsService } from "../services/PasswordsService";

export class PasswordController{
    private static passwordService:PasswordsService=PasswordsService.getInstance();
    public static async getAllPasswords():Promise<genericJsonObject>{
        const passwords=await this.passwordService.getAllPasswords();
        if(passwords===null){
            return {
                error:true,
                errorMessage:"Passwords couldn't be fetched"
            }
        }else{
            return {
                error:false,
                data:passwords
            }
        }
    }
// 
    public static async addPassword(password:PasswordDTO):Promise<genericJsonObject>{
        const inserted=await this.passwordService.addPassword(password);
        if(inserted===null){
            return {
                error:true,
                errorMessage:"Password could not be added"
            }
        }else{
            return {
                error:false,
                added:inserted
            }
        }
    }
    public static async getPasswordId(id:number):Promise<genericJsonObject>{
        const password=await this.passwordService.getSinglePasswordById(id);
        if(password===null){
            return {
                error:true,
                errorMessage:"Passwords couldn't be fetched"
            }
        }else{
            return {
                error:false,
                data:password
            }
        }
    }
    public static async updatePassword(data:UpdatePayload):Promise<genericJsonObject>{
        const updated=await this.passwordService.updatePassword(data);
        if(updated===null){
            return {
                error:true,
                errorMessage:"Password could not be added"
            }
        }else{
            return {
                error:false,
                added:updated
            }
        }
    }
    public static async deletePassword(id:number):Promise<genericJsonObject>{
        const deleted=await this.passwordService.deletePassword(id);
        if(deleted===null){
            return {
                error:true,
                errorMessage:"Password could not be added"
            }
        }else{
            return {
                error:false,
                added:deleted
            }
        }
    }
    public static getHandlers(){
        ipcMain.handle("getPasswords",()=>this.getAllPasswords());
        ipcMain.handle("addPassword",(_,password:PasswordDTO)=>this.addPassword(password));
        ipcMain.handle("getPassword",(_,id:number)=>this.getPasswordId(id));
        ipcMain.handle("updatePassword",(_,data:UpdatePayload)=>{this.updatePassword(data)});
        ipcMain.handle("deletePassword",(_,id:number)=>this.deletePassword(id))
    }

}