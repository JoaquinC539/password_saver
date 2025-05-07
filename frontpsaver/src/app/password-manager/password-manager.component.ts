import { Component, OnInit, signal } from '@angular/core';
import { PasswordService } from '../services/password.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-password-manager',
  imports: [RouterLink],
  templateUrl: './password-manager.component.html',
  styleUrl: './password-manager.component.scss'
})
export class PasswordManagerComponent implements OnInit {
  errorMessage=signal<string>("");

  constructor(private passwordService:PasswordService){}
  ngOnInit(): void {
      this.passwordService.getPasswords()
      .then((data)=>console.log(data))
  }

}
