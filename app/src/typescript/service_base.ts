import { Headers } from '@angular/http';
import { Http } from '@angular/http';

export abstract class ServiceBase {
  public headers = new Headers({'Content-Type': 'application/json'});
  protected url: string;
  constructor(protected http: Http) {}
  protected handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }
}