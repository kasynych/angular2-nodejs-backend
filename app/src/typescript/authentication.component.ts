import {Component} from '@angular/core';
//import $ from 'jquery';

import { LoginInfo } from "./login_info";
import { AuthenticationService } from "./authentication.service";
import { ComponentBase } from "./component_base";

@Component({
  selector: 'login',
  templateUrl: 'partials/login.html',
  providers: [ AuthenticationService ]
})

export class AuthenticationComponent extends ComponentBase{
  login_info: LoginInfo = new LoginInfo();
  constructor(private service: AuthenticationService ){super();}

  login(e: Event): void{
    this.service.login(this.login_info)
      .then(response => {
        if(typeof response.error != 'undefined'){
          this.message.error(response.error);
        }else{
          this.message.success(response.success);
        }
      });
  }
  
  onInit(){
    
  }
}
