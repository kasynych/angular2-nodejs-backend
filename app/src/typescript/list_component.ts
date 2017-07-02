import { CrudService } from "./crud_service";
import { ComponentBase } from './component_base';

export class ListComponent extends ComponentBase{
  protected service: CrudService;
  protected pagination = {
    page: 1,
    pages: [1]
  };

  getPage(page: number): void{
    this.pagination.page = page;
    this.refresh();
  }

  updatePagination(total_pages: number): void{
    $('.pagination li').removeClass('active');
    $('.pagination li').eq(this.pagination.page-1).addClass('active');
    this.pagination.pages = [];
    for(var i = 1; i <= total_pages;i++)
      this.pagination.pages.push(i);
  }

  refresh(): void{
    this.message.reset();
    this.get(this.pagination.page);
  }

  get(page: number):void{}

  checkAll(){
    if($('.list input:checkbox').length > $('.list input:checkbox:checked').length){
      if($('.list #check_all_checkbox').is(':checked'))
        $('.list input:checkbox').prop('checked',true);
      else
        $('.list input:checkbox').prop('checked',false);
    }else
      if(!$('.list #check_all_checkbox').is(':checked'))
        $('.list input:checkbox').prop('checked',false);
  }
  
  bulkDelete(){
    var ids = $('.list tbody input:checkbox:checked').map(function() {
      return Number($(this).val());
    }).get();
    
    if(ids.length > 0){
      this.delete(ids);
    }
  }

  delete(ids: number[]): void{
    if(!confirm('Are you sure?')) return;
    this.service.delete(ids).then(response =>{
      if(typeof response.error != 'undefined'){
        this.message.error(response.error);
      }else{
        this.message.success(response.success);
        this.get(this.pagination.page);
      }
    })
    .catch(this.handleError);
  }

  onInit(): void {
    this.get(this.pagination.page);
  }
}