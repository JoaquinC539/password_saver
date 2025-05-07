import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { PasswordService } from '../services/password.service';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { PasswordDTO } from '../interfaces/data';

@Component({
  selector: 'app-new-password',
  imports: [RouterLink,ReactiveFormsModule],
  templateUrl: './new-password.component.html',
  styleUrl: './new-password.component.scss'
})
export class NewPasswordComponent {
  errorMessage=signal<string>("");
  passworldField=signal<string>("password");
  newPasswordForm=new FormGroup({
    name:new FormControl("",[Validators.required,Validators.pattern(/^[a-zA-Z0-9#$%]+$/)]),
    username:new FormControl("",[Validators.required,Validators.pattern(/^[a-zA-Z0-9#$%]+$/)]),
    password:new FormControl("",[Validators.required,Validators.pattern(/^[a-zA-Z0-9#$%]+$/)]),
    notes:new FormControl(""),
  })

  constructor(private passwordService:PasswordService,private router:Router){}

  togglePassword(){
    this.passworldField.update((val:string)=>val==="password"?"text":"password")
  }
  onSubmit(event:SubmitEvent){
    event.preventDefault();
    this.errorMessage.set("");
    console.log("submit")
    const formValue=this.newPasswordForm.value;
    if(this.newPasswordForm.invalid){
      this.errorMessage.set("Form invalid only allowed letters, numbers and #$% characters and must not be empty the first three fields")
      return;
    }
    const password:PasswordDTO={
      name: formValue.name || "",
      username: formValue.username||'',
      password:  formValue.password||'',
      notes:formValue.notes ?? ""
    }
    this.newPasswordForm.reset();
    console.log(password)
    this.passwordService.addPassword(password)
    .then((res)=>{
      if(res.error){
        this.errorMessage.set("Error adding password reboot the app");
      }else{
        this.router.navigate(["/manager"])
      }

    })
    
  }
}
