import {Component, Input, Output, ViewChildren, EventEmitter} from "@angular/core";
import {InternalChosenOption, InternalChosenOptionGroup} from "./chosen-commons";

@Component({
  selector: 'div.chosen-drop',
  template: `
        <div *ngIf="!disableSearch" class="chosen-search">
            <input (blur)="onInputBlur()" (keyup)="onInputKeyup($event.target.value)" [(ngModel)]="inputValue" #chosenInput type="text" autocomplete="off">
        </div>
        <ul class="chosen-results">
            <template ngFor let-option [ngForOf]="options_" let-i="index">

                 <li *ngIf="showGroup(option,i)" class="group-result">{{option.groupObject.label}}</li>
                 <li [class.highlighted]="option.highlighted"
                    [class.result-selected]="isOptionSelected(option)"
                    [class.active-result]="!isOptionSelected(option) || display_selected_options"
                    (mouseover)="highlight(option)"
                    (mouseout)="unHighlight(option)"
                    (mousedown)="selectOption(option)">
                    <span [innerHtml]="getOptionLabel(option)"></span>
                </li>

            </template>
            <li *ngIf="filterMode && options_ == null" class="no-results">{{no_results_text}} "<span>{{inputValue}}</span>"</li>
        </ul>
    `
})
export class ChosenDropComponent {

  inputValue: string;

  @Input()
  disableSearch = false;

  @Input()
  no_results_text;

  @Input()
  display_selected_options: boolean = false;

  @Input()
  filterMode: boolean = false;

  @Output()
  optionSelected: EventEmitter<InternalChosenOption> = new EventEmitter();

  @Output()
  inputKeyUp: EventEmitter<string> = new EventEmitter();

  @Output()
  inputBlur: EventEmitter<boolean> = new EventEmitter();

  @ViewChildren('chosenInput')
  chosenInputQueryList;

  @Input()
  set options(options: Array<InternalChosenOption>) {
    this.options_ = options;
  }

  @Input()
  set groups(groups: Array<InternalChosenOptionGroup>) {
    this.groups_ = groups;
  }

  options_: Array<InternalChosenOption>;

  groups_: Array<InternalChosenOptionGroup>;

  highlightedOption: InternalChosenOption;

  highlight(option: InternalChosenOption) {
    if (this.highlightedOption != null) {
      this.highlightedOption.highlighted = false;
    }
    if (!this.isOptionSelected(option) || this.display_selected_options) {
      option.highlighted = true;
      this.highlightedOption = option;
    }
  }

  unHighlight(option: InternalChosenOption) {
    option.highlighted = false;
  }

  getOptionLabel(option): string {
    if (this.filterMode) {
      return option.labelWithMark;
    } else {
      return option.label;
    }
  }

  selectOption(option) {
    this.optionSelected.emit(option);
  }

  isOptionSelected(option) {
    return option.selected;
  }

  onInputKeyup(value) {
    this.inputKeyUp.emit(value);
  }

  onInputBlur() {
    this.inputValue = null;
    this.inputBlur.emit(true);
  }

  inputFocus() {
    this.chosenInputQueryList.first.nativeElement.focus();
  }

  showGroup(option: InternalChosenOption, i: number) {
    if (option.group != null && option.groupObject != null) {
      if (i === 0) {
        return true;
      } else {
        return this.options_[i - 1].group !== option.group;
      }
    } else {
      return false;
    }
  }
}

