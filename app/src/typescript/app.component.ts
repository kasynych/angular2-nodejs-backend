import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
//import $ from 'jquery';

@Component({
  selector: 'app',
  template: `
    <div class="row">
      <div class="col-sm-3 col-md-2 sidebar">
        <div id="navigation">Loading menu...</div>
      </div>
      <div class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
        <message></message>
  
        <router-outlet></router-outlet>
      </div>
    </div>
  `
})
export class AppComponent{
  message = '';
  info = '';
  error = '';
  constructor(){
  }
}