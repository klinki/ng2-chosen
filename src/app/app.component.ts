import {Component} from "@angular/core";
import {ChosenOption, ChosenOptionGroup} from "./chosen/chosen-commons";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  options: Array<ChosenOption>;

  groups: Array<ChosenOptionGroup>;

  values: Array<string> = null;

  value: string = null;

  constructor() {

    this.groups = [{"value": "africa", "label": "Africa"}, {"value": "europe", "label": "Europe"}, {
      "value": "america",
      "label": "America"
    }]

    setTimeout(() => {
      this.options = [{label: "Tunisia", value: "1", group: "africa"}, {
        label: "France",
        value: "2",
        group: "europe"
      }, {label: "italy", value: "12", group: "europe"}, {
        label: "USA",
        value: "3",
        group: "america"
      }, {label: "Algeria", value: "4", group: "africa"}, {label: "nowhere", value: "x"}];
    }, 100)

    setTimeout(() => {
      this.value = "2";
    }, 500)

    setTimeout(() => {
      this.values = ["1"];
    }, 50)
  }
}
