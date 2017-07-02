import { Component, Input, Output } from '@angular/core';
import { Message } from './message';
//import $ from 'jquery';

@Component({
  selector: 'message',
  templateUrl: 'partials/message.html'
})

export class MessageComponent{
  public success(txt: string){
    $('#messages > div').hide();
    $('#messages .alert-success').show();
    $('#messages .alert-success > div').html(txt);
  }
  public info(txt: string){
    $('#messages > div').hide();
    $('#messages .alert-info').show();
    $('#messages .alert-info > div').html(txt);
  }
  public error(txt: string){
    $('#messages > div').hide();
    $('#messages .alert-danger').show();
    $('#messages .alert-danger > div').html(txt);
  }
  public reset(){
    $('#messages > div').hide();
    $('#messages .alert-success > div').html('');
    $('#messages .alert-info > div').html('');
    $('#messages .alert-danger > div').html('');
  }
}
