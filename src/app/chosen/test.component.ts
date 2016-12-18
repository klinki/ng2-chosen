
import {Component, Input, ViewChildren, QueryList, ElementRef, Renderer} from "@angular/core";

@Component({
  selector: 'text-xc',
  template: `
       testx {{mode}}
    `
})
export class Testx {

  @Input()
  mode : string ="";


}

