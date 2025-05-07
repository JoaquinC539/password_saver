import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { PasswordService } from '../services/password.service';
import { RouterLink } from '@angular/router';
import { Password, PasswordShow } from '../interfaces/data';
import dayjs from "dayjs";
import { ScreenLoaderComponent } from '../screen-loader/screen-loader.component';

@Component({
  selector: 'app-password-manager',
  imports: [RouterLink,ScreenLoaderComponent],
  templateUrl: './password-manager.component.html',
  styleUrl: './password-manager.component.scss'
})
export class PasswordManagerComponent implements OnInit {
  loading=signal<boolean>(false);
  errorMessage:WritableSignal<string>=signal<string>("");
  passwords:WritableSignal<PasswordShow[]>=signal<PasswordShow[]>([])


  constructor(private passwordService:PasswordService){}
  getPasswords(){
    this.loading.set(true)
    this.passwordService.getPasswords()
      .then((data)=>{
        if(data.error){
          this.errorMessage.set("Error in getting passwords, restart the app")
          this.loading.set(false);
          return;
        }
        const dataWithShow=(data.data as Password[]).map((password)=>({...password,show:false}))
        this.passwords.set(dataWithShow);
        this.loading.set(false);
      })
      .catch((error)=>this.errorMessage.set("Error getting passwords: "+error))
  }
  ngOnInit(): void {
      this.getPasswords();
  }
  dateParse(date:string|Date){
    return dayjs(date).format("DD/MM/YYYY")
  }
  deletePassword(id:number){
    this.loading.set(true)
    this.passwordService.deletePassword(id)
    .then((res)=>{
      if(res.error) this.errorMessage.set("Error deleting password");
      else this.getPasswords();

    })
  }

}
