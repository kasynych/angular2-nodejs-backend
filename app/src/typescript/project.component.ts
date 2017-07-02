import { Component } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";

import { FormComponent } from "./form_component";
import { Form } from "./form.interface";
import { Project } from "./project"
import { Language } from "./language";
import { ProjectLanguage } from './project_language';
import { ProjectService } from "./project.service";
import { LanguageService } from './language.service';
//import $ from 'jquery';

@Component({
  templateUrl: "partials/project_form.html",
  providers: [ProjectService,LanguageService]
})

export class ProjectComponent extends FormComponent implements Form{
  private project: Project = new Project();
  private languages: Language[];

  constructor(
      private service: ProjectService,
      private languageService: LanguageService,
      private route: ActivatedRoute,
      private router: Router){super(); this.form_title = "Project form";}

  get(project_id: number){
    this.service
        .getProject(project_id)
        .then(project => this.project = project as Project)
  }

  save(e: Event){
    this.project.project_languages = [];
    var obj = this;
    $('#project_languages tbody [name="checked[]"][value="1"]').each(function(){
      var tr = $(this).closest('tr');
      var language_id = tr.find('[name="language_id[]"]').val();
      var code = tr.find('[name="code[]"]').val();
      var lang_exists = false;
      obj.project.project_languages.push({
        project_id: obj.project.project_id,
        language_id: parseInt(language_id),
        code: code
      });
    })

    if(this.project.project_id == 0)
      this.service.create(this.project).then(response =>{
        if(typeof response.error != 'undefined'){
          this.message.error(response.error);
        }else{
          this.message.success(response.success);
          this.project.project_id = response.data.project_id;
        }
      })
    .catch(this.handleError);
    else
      this.service.update(this.project).then(response =>{
        if(typeof response.error != 'undefined'){
          this.message.error(response.error);
        }else
          this.message.success(response.success);
      })
    .catch(this.handleError);
  }

  delete(project_id: number[]){

  }

  onInit(){
    this.languageService
      .getLangs()
      .then(languages => {
        this.languages = languages as Language[]
      });
    this.route.params
      .switchMap((params: Params) => this.service.getProject(+params['id']))
      .subscribe(project => {
        
        if(typeof project.project_id != "undefined")
          this.project = project;
        else
          this.project = new Project();
      });
  }

  goBack(){
    this.router.navigate(['/projects']);
  }

  checkLang(el): void{
    var tr = $(el).closest('tr');
    var language_id = tr.find('[name="language_id[]"]').val();
    var code = tr.find('[name="code[]"]').val();
    tr.find('td').toggleClass('warning');
    tr.find('td').eq(0).find('.glyphicon').remove();
    if(tr.find('td').hasClass('warning')){
      tr.find('td').eq(0).append('<span class="glyphicon glyphicon-ok text-success"></span>');
      tr.find('[name="checked[]"]').val(1);
    }else
      tr.find('[name="checked[]"]').val(0);
  }

  isProjectLanguage(language: Language): boolean{
    if(typeof this.project.project_languages == "undefined") return false;
    if(this.project.project_languages.length == 0) return false;
    
    var ret: boolean = false;
    this.project.project_languages.forEach(function(item: ProjectLanguage,index: number){
      if(item.language_id == language.language_id)
        ret = true;
    });

    return ret;
  }
}