import { ipcMain } from "electron";

export class HelloController{

    public static sayHello(name:string){
        console.log("Hello from Angular: ",name);
        return `Hello back from Electron ${name}`;
    }
    public static GetHandlers():void{
        ipcMain.handle("say-hello",(_event,name:string)=>this.sayHello(name))
    }

}