import { Response } from './response';

import { ServiceBase } from "./service_base";

export abstract class CrudService extends ServiceBase {
  
  delete(ids: number[]): Promise<Response> {
    const url = this.url+'?ids='+ids.join(',');
    return this.http.delete(url)
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }
}