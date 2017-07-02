import { Component } from "@angular/core";
import { Router, ActivatedRoute, Params } from '@angular/router';

import { FormComponent } from "./form_component";
import { Form } from "./form.interface";
import { Language } from "./language";
import { LanguageService } from "./language.service";
//import $ from 'jquery';

@Component({
  selector: 'language',
  templateUrl: 'partials/language_form.html',
  providers: [LanguageService]
})

export class LanguageComponent extends FormComponent implements Form{
  language: Language = new Language();
  language_options: Language[];

  constructor(private service: LanguageService,
    private router: Router,
    private route: ActivatedRoute){super(); this.form_title = "Language form";}

  get(language_id: number){
    this.service
        .getLang(language_id)
        .then(language => this.language = language);
  }

  getAllLanguages(){
    this.service
        .getAllLangs()
        .then(languages => this.language_options = languages);
  }

  save(e): void {
    console.log(1);
    if(this.language.language_id == 0)
      this.service.create(this.language).then(response =>{
        if(typeof response.error != 'undefined'){
          this.message.error(response.error);
        }else{
          this.message.success(response.success);
          this.language.language_id = response.data.language_id;
        }
      })
      .catch(this.handleError);
    else
      this.service.update(this.language).then(response =>{
        if(typeof response.error != 'undefined'){
          this.message.error(response.error);
        }else
          this.message.success(response.success);
      })
      .catch(this.handleError);
  }

  delete(language_ids: number[]){
    if(!confirm('Are you sure?')) return;
    this.service.delete(language_ids).then(response =>{
      if(typeof response.error != 'undefined'){
        this.message.error(response.error);
      }else
        this.message.success(response.success);
    })
    .catch(this.handleError);
  }

  onInit(){
    this.getAllLanguages();
    this.route.params
      .switchMap((params: Params) => this.service.getLang(+params['id']))
      .subscribe(language => {
        if(typeof language.language_id != "undefined")
          this.language = language;
        else
          this.language = new Language();
          
        $('#language_id option').attr('selected',false);
        $('#language_id option[value="'+this.language.code+'"]').attr('selected','selected');
      });
  }

  languageSelOnChange(el){
    var code: string = $(el).val();
    var name: string = $(el).find('[value="'+code+'"]').text();
    this.language.code = code;
    this.language.name = name;
  }

  goBack(){
    this.router.navigate(['/languages']);
  }
}