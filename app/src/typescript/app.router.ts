import { ModuleWithProviders } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AppComponent } from "./app.component";
import { LogsComponent } from "./logs.component";
import { MessageComponent } from "./message.component";
import { DashboardComponent } from "./dashboard.component";
import { NotFoundComponent } from "./notfound.component";
import { AuthenticationComponent } from "./authentication.component";
import { UsersComponent } from "./users.component";
import { UserComponent } from "./user.component";
import { LanguagesComponent } from "./languages.component";
import { LanguageComponent } from "./language.component";
import { UserAccessesComponent } from "./user_accesses.component";
import { UserAccessComponent } from "./user_access.component";
import { ProjectsComponent } from "./projects.component";
import { ProjectComponent } from "./project.component";
import { StringsComponent } from "./strings.component";
import { StringComponent } from "./string.component";

export const router: Routes = [
      { path: '', component: DashboardComponent },
      { path: 'logs', component: LogsComponent},
      { path: 'login', component: AuthenticationComponent },
      { path: 'users', component: UsersComponent },
      { path: 'new-user', component: UserComponent },
      { path: 'user/:id', component: UserComponent },
      { path: 'languages', component: LanguagesComponent },
      { path: 'new-language', component: LanguageComponent },
      { path: 'language/:id', component: LanguageComponent },
      { path: 'user-access', component: UserAccessesComponent },
      { path: 'new-user-access', component: UserAccessComponent },
      { path: 'user-access/:id', component: UserAccessComponent },
      { path: 'projects', component: ProjectsComponent},
      { path: 'new-project', component: ProjectComponent},
      { path: 'project/:id', component: ProjectComponent},
      { path: 'strings/project/:id', component: StringsComponent},
      { path: 'string/:id', component: StringComponent}
  ];

  export const routes: ModuleWithProviders = RouterModule.forRoot(router);