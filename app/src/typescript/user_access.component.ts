import { Component } from "@angular/core";
import { Router, ActivatedRoute, Params } from '@angular/router';

import { FormComponent } from './form_component';
import { Form } from "./form.interface";
import { UserAccess } from "./user_access";
import { UserAccessService } from "./user_access.service";
import { UsersComponent } from "./users.component";
import { LanguagesComponent } from "./languages.component";
import { ProjectsComponent } from "./projects.component";
//import $ from 'jquery';

@Component({
  selector: "user_access",
  templateUrl: "partials/user_access_form.html",
  providers: [UserAccessService]
})

export class UserAccessComponent extends FormComponent implements Form{
  user_access: UserAccess = new UserAccess();

  constructor(private service: UserAccessService,
    private router: Router,
    private route: ActivatedRoute){super(); this.form_title = "User Access form";}

  get(user_access_id: number): void{

  }

  save(e: Event): void{

  }

  delete(user_access_ids: number[]): void{

  }

  onInit(){

  }

  goBack(){
    this.router.navigate(['/user-access']);
  }
}