import { Injectable } from "@angular/core";
import { Http } from "@angular/http";

import "rxjs/add/operator/toPromise";

import { CrudService } from "./crud_service";
import { UniversalString} from "./universal_string";
import { Response } from "./response";
@Injectable()
export class UniversalStringService extends CrudService{
  protected url:string = "/api/universal_strings";

  constructor(protected http: Http){super(http);}

  create(string: UniversalString): Promise<Response> {
    return this.http
            .post(this.url, JSON.stringify(string), {headers: this.headers})
            .toPromise()
            .then(res => {
              return res.json() as Response
            })
            .catch(this.handleError);
  }
}