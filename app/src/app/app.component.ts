import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app',
  template: `
    <h1>{{title}}</h1>
    <router-outlet></router-outlet>
  `
})
export class AppComponent{
  title:string = '';

  constructor(){
    this.title = 'App';
  }
}