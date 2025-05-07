import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import { PasswordService } from '../services/password.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-new-master',
  imports: [ReactiveFormsModule],
  templateUrl: './new-master.component.html',
  styleUrl: './new-master.component.scss'
})
export class NewMasterComponent {
  errorMessage:string="";
  successMessage:string="";
  newPasswordForm=new FormGroup({
    newPassword:new FormControl("",[Validators.required,Validators.pattern(/^[a-zA-Z0-9#$%]+$/)]),
    retypedPassWord:new FormControl("",[Validators.required,Validators.pattern(/^[a-zA-Z0-9#$%]+$/)])
  })

  constructor(private passwordService:PasswordService,private router:Router){}

  onSubmit(event:SubmitEvent):void{
    this.errorMessage="";
    this.successMessage=""
    event.preventDefault();
    const formValue=this.newPasswordForm.value;
    if(this.newPasswordForm.invalid){
      this.errorMessage="Password(s) are invalid only allowed letters, numbers and #$% characters and must not be empty";
      return;
    }
    if(formValue.newPassword!==formValue.retypedPassWord){
      this.errorMessage="Passwords are not the same";
      return;
    }
    if(formValue?.newPassword){
      this.passwordService.setMasterPassword(formValue?.newPassword )
      .then((response)=>{
        console.log(response)
        if(!response.error){
          this.successMessage="Master password added sucessfull. This password will be asked everytime the program is opened \n Redirecting to password manager in 5 seconds";
          this.newPasswordForm.setValue({newPassword:"",retypedPassWord:""});
          setTimeout(()=>{
            this.router.navigate(["/manager"]);
          },5000)
        }else{
          this.errorMessage="Master password could not be added close the program and retry it. Delete .db file is that doesn't work"
        }
      })
    }
    
    
  }
}
