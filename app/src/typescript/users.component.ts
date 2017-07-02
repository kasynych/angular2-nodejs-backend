import { Component } from '@angular/core';

import { ListComponent } from "./list_component";
import { List } from "./list.interface";
import { User }                from './user';
import { UserService }         from './user.service';
//import $ from 'jquery';

@Component({
  selector: 'users',
  templateUrl: 'partials/users.html',
  providers: [UserService]
})

export class UsersComponent extends ListComponent implements List {
  private users: User[];

  constructor(protected service: UserService){super();}

  get(page: number): void{
    var obj = this;
    this.loading(true);
    this.service
        .getUsers(page)
        .then(results => {
          this.users = results.results as User[];
          this.updatePagination(results.total_pages);
          obj.loading(false);
        });
  }
}
