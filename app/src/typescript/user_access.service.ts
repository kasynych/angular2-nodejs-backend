import { Injectable } from "@angular/core";
import { Http } from "@angular/http";

import "rxjs/add/operator/toPromise";

import { CrudService } from "./crud_service";
import { UserAccess } from "./user_access";
import { Response } from  "./response";

@Injectable()
export class UserAccessService extends CrudService{
  protected url : string = "/api/user_accesses";
  
  constructor (protected http: Http){super(http);}

  getUserAccesses(): Promise<UserAccess[]> {
    return this.http.get(this.url)
    .toPromise()
    .then(response => response.json() as UserAccess[])
    .catch(this.handleError);
  }

  getUserAccess(user_access_id:number): Promise<UserAccess> {
    return this.http.get(this.url+'/user_access?user_access_id='+user_access_id)
               .toPromise()
               .then(response => response.json() as UserAccess)
               .catch(this.handleError);
  }

  create(user_access: UserAccess): Promise<Response> {
    return this.http
      .post(this.url, JSON.stringify(user_access), {headers: this.headers})
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }

  update(user_access: UserAccess): Promise<Response> {
    return this.http
      .put(this.url, JSON.stringify(user_access), {headers: this.headers})
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }
}