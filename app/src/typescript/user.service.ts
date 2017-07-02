import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { CrudService } from "./crud_service";
import { List } from './list';
import { User } from './user';
import { Response } from './response';

@Injectable()
export class UserService extends CrudService {

  protected url : string = 'api/users';  // URL to web api

  constructor(protected http: Http) { super(http); }

  getUsers(page:number): Promise<List> {
    return this.http.get(this.url+'?page='+page)
               .toPromise()
               .then(response => response.json() as List)
               .catch(this.handleError);
  }
  getUser(user_id:number): Promise<User> {
    return this.http.get(this.url+'/user?user_id='+user_id)
               .toPromise()
               .then(response => response.json() as User)
               .catch(this.handleError);
  }

  create(user: User): Promise<Response> {
    return this.http
      .post(this.url, JSON.stringify(user), {headers: this.headers})
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }

  update(user: User): Promise<Response> {
    return this.http
      .put(this.url, JSON.stringify(user), {headers: this.headers})
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }
}
