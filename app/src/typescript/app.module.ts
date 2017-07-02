import { NgModule } from "@angular/core";
import { RouterModule } from '@angular/router';
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from '@angular/forms';
import { HttpModule }    from '@angular/http';
import { routes } from "./app.router";
import { AppComponent } from "./app.component";
import { LogsComponent} from "./logs.component";
import { MessageComponent } from "./message.component";
import { DashboardComponent } from "./dashboard.component";
import { NotFoundComponent } from "./notfound.component";
import { AuthenticationComponent } from "./authentication.component";
import { NavigationComponent } from "./navigation.component";
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

@NgModule({
  imports: [
    HttpModule,
    BrowserModule,
    FormsModule,
    routes],
  declarations: [AppComponent,
                 NotFoundComponent,
                 AuthenticationComponent,
                 NavigationComponent,
                 UsersComponent,
                 UserComponent,
                 MessageComponent,
                 LanguagesComponent,
                 LanguageComponent,
                 UserAccessesComponent,
                 UserAccessComponent,
                 ProjectsComponent,
                 ProjectComponent,
                 StringsComponent,
                 StringComponent,
                 DashboardComponent,
                 LogsComponent],
  bootstrap:[AppComponent,NavigationComponent,MessageComponent]
})
export class AppModule{

}