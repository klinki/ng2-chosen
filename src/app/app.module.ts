import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';

import {ChosenModule} from './chosen/chosen.module';
import {AppComponent} from './app.component';



@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
  ChosenModule


  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
