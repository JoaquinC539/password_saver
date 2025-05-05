import { app, BrowserWindow } from "electron";
const path=require("path");

function createWindow(){
    const win:BrowserWindow=new BrowserWindow({
        width:800,
        height:600,
        webPreferences:{
            preload: path.join(__dirname,"preload.js"),
            contextIsolation:true
        }
    });
    win.loadFile("./index.html");
}
app.whenReady().then(createWindow)
