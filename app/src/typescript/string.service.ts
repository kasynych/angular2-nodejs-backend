import { Injectable } from "@angular/core";
import { Http } from "@angular/http";

import "rxjs/add/operator/toPromise";

import { CrudService } from "./crud_service";
import { ProjectString } from "./string";
import { Response } from "./response";

@Injectable()
export class StringService extends CrudService{
  protected url:string = "/api/strings";

  constructor(protected http: Http){super(http);}

  getStrings(project_id: number): Promise<ProjectString[]> {
    return this.http.get(this.url+'?project_id='+project_id)
            .toPromise()
            .then(response => response.json() as ProjectString[])
            .catch(this.handleError);
  }

  getString(string_id: number): Promise<ProjectString> {
    return this.http.get(this.url+'/string?string_id='+string_id)
          .toPromise()
          .then(response => response.json() as ProjectString)
          .catch(this.handleError)
  }

  create(string: ProjectString): Promise<Response> {
    return this.http
      .post(this.url, JSON.stringify(string), {headers: this.headers})
      .toPromise()
      .then(res => res.json() as Response)
      .catch(this.handleError);
  }

  update(string: ProjectString): Promise<Response> {
    return this.http.put(this.url, JSON.stringify(string), {headers: this.headers})
            .toPromise()
            .then(response => response.json() as Response)
            .catch(this.handleError);
  }

  updateSorting(strings: ProjectString[]): Promise<Response> {
    return this.http.put(this.url+'/sorting', JSON.stringify(strings), {headers: this.headers})
            .toPromise()
            .then(response => response.json() as Response)
            .catch(this.handleError);
  }
}