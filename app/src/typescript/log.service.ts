import { Injectable } from "@angular/core";
import { Http } from "@angular/http";

import "rxjs/add/operator/toPromise";

import { CrudService } from "./crud_service";
import { Log } from "./log";
import { LogsFilter } from "./logs_filter";
import { List } from './list';
import { Response } from "./response";

@Injectable()
export class LogService extends CrudService{
  protected url: string = '/api/logs';

  constructor(protected http: Http) { super(http); }

  getLogs(page: number, filter: LogsFilter): Promise<List>{
    var query = '?page='+page + '&' + filter.toQuery();

    return this.http.get(this.url+query)
            .toPromise()
            .then(logs => logs.json() as List)
            .catch(this.handleError);
  }

  exportLogs(filter: LogsFilter): Promise<Response> {
    var query = '?'+filter.toQuery();

    return this.http.get(this.url+'/export/'+query)
            .toPromise()
            .then(response => response.json() as Response)
            .catch(this.handleError);
  }
}