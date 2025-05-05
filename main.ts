import { app, BrowserWindow } from "electron";
import { DB } from "./back/db";
import { HelloController } from "./back/controllers/HelloController";
const path=require("path");

function createWindow(){
    const win:BrowserWindow=new BrowserWindow({
        width:800,
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

app.whenReady().then(()=>{
    const db:DB=new DB();
    db.checkOrCreateDB();
    db.createOrCheckTables();
    HelloController.GetHandlers();
    createWindow();
})
