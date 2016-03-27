import {CORE_DIRECTIVES} from 'angular2/common';
import {Component,Input,ElementRef,Renderer} from 'angular2/core';

import {NG_VALUE_ACCESSOR, ControlValueAccessor} from 'angular2/common';
import {DefaultValueAccessor} from "angular2/common";
import {FORM_DIRECTIVES} from "angular2/common";
import {NgModel} from "angular2/common";

export interface ChosenOption {
    value :string,
    label : string,
    selected? : boolean
}

interface InternalChosenOption extends ChosenOption {
    hit? : boolean;
    labelWithMark? : string;
}

@Component({
    selector: 'chosen',
    template: `


<div class="chosen-container"
    [class.chosen-container-multi]="multiple"
    [class.chosen-container-single]="!multiple"
    [class.chosen-container-active]="chosenContainerActive"
    [class.chosen-with-drop]="chosenWithDrop">

    <div [ngSwitch]="multiple">
        <template [ngSwitchWhen]="true">
            <ul class="chosen-choices">
                <template [ngIf]="multipleSelectedOptions != null">
                    <template ngFor #option [ngForOf]="multipleSelectedOptions" #i="index">
                        <li class="search-choice">
                            <span>{{option.label}}</span>
                            <a class="search-choice-close"
                                (click)="chosenInput.focus();optionDeselect(option, $event);"
                               data-option-array-index="4">
                            </a>
                        </li>
                    </template>
                </template>

                <li class="search-field">
                    <input #chosenInput type="text"
                    [value]="getChosenInputValue()"
                    [class.default]="isSelectionEmpty()"
                    (focus)="chosenFocus()"
                    (blur)="chosenBlur()"
                    (keyup)="inputKeyup($event)"
                    tabindex="i" autocomplete="off"/>
                </li>
            </ul>
        </template>
        <template [ngSwitchWhen]="false">
            <a (click)="chosenFocus(chosenInput)" class="chosen-single"
               [class.chosen-single-with-deselect]="!isSelectionEmpty() && allow_single_deselect"
               [class.chosen-default]="isSelectionEmpty()">

            <span [ngSwitch]="singleSelectedOption == null">
                 <template [ngSwitchWhen]="true">
                     {{placeholder_text_single}}
                 </template>
                 <template [ngSwitchWhen]="false">
                     {{singleSelectedOption.label}}
                 </template>
            </span>

                <abbr *ngIf="!isSelectionEmpty() && allow_single_deselect"
                    (click)="optionDeselect(singleSelectedOption , $event)" class="search-choice-close">
                </abbr>

                <div><b></b></div>
            </a>
        </template>
    </div>
    <div class="chosen-drop">
        <div *ngIf="!multiple" class="chosen-search">
            <input (blur)="chosenBlur()" (keyup)="inputKeyup($event)" #chosenInput type="text" autocomplete="off" tabindex="5">
        </div>
        <ul class="chosen-results">
            <template ngFor #option [ngForOf]="options_" #i="index">
                <li *ngIf="showOptionInChosenDrop(option)"
                    [class.highlighted]="option.highlighted"
                    [class.result-selected]="isOptionSelected(option)"
                    [class.active-result]="!isOptionSelected(option)"
                    (mouseover)="!isOptionSelected(option) && option.highlighted = true"
                    (mouseout)="option.highlighted = false"
                    (mousedown)="optionSelect(option)"
                    data-option-array-index="i">
                    <span [innerHtml]="optionLabelInChosenDrop(option)"></span>
                </li>
            </template>
        </ul>
    </div>
</div>
    `,
    directives: [CORE_DIRECTIVES, FORM_DIRECTIVES]
})
export class ChosenComponent extends DefaultValueAccessor {

    @Input()  multiple:boolean = true;

    @Input() placeholder_text_multiple:string = "Select Some Options";
    @Input() placeholder_text_single:string = "Select an Option";
    @Input() allow_single_deselect:boolean = false;

    options_:Array<InternalChosenOption>;

    initialValue:Array<string> | string;

    singleSelectedOption:ChosenOption;

    multipleSelectedOptions:Array<ChosenOption>;

    chosenContainerActive:boolean = false;

    chosenWithDrop:boolean = false;

