import { Component, OnInit } from '@angular/core';

import { NavigationService } from "./navigation.service";
//import $ from 'jquery';

@Component({
  selector: '#navigation',
  templateUrl:'partials/navigation.html',
  providers: [NavigationService]
})
export class NavigationComponent implements OnInit{
  items:string[] = [];

  constructor(private navService: NavigationService){}

  private get(){
    this.navService
        .getNav()
        .then(items => {for (var k in items) this.items.push(items[k])});
  }

  ngOnInit(): void {
    this.get();
  }
}