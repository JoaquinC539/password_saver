import { Component, OnInit, signal } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PasswordDTO } from '../interfaces/data';
import { PasswordService } from '../services/password.service';

@Component({
  selector: 'app-edit-password',
  imports: [RouterLink,ReactiveFormsModule],
  templateUrl: './edit-password.component.html',
  styleUrl: './edit-password.component.scss'
})
export class EditPasswordComponent  implements OnInit{
  passwordId=signal<number>(0);
  errorMessage=signal<string>("");
  passworldField=signal<string>("password");
  newPasswordForm=new FormGroup({
    name:new FormControl("",[Validators.required,Validators.pattern(/^[a-zA-Z0-9#$%]+$/)]),
    username:new FormControl("",[Validators.required,Validators.pattern(/^[a-zA-Z0-9#$%]+$/)]),
    password:new FormControl("",[Validators.required,Validators.pattern(/^[a-zA-Z0-9#$%]+$/)]),
    notes:new FormControl(""),
  })

  constructor(private passwordService:PasswordService,private router:Router,private route:ActivatedRoute){}

  ngOnInit(): void {
    const id=this.route.snapshot.paramMap.get("id")
    console.log(id)
   
  }

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