    filterMode:boolean = false;

    constructor(private model:NgModel, private el:ElementRef, private renderer:Renderer) {
        super(renderer, el);
        model.valueAccessor = this;
    }

    @Input()
    set options(options:Array<ChosenOption>) {
        // options clone
        if (options != null) {
            this.options_ = options.map(option=> {
                return {value: option.value, label: option.label, selected: false, hit: false};
            });
            this.updateOptionsWithSelection();
        }
    }

    writeValue(value:Array):void {
        if (value != null) {
            this.initialValue = value;
            this.updateOptionsWithSelection();
        }
    }

    updateOptionsWithSelection() {
        if (this.options_ != null) {
            if (this.initialValue != null) {

                if (this.multiple) {
                    this.multipleSelectedOptions = [];
                }

                for (var i = 0; i < this.options_.length; i++) {
                    let option = this.options_[i];
                    if (!this.multiple) {
                        let initialValue = <string>this.initialValue;
                        if (initialValue === option.value) {
                            this.singleSelectedOption = option;
                            option.selected = true;
                            break;
                        }
                    } else {
                        let initialValue = <Array<string>>this.initialValue;
                        if (initialValue.find(value => value == option.value) != null) {
                            this.multipleSelectedOptions.push(option);
                        }
                    }
                }
            }
        }
    }

    chosenFocus(chosenInput) {
        if (chosenInput != null) {
            chosenInput.focus();
        }

        this.chosenContainerActive = true;
        this.chosenWithDrop = true;
    }

    chosenBlur() {
        this.chosenContainerActive = false;
        this.chosenWithDrop = false;
        this.filterMode = false;
    }

    inputKeyup($event) {
        let inputValue = $event.target.value;
        if (inputValue.trim().length > 0 || $event.code == 'Backspace') {
            this.options_.forEach(option => {
                var indexOf = option.label.toLowerCase().indexOf(inputValue.toLowerCase());
                if (indexOf > -1) {
                    let subString = option.label.substring(indexOf, inputValue.length);
                    option.labelWithMark = option.label.replace(subString, `<em>${subString}</em>`);
                    option.hit = true;
                } else {
                    option.hit = false;
                }
            });
            this.filterMode = true;
        }
    }

    getChosenInputValue() {
        if (this.multiple) {
            if (!this.chosenContainerActive && this.isSelectionEmpty()) {
                return this.placeholder_text_multiple;
            } else {
                return null;
            }
        }
    }

    isSelectionEmpty():boolean {
        if (this.multiple) {
            return this.multipleSelectedOptions == null || this.multipleSelectedOptions.length == 0;

        } else {
            return this.singleSelectedOption == null;
        }
    }

    isOptionSelected(option):boolean {
        if (this.multiple) {
            return this.multipleSelectedOptions.find(option_ => option_ == option) != null;
        } else {
            return this.singleSelectedOption == option;
        }
    }

    showOptionInChosenDrop(option):boolean {
        return !this.filterMode || (this.filterMode && option.hit);
    }

    optionLabelInChosenDrop(option):string {
        if (this.filterMode) {
            return option.labelWithMark;
        } else {
            return option.label;
        }
    }

    optionSelect(option) {
        if (!this.multiple) {
            this.singleSelectedOption = option;
        } else {
            if (!this.multipleSelectedOptions.find(option_ => option_ == option)) {
                this.multipleSelectedOptions.push(option)
            }
        }

        this.updateModel();
        this.chosenBlur();
    }

    optionDeselect(option, $event) {
        if ($event != null) {
            $event.stopPropagation();
        }

        if (!this.multiple) {
            this.singleSelectedOption = null;
        } else {
            this.multipleSelectedOptions = this.multipleSelectedOptions.filter(option_ => option_ != option);
        }
        this.updateModel();
    }


    updateModel() {
        if (this.multiple) {
            if (this.multipleSelectedOptions == null || this.multipleSelectedOptions.length == 0) {
                this.onChange(null);
            } else {
                this.onChange(this.multipleSelectedOptions.map(option => option.value))
            }
        } else {
            if (this.singleSelectedOption == null) {
                this.onChange(null);
            } else {
                this.onChange(this.singleSelectedOption.value);
            }
        }
    }
}



