import { Component, OnInit } from '@angular/core';
import {  Router, RouterOutlet } from '@angular/router';
import { HelloService } from './services/hello.service';
import { PasswordService } from './services/password.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  title = 'frontpsaver';
  constructor(private helloService:HelloService,private passwordService:PasswordService,private router:Router){

  }
  
  ngOnInit(): void {  
      this.passwordService.getMasterCount()
    .then((res)=>{
      console.log(res);
      if(!res){
        this.router.navigate(["/new"])
      }else{
        this.router.navigate(["/login"])
      }
    })
  }
}
