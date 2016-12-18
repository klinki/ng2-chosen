import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {ChosenDropComponent} from "./chosen-drop.component";
import {ChosenSingleComponent} from "./chosen-single.component";
import {ChosenMultipleComponent} from "./chosen-multiple.component";


@NgModule({
  declarations: [
    ChosenDropComponent,
    ChosenSingleComponent,
    ChosenMultipleComponent
  ],
  exports: [
    ChosenDropComponent,
    ChosenSingleComponent,
    ChosenMultipleComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: []
})
export class ChosenModule {

}
