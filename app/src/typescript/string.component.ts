import { Component } from "@angular/core";
import { Router, ActivatedRoute, Params} from "@angular/router";

import { FormComponent } from "./form_component";
import { Form } from "./form.interface";
import { ProjectString } from "./string";
import { StringService } from "./string.service";
//import $ from 'jquery';

@Component({
  selector: "string",
  templateUrl: "partials/string_form.html",
  providers: [ StringService ]
})

export class StringComponent extends FormComponent implements Form{
  string: ProjectString = new ProjectString();

  constructor(private service: StringService,
            private router: Router,
            private route: ActivatedRoute){super(); this.form_title = "String form";}

  get(string_id: number): void{
    this.service
        .getString(string_id)
        .then(string => this.string = string as ProjectString);
  }

  save(e: Event): void{
    this.service.update(this.string).then(response =>{
      if(typeof response.error != 'undefined'){
        this.message.error(response.error);
      }else
        this.message.success(response.success);
    })
    .catch(this.handleError);
  }

  delete(ids: number[]):void{

  }

  onInit(){
    this.route.params
      .switchMap((params: Params) => this.service.getString(+params['id']))
      .subscribe(string => {
        
        if(typeof string.project_string_id != "undefined")
          this.string = string;
        else
          this.string = new ProjectString();
      });
  }

  goBack(): void {
    this.router.navigate(['/strings/project/'+this.string.project_id]);
  }

  typeOnChange() {
    this.string.type = $('#type').val();
  }
}