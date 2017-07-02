import { Injectable } from "@angular/core";
import { Http } from "@angular/http";

import "rxjs/add/operator/toPromise";

import { CrudService } from "./crud_service";
import { Language } from "./language";
import { Response } from './response';

@Injectable()
export class LanguageService extends CrudService{
  protected url : string = 'api/languages';  // URL to web api

  constructor(protected http: Http){super(http);}

  getLangs(): Promise<Language[]>{
    return this.http.get(this.url)
    .toPromise()
    .then(response => response.json() as Language[])
    .catch(this.handleError);
  }

  getAllLangs(): Promise<Language[]>{
    return this.http.get(this.url+'/all')
    .toPromise()
    .then(response => response.json() as Language[])
    .catch(this.handleError);
  }

  getLang(lang_id:number): Promise<Language> {
    return this.http.get(this.url+'/language?lang_id='+lang_id)
               .toPromise()
               .then(response => response.json() as Language)
               .catch(this.handleError);
  }

  create(language: Language): Promise<Response> {
    return this.http
      .post(this.url, JSON.stringify(language), {headers: this.headers})
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }

  update(language: Language): Promise<Response> {
    return this.http
      .put(this.url, JSON.stringify(language), {headers: this.headers})
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }
}