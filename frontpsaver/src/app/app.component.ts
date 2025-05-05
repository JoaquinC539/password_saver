import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HelloService } from './services/hello.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  title = 'frontpsaver';
  constructor(private helloService:HelloService){

  }
  
  ngOnInit(): void {
      this.helloService.greet("Steve")
      .then((value:string)=>console.log(value))
  }
}
