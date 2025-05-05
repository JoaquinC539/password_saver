import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI",{
    // two way communication
    invoke:(channel:string,data:unknown)=>ipcRenderer.invoke(channel,data),
    // one way communication
    send:(channel:string,data:unknown)=>ipcRenderer.send(channel,data),
    // recieve to listen to main process
    receive:(channel: string,func: (arg0: any) => void)=>{
        ipcRenderer.on(channel,(_event, ...args)=>func(args))
    }
})