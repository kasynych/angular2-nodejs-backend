import { NgModule } from "@angular/core";
import { RouterModule } from '@angular/router';
import { BrowserModule } from "@angular/platform-browser";
import { AppComponent } from "./app.component";
import { NotFoundComponent } from "./notfound.component";
import { LoginComponent } from "./login.component";

@NgModule({
  imports: [BrowserModule,
    RouterModule.forRoot([
      { path: '', component: NotFoundComponent },
      { path: 'login', component: LoginComponent }
  ])],
  declarations: [AppComponent,NotFoundComponent,LoginComponent],
  bootstrap:[AppComponent]
})
export class AppModule{

}