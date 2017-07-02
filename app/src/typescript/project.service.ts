import { Injectable } from "@angular/core";
import { Http } from "@angular/http";

import "rxjs/add/operator/toPromise";

import { CrudService } from "./crud_service";
import { Project } from "./project";
import { Response } from "./response";

@Injectable()
export class ProjectService extends CrudService{
  protected url:string = "/api/projects";

  constructor(protected http: Http) { super(http); }

  getProjects(): Promise<Project[]> {
    return this.http.get(this.url)
            .toPromise()
            .then(response => response.json() as Project[])
            .catch(this.handleError);
  }

  getProject(project_id:number): Promise<Project> {
    return this.http.get(this.url+'/project?project_id='+project_id)
            .toPromise()
            .then(response => response.json() as Project)
            .catch(this.handleError);
  }

  create(project: Project): Promise<Response> {
    return this.http.post(this.url, JSON.stringify(project), {headers: this.headers})
            .toPromise()
            .then(response => response.json() as Response)
            .catch(this.handleError);
  }

  update(project: Project): Promise<Response> {
    return this.http.put(this.url, JSON.stringify(project), {headers: this.headers})
            .toPromise()
            .then(response => response.json() as Response)
            .catch(this.handleError);
  }

}