import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PasswordService } from '../services/password.service';
import { LoginMaster } from '../interfaces/data';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  errorMessage=signal<string>("")
  loginForm=new FormGroup({
    password:new FormControl<string>("",[Validators.required]),
    
  })
  constructor(private passwordService:PasswordService,private router:Router){}

  onSubmit(event:SubmitEvent){
    event.preventDefault();
    this.errorMessage.set("");
    if(this.loginForm.invalid){
      this.errorMessage.set("Password is required");
    }
    if(this.loginForm.value.password!==undefined && this.loginForm.value.password!==null ){
      this.passwordService.login(this.loginForm.value.password)
      .then((res)=>{
        if((res as LoginMaster).error){this.errorMessage.set("An error looking for the password happened, reset the program");return;}
        if(!(res as LoginMaster).authenticated){this.errorMessage.set("Incorrect password");return;}
        this.router.navigate(["/manager"])
        
      })
      
    }
    



  }
}
