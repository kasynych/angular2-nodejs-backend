import { Component } from "@angular/core";

import { ListComponent } from "./list_component";
import { List } from "./list.interface";
import { Project } from "./project";
import { ProjectService} from "./project.service";
//import $ from 'jquery';

@Component({
  selector: "projects",
  templateUrl: "partials/projects.html",
  providers: [ProjectService]
})

export class ProjectsComponent extends ListComponent implements List{
  private projects: Project[];

  constructor(protected service: ProjectService){super();}

  get(): void{
    var obj = this;
    this.loading(true);
    this.service
        .getProjects()
        .then(projects => {
          this.projects = projects as Project[];
          this.loading(false);
        });
  }
}