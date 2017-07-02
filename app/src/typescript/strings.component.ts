import { Component } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";

import { ListComponent } from "./list_component";
import { List } from "./list.interface";
import { Project } from "./project";
import { ProjectString } from "./string";
import { ProjectStringRow } from "./string_row";
import { UniversalString } from "./universal_string";
import { StringService } from "./string.service";
import { FileUploadService } from "./file_upload.service";
import { ProjectService } from "./project.service";
import { UniversalStringService } from "./universal_string.service";
//import $ from 'jquery';

@Component({
  selector: "strings",
  templateUrl: "partials/strings.html",
  providers: [ StringService, FileUploadService, ProjectService, UniversalStringService ]
})
export class StringsComponent extends ListComponent implements List{
  private strings: ProjectStringRow[];
  private project: Project = new Project();

  constructor(protected service: StringService,
              private fileUploadService: FileUploadService,
              private projectService: ProjectService,
              private route: ActivatedRoute,
              private router: Router,
              private universalStringService: UniversalStringService){super();}

  get(){
    var obj = this;
    this.loading(true);
    this.service
        .getStrings(this.route.params._value.id)
        .then(strings => {
          this.strings = strings as ProjectStringRow[];
          this.strings.forEach(function(item,index){item.row_type = 'regular'});
          this.setSortable();
          this.loading(false);
        });
  };

  importHandler(e: any): void{
    console.log(e.target.files);

    var result;

    this.fileUploadService.getObserver()
         .subscribe(progress => {
            console.log(progress);
          });

    try {
      result = this.fileUploadService.upload('/api/strings/import', e.target.files, this.route.params._value.id).then((res) => {
      if(typeof res.error != 'undefined'){
        this.message.error(res.error);
      }else{
        this.message.success(res.success);
        this.get();
      }
      }, (err) => { console.log(err); });
    } catch (error) {
      document.write(error)
    }
    console.log(result);
  }

  saveSorting(){
    this.service.updateSorting(this.strings)
                .then(response => {
                  if(typeof response.error != 'undefined'){
                    
                  }else{
                    
                  }
                });
  }

  onInit(){
    this.loading(true);
    this.route.params
      .switchMap((params: Params) => this.service.getStrings(+params['id']))
      .subscribe(strings => {
        this.strings = strings as ProjectStringRow[];
        this.strings.forEach(function(item,index){item.row_type = 'regular'});
        this.route.params
          .switchMap((params: Params) => this.projectService.getProject(+params['id']))
          .subscribe(project => {
            this.project = project as Project;
            this.setSortable();
            this.loading(false);
          });
      });
  }

  setSortable(){
    var obj = this;
    $(".sortable").sortable({
      update: function( event, ui ) {
        $('.sortable tr').each(function(i){
          var tr = $(this);
          obj.strings.forEach(function(item,index){
            if(item.project_string_id==tr.find('td').first().text())
              obj.strings[index].order = i;
          });
        })
        obj.saveSorting();
      }
    });
  }

  search(e: Event): void{

  }

  addStringModel(string: ProjectStringRow): void{
    var new_string = new ProjectStringRow();
    new_string.row_type = 'form';
    var cur_string_index = this.strings.indexOf(string);

    new_string.order = this.strings[cur_string_index].order+1;
    new_string.project_id = this.project.project_id;

    var first_half = this.strings.slice(0,cur_string_index+1);
    var second_half = this.strings.slice(cur_string_index+1);

    second_half.forEach(function(item,index){
      second_half[index].order +=1;
    })
    this.saveSorting(); // saving sorting before adding new string to model
    first_half.push(new_string);

    this.strings = first_half.concat(second_half);
  }

  switchRowToForm(string: ProjectStringRow): void{
    string.row_type = 'form';
  }

  saveString(string: ProjectString): void{
    if(string.project_string_id == 0)
      this.service.create(string)
                  .then(response =>{
                    if(typeof response.error != 'undefined'){
                      this.message.error(response.error);
                    }else{
                      this.message.success(response.success);
                      this.get();
                    }
                  });
    else
      this.service.update(string)
                  .then(response =>{
                    if(typeof response.error != 'undefined'){
                      this.message.error(response.error);
                    }else{
                      this.message.success(response.success);
                      this.get();
                    }
                  });
  }

  switchRowToRegular(string: ProjectStringRow): void{
    if(string.project_string_id == 0){
      var string_index = this.strings.indexOf(string);
      this.strings.splice(string_index,1);
    }else
      string.row_type = "regular";
  }

  assignUniversalString(string: ProjectStringRow):void{
    var assign_universal_string:boolean = false;
    var universal_string = new UniversalString();
    universal_string.universal_string = string.english;
    this.universalStringService.create(universal_string)
      .then(response => {
        if(typeof response.error != 'undefined'){
          if(response.error != 'Universal String already exists'){
            this.message.error(response.error);return;
          }
        }else{
          
        }

      
        string.universal_string_id = response.data.universal_string_id;
        this.service.update(string)
                      .then(response =>{
                        if(typeof response.error != 'undefined'){
                          this.message.error(response.error);
                        }else{
                          this.message.success(response.success);
                        }
                      })
      })
  }
}