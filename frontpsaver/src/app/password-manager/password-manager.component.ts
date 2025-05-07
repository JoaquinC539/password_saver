import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { PasswordService } from '../services/password.service';
import { RouterLink } from '@angular/router';
import { Password, PasswordShow } from '../interfaces/data';
import dayjs from "dayjs";

@Component({
  selector: 'app-password-manager',
  imports: [RouterLink],
  templateUrl: './password-manager.component.html',
  styleUrl: './password-manager.component.scss'
})
export class PasswordManagerComponent implements OnInit {
  errorMessage:WritableSignal<string>=signal<string>("");
  passwords:WritableSignal<PasswordShow[]>=signal<PasswordShow[]>([])


  constructor(private passwordService:PasswordService){}
  ngOnInit(): void {
      this.passwordService.getPasswords()
      .then((data)=>{
        if(data.error){
          this.errorMessage.set("Error in getting passwords, restart the app")
          return;
        }
        const dataWithShow=(data.data as Password[]).map((password)=>({...password,show:false}))
        this.passwords.set(dataWithShow);
      })
      .catch((error)=>this.errorMessage.set("Error getting passwords: "+error))
  }
  dateParse(date:string|Date){
    return dayjs(date).format("DD/MM/YYYY")
  }

}
