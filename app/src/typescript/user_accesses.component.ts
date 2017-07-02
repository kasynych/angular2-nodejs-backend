import { Component } from "@angular/core";

import { ListComponent } from "./list_component";
import { List } from "./list.interface";
import { UserAccess } from "./user_access";
import { UserAccessService } from"./user_access.service";
//import $ from 'jquery';

@Component({
  selector: 'user_accesses',
  templateUrl: 'partials/user_accesses.html',
  providers: [UserAccessService]
})

export class UserAccessesComponent extends ListComponent implements List{
  private user_accesses: UserAccess[];

  constructor(protected service: UserAccessService){super();}

  get(): void{
    var obj = this;
    this.loading(true);
    this.service
        .getUserAccesses()
        .then(user_accesses => {
          this.user_accesses = user_accesses;
          this.loading(false);
        });
  }
}