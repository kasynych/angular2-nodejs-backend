import { OnInit } from '@angular/core';

import { Base } from "./base";
import { MessageComponent } from './message.component';
export abstract class ComponentBase extends Base implements OnInit{
  protected message: MessageComponent;
  constructor(){
    super();
    this.message =new MessageComponent();
  }

  ngOnInit(): void {
    this.onInit();
    this.message.reset();
  }

  onInit(){}

  handleError(error: any) {
    console.log(error.toString());
    return Promise.reject(error.message || error);
  }

  handleError2(error: string): void {
    this.message.error(error);
  }

  loading(loading: boolean): void{
    var selector = 'input,button,select,.form-control,.btn';
    if (loading){
      $('.main').prepend('<div id="loading_overlay"></div>').find(selector).attr('disabled',true).addClass('disabled');
      
      if(window.innerWidth >= 768)
        $('#loading_overlay').css('width',parseInt($('.main').width()+ 80)+'px');
      else
        $('#loading_overlay').css('width',parseInt($('.main').width())+'px');
    }else{
      $('.main').find(selector).attr('disabled',false).removeClass('disabled');
      $('.main').find('#loading_overlay').remove();
    }
  }
}