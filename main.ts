import { app, BrowserWindow } from "electron";
import { electron } from "process";
const path=require("path");
require("electron-reload")(__dirname,{
    electron:require(`${__dirname}/node_modules/electron`)
})

function createWindow(){
    const win:BrowserWindow=new BrowserWindow({
        width:800,
        height:600,
        webPreferences:{
            preload: path.join(__dirname,"preload.js"),
            contextIsolation:true
        }
    });
    // DEV CArgar angular en modo desarrollo 
    win.loadURL("http://localhost:4200")
    // win.loadFile("./index.html");
}
app.whenReady().then(createWindow)
