import { app, BrowserWindow } from "electron";
import { DB } from "./back/db";
import { HelloController } from "./back/controllers/HelloController";
import { MasterPasswordController } from "./back/controllers/MasterPasswordController";
import { MasterPasswordService } from "./back/services/MasterPasswordService";
import { PasswordsService } from "./back/services/PasswordsService";
const path=require("path");

function createWindow(){
    const win:BrowserWindow=new BrowserWindow({
        width:400,
        height:600,
        webPreferences:{
            preload: path.join(__dirname,"preload.js"),
            contextIsolation:true,
            nodeIntegration : false
        }
    });
    // DEV CArgar angular en modo desarrollo 
    win.loadURL("http://localhost:4200")
    // win.loadFile("./index.html");
}

app.whenReady().then(async ()=>{
    const db:DB=DB.getDB();

    db.checkOrCreateDB();
    db.createOrCheckTables();
    HelloController.GetHandlers();
    MasterPasswordController.getHandlers();
   
      
    createWindow();
    
    
})
