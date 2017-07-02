import 'rxjs/add/operator/switchMap';
import { Component } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { LanguageService } from "./language.service";
import { ProjectService } from "./project.service";
import { FormComponent } from './form_component';
import { Form } from "./form.interface";
import { User } from './user';
import { Project } from './project';
import { Language } from './language';
import { UserType } from './user_type';
import { UserService } from './user.service';
import { UserTypeService } from './user_type.service';
//import $ from 'jquery';

@Component({
  selector: 'user',
  templateUrl: 'partials/user_form.html',
  providers: [UserService, LanguageService, ProjectService, UserTypeService] // why need to provide LanguageService?
})

export class UserComponent extends FormComponent implements Form{
  private user: User = new User();
  private user_types: UserType[];
  project_options: Project[];
  language_options: Language[];

  constructor(private service: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private languageService: LanguageService,
    private projectService: ProjectService,
    private userTypeService: UserTypeService){super(); this.form_title = "User form";}

  get(user_id: number){
    this.service
      .getUser(user_id)
      .then(user => this.user = user);
  }


  save(e): void {
    if(this.user.user_id == 0)
      this.service.create(this.user).then(response =>{
        if(typeof response.error != 'undefined'){
          this.message.error(response.error);
        }else{
          this.message.success(response.success);
          this.user.user_id = response.data.user_id;
        }
      })
    .catch(this.handleError);
    else
      this.service.update(this.user).then(response =>{
        if(typeof response.error != 'undefined'){
          this.message.error(response.error);
        }else
          this.message.success(response.success);
      })
    .catch(this.handleError);
  }

  onInit(): void {
    this.languageService
        .getLangs()
        .then(languages => {
          this.language_options = languages;
        });
    this.projectService
        .getProjects()
        .then(project_options => {
          this.project_options = project_options;
        });
    this.userTypeService.getUserTypes().then(user_types => this.user_types = user_types as UserType[]);
    this.route.params
      .switchMap((params: Params) => this.service.getUser(+params['id']))
      .subscribe(user => {
        
        if(typeof user.user_id != "undefined")
          this.user = user;
        else
          this.user = new User();


        $('#user_type_id option').attr('selected',false);
        $('#user_type_id option[value="'+this.user.user_type_id+'"]').attr('selected','selected');

        $('#user_access_language_id option').attr('selected',false);
        for(let user_access_language of this.user.user_access_languages )
          $('#user_access_language_id option[value="'+user_access_language.language_id+'"]').attr('selected','selected');

        $('#user_access_project_id option').attr('selected',false);
        for(let user_access_project of this.user.user_access_projects )
          $('#user_access_project_id option[value="'+user_access_project.project_id+'"]').attr('selected','selected');
      });
  }

  onSelect(user: User): void {
  }

  gotoDetail(): void {
  }

  delete(user_id: number[]){

  }

  goBack(): void {
    this.router.navigate(['/users']);
  }

  userAccessLanguageOnChange(){
    var obj = this;
    obj.user.user_access_languages = [];
    $('#user_access_language_id option:selected').each(function(){
      obj.user.user_access_languages.push({user_access_id: 0, type_access: "language", project_id:null, language_id:$(this).attr('value')});
    })
  }

  userAccessProjectOnChange(){
    var obj = this;
    obj.user.user_access_projects = [];
    $('#user_access_project_id option:selected').each(function(){
      obj.user.user_access_projects.push({user_access_id: 0, type_access: "project", project_id:$(this).attr('value'), language_id:null});
    })
  }
}
