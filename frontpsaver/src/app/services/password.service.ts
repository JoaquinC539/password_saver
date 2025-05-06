import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PasswordService {
  isElectron:boolean=!!(window && window.electronAPI);
  constructor() { }
  public getMasterCount(){
    if(!this.isElectron) throw new Error("Not correct platform");
    return window.electronAPI.invoke("get-master-count","")
  }
  public setMasterPassword(password:string){
    if(!this.isElectron) throw new Error("Not correct platform");
    return window.electronAPI.invoke("setMaster",password)
  }
  public login(password:string){
    if(!this.isElectron) throw new Error("Not correct platform");
    return window.electronAPI.invoke("login",password);
  }
}
