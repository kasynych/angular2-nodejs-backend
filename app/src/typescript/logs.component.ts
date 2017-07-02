import { Component } from "@angular/core";

import { ListComponent } from "./list_component";
import { List } from "./list.interface";
import { Log } from "./log";
import { Response } from './response';
import { LogsFilter } from "./logs_filter";
import { LogService } from "./log.service";
//import $ from 'jquery';
@Component({
  selector: "logs",
  templateUrl: "partials/logs.html",
  providers: [LogService]
})
export class LogsComponent extends ListComponent implements List{
  logs: Log[];
  filter: LogsFilter = new LogsFilter();
  
  constructor(protected service: LogService){super();}

  get(page: number): void{
    this.loading(true);
    this.service.getLogs(page, this.filter)
    .then(results => {
      this.logs = results.results as Log[];
      this.updatePagination(results.total_pages);
      this.loading(false);
      if( typeof results.error != 'undefined') this.message.error(results.error);
    });
  }
  delete(log_ids: number[]): void{

  }
  onInit(): void{
    this.get(this.pagination.page);
    var from = $('#date_from').datepicker({ minDate: new Date(2009, 1 - 1, 26), maxDate: 0, dateFormat: 'dd/mm/yy' }).on( "change", function() {
          to.datepicker( "option", "minDate", from.datepicker( "getDate" ) );
        })  ;
    var to = $('#date_to').datepicker({ minDate: new Date(2009, 1 - 1, 26), maxDate: 0, dateFormat: 'dd/mm/yy' }).on( "change", function() {
        from.datepicker( "option", "maxDate", to.datepicker( "getDate" ) );
      });

    $('#period').change(function(){
      if($(this).val()=='custom')
        $('#date_selectors').show();
      else{
        $('#date_selectors').hide();
        $('#data_from').val('');
        $('#data_to').val('');
      }
    })
  }

  generateReport(): void{
    this.filter.period = $('#period').val();
    if(this.filter.period == 'custom'){
      this.filter.date_from = $('#date_from').val();
      this.filter.date_to = $('#date_to').val();
    }else{
      this.filter.date_from = null;
      this.filter.date_to = null;
    }
    console.log(this.filter);
    this.get(this.pagination.page);
  }

  exportReport(): void{
    this.filter.period = $('#period').val();
    if(this.filter.period == 'custom'){
      this.filter.date_from = $('#date_from').val();
      this.filter.date_to = $('#date_to').val();
    }else{
      this.filter.date_from = null;
      this.filter.date_to = null;
    }

    this.service.exportLogs(this.filter)
        .then(response => {
          if(typeof response.error != 'undefined'){
            this.message.error(response.error);
          }else{
            this.message.success(response.success);
            document.location.href= '/uploads/'+response.data.filename;
          }
        })
  }
}