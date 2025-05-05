import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HelloService {
  isElectron:boolean=!!(window && window.electronAPI);
  constructor() { }


  public greet(name:string):Promise<string>{
    if(!this.isElectron) throw new Error("Not correct platform")
    return window.electronAPI.invoke("say-hello",name)

  }
}
