import { Injectable } from "@angular/core";
import { ServiceBase } from "./service_base";

import "rxjs/add/operator/toPromise";

import { LoginInfo } from "./login_info";
import { Response } from "./response";

@Injectable()
export class AuthenticationService extends ServiceBase{
  protected url : string = '/authentication';  // URL
  login(login_info: LoginInfo): Promise<Response> {
    return this.http.post(this.url+'/login', JSON.stringify(login_info), {headers: this.headers})
          .toPromise()
          .then(response => response.json() as Response)
          .catch(this.handleError);
  }

  logout(): Promise<Response> {
    return this.http.get(this.url+'/logout')
          .toPromise()
          .then(response => response.json() as Response)
          .catch(this.handleError);
  }
}