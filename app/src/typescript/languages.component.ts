import { Component } from "@angular/core";

import { ListComponent } from "./list_component";
import { List } from "./list.interface";
import { Language } from "./language";
import { LanguageService } from "./language.service";
//import $ from 'jquery';

@Component({
  selector: 'languages',
  templateUrl: 'partials/languages.html',
  providers: [LanguageService]
})

export class LanguagesComponent extends ListComponent implements List{
  private languages: Language[];
  
  constructor(protected service: LanguageService){super();}

  get(): void{
    var obj = this;
    this.loading(true);
    this.service
        .getLangs()
        .then(languages => {
          this.languages = languages;
          obj.loading(false);
        });
  }
}