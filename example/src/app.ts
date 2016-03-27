import {CORE_DIRECTIVES} from 'angular2/common';
import {Component} from 'angular2/core';


import {FORM_DIRECTIVES} from "angular2/common";

import {ChosenComponent} from "chosen";
import {ChosenOption} from "chosen";

@Component({
    selector: 'app',
    templateUrl: 'app.html',
    directives: [CORE_DIRECTIVES, FORM_DIRECTIVES, ChosenComponent]
})
export class Application {

    options:Array<ChosenOption>;

    values:Array = null;

    value:string = null;

    constructor() {
        setTimeout(()=> {
            this.options = [{label: "Tunisia", value: "1"}, {label: "France", value: "2"}, {label: "USA", value: "3"}];
        }, 100)

        setTimeout(()=> {
            this.value = "2";
        }, 500)

        setTimeout(()=> {
            this.values = ["1"];
        }, 50)
    }

}



