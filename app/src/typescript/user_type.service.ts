import { Injectable }    from '@angular/core';
import { Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { CrudService } from "./crud_service";
import { Response } from './response';

@Injectable()
export class UserTypeService extends CrudService {

  protected url : string = 'api/user_types';  // URL to web api

  constructor(protected http: Http) { super(http); }

  getUserTypes(): Promise<any> {
    return this.http.get(this.url)
               .toPromise()
               .then(response => response.json())
               .catch(this.handleError);
  }
}