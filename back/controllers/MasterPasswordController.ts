
import { ipcMain } from "electron";
import { MasterPasswordService } from "../services/MasterPasswordService";
import { genericJsonObject } from "../interfaces/data";

export class MasterPasswordController{
    private static masterPassService:MasterPasswordService=MasterPasswordService.getInstance();
    public static async getMasterCount():Promise<number | null>{
        return this.masterPassService.getMasterPasswordCount()
    }
    public static async setMasterPassword(password:string):Promise<genericJsonObject>{
        const inserted= await this.masterPassService.insertMasterPassword(password);
        const message:genericJsonObject={
            error:!inserted
        }
        return message;
    }
    public static async doLogin(password:string):Promise<genericJsonObject>{
        const samePassword=await this.masterPassService.makeLoginComparission(password);
        if(samePassword===null){
            const errM:genericJsonObject={
                error:true,
                errorMessage:"An error looking for the password happened, reset the program"
            }
            return errM;
        }
        const res:genericJsonObject={
            error: false,            
            authenticated:samePassword
        }
        return res;
    }
    public static getHandlers():void{        
       ipcMain.handle("get-master-count",()=>this.getMasterCount());
       ipcMain.handle("setMaster",async (_event,data:string)=>this.setMasterPassword(data));
       ipcMain.handle("login",(_,password)=>this.doLogin(password))
       
    }
     
}