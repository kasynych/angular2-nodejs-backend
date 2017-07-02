export class LogsFilter{
  period: string =  null;
  date_from: string = null;
  date_to: string = null;

  toQuery():string{
    var query_arr:string[] = [];
    if(this.period !== null)
      query_arr.push('period='+this.period);
    if(this.date_from !== null)
      query_arr.push('date_from='+this.date_from);
    if(this.date_to !== null)
      query_arr.push('date_to='+this.date_to);
    return query_arr.join('&');;
  };
}