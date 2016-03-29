import {CORE_DIRECTIVES, NG_VALUE_ACCESSOR, FORM_DIRECTIVES, DefaultValueAccessor, NgModel} from 'angular2/common';
import {Component, Input, Output, Host, ViewChildren, ElementRef, Renderer, EventEmitter} from 'angular2/core';

export interface ChosenOption {
    value:string,
    label:string,
}

interface InternalChosenOption extends ChosenOption {
    selected?:boolean;
    hit?:boolean;
    labelWithMark?:string;
}

@Component({
    selector: 'div.chosen-drop',
    template: `
        <div *ngIf="!isSearchDisabled()" class="chosen-search">
            <input (blur)="onInputBlur()" (keyup)="onInputKeyup($event.target.value)" [(ngModel)]="inputValue" #chosenInput type="text" autocomplete="off" tabindex="5">
        </div>
        <ul class="chosen-results">
            <template ngFor #option [ngForOf]="options_" #i="index">
                <li *ngIf="isOptionVisible(option)"
                    [class.highlighted]="option.highlighted"
                    [class.result-selected]="isOptionSelected(option)"
                    [class.active-result]="!isOptionSelected(option)"
                    (mouseover)="!isOptionSelected(option) && option.highlighted = true"
                    (mouseout)="option.highlighted = false"
                    (mousedown)="selectOption(option)"
                    data-option-array-index="i">
                    <span [innerHtml]="getOptionLabel(option)"></span>
                </li>
            </template>

            <li *ngIf="filterMode && filterResultCount == 0" class="no-results">{{no_results_text}} "<span>{{inputValue}}</span>"</li>
        </ul>

    `,
    directives: [CORE_DIRECTIVES, FORM_DIRECTIVES]
})
class ChosenDropComponent {

    inputValue:string;

    @Input()
    disable_search = false;
    @Input()
    disable_search_threshold = 0;
    @Input()
    no_results_text;
    @Input()
    filterMode:boolean = false;
    @Input()
    options_:Array<InternalChosenOption>;

    @Output()
    optionSelected:EventEmitter<InternalChosenOption> = new EventEmitter();
    @Output()
    inputKeyUp:EventEmitter<string> = new EventEmitter();
    @Output()
    inputBlur:EventEmitter<boolean> = new EventEmitter();

    @ViewChildren('chosenInput')
    chosenInputQuery;

    @Input()
    set options(options:Array<ChosenOption>) {
        this.options_ = options;
    }

    isSearchDisabled() {
        return this.disable_search
            || (this.disable_search_threshold != 0 && this.options_ != null && this.options_.length <= this.disable_search_threshold);
    }

    isOptionVisible(option):boolean {
        return !this.filterMode || (this.filterMode && option.hit);
    }

    getOptionLabel(option):string {
        if (this.filterMode) {
            return option.labelWithMark;
        } else {
            return option.label;
        }
    }

    selectOption(option) {
        this.optionSelected.emit(option)
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
        this.chosenInputQuery.first.nativeElement.focus();
    }
}

abstract class AbstractChosenComponent<T> extends DefaultValueAccessor {

    protected static NO_RESULTS_TEXT_DEFAULT = "No results match";

    protected initialValue:T;

    public options_:Array<InternalChosenOption>;

    public chosenContainerActive:boolean = false;
    public chosenWithDrop:boolean = false;

    protected inputValue:string;

    public filterMode:boolean = false;
    public filterResultCount:number = 0;

    constructor(private model:NgModel, private el:ElementRef, private renderer:Renderer) {
        super(renderer, el);
        model.valueAccessor = this;
    }

    protected setOptions(options:Array<ChosenOption>) {
        if (options != null) {
            this.options_ = options.map(option=> {
                return {value: option.value, label: option.label, selected: false, hit: false};
            });
            this.updateOptionsWithSelection();
        }
    }

    writeValue(value:T):void {
        if (value != null) {
            this.initialValue = value;
            this.updateOptionsWithSelection();
        }
    }

    protected  inputKeyUp(inputValue) {
        if (inputValue.trim().length > 0) {
            this.filterResultCount = 0;
            this.options_.forEach((option:InternalChosenOption) => {
                var indexOf = option.label.toLowerCase().indexOf(inputValue.toLowerCase());
                if (indexOf > -1) {
                    let subString = option.label.substring(indexOf, inputValue.length);
                    option.labelWithMark = option.label.replace(subString, `<em>${subString}</em>`);
                    option.hit = true;
                    this.filterResultCount++;
                } else {
                    option.hit = false;

                }
            });
            this.filterMode = true;
        } else {
            this.filterResultCount = 0;
            this.filterMode = false;
        }
    }

    abstract updateOptionsWithSelection();

    abstract isSelectionEmpty():boolean;

    abstract updateModel();

    abstract selectOption(option:InternalChosenOption)

    abstract deselectOption(option:InternalChosenOption, event);

    chosenFocus() {
        this.chosenContainerActive = true;
        this.chosenWithDrop = true;
        this.onChosenFocus();
    }

    abstract onChosenFocus();

    chosenBlur() {
        this.chosenContainerActive = false;
        this.chosenWithDrop = false;
        this.filterMode = false;
        this.onChosenBlur();
    }

    abstract onChosenBlur();
}

@Component({
    selector: 'chosen-single',
    template: `

    <div class="chosen-container chosen-container-single"
        [class.chosen-container-active]="chosenContainerActive"
        [class.chosen-with-drop]="chosenWithDrop">

         <a (click)="chosenFocus(chosenInput)"  class="chosen-single"
               [class.chosen-single-with-deselect]="!isSelectionEmpty() && allow_single_deselect"
               [class.chosen-default]="isSelectionEmpty()">

                <span [ngSwitch]="isSelectionEmpty()">
                    <template [ngSwitchWhen]="true">
                        {{placeholder_text_single}}
                    </template>
                    <template [ngSwitchWhen]="false">
                        {{singleSelectedOption.label}}
                    </template>
                </span>

                <abbr *ngIf="!isSelectionEmpty() && allow_single_deselect"
                    (click)="deselectOption(singleSelectedOption , $event)" class="search-choice-close">
                </abbr>

                <div><b></b></div>
        </a>

        <div class="chosen-drop"
            [disable_search]="disable_search"
            [disable_search_threshold]="disable_search_threshold"
            [no_results_text]="no_results_text"
            [filterMode]="filterMode"
            [options]="options_"
            (optionSelected)="selectOption($event)"
            (inputKeyUp)="inputKeyUp($event)"
            (inputBlur)="chosenBlur()"></div>

    </div>

    `,
    directives: [CORE_DIRECTIVES, [ChosenDropComponent]]
})
export class ChosenSingleComponent extends AbstractChosenComponent<string> {

    singleSelectedOption:InternalChosenOption;

    @Input()
    no_results_text = AbstractChosenComponent.NO_RESULTS_TEXT_DEFAULT;
    @Input()
    allow_single_deselect:boolean = false;
    @Input()
    placeholder_text_single:string = "Select an Option";
    @Input()
    disable_search = false;
    @Input()
    disable_search_threshold:number = 0;
    @Input()
    max_shown_results = null;

    @Input()
    protected set options(options:Array<ChosenOption>) {
        super.setOptions(options);
    }

    @ViewChildren(ChosenDropComponent)
    chosenDropComponentQuery;

    constructor(private model:NgModel, private el:ElementRef, private renderer:Renderer) {
        super(model, el, renderer);
    }

    updateOptionsWithSelection() {
        if (this.options_ != null && this.initialValue != null) {
            let initialValue = <string>this.initialValue;
            for (var i = 0; i < this.options_.length; i++) {
                let option = this.options_[i];
                if (initialValue === option.value) {
                    this.singleSelectedOption = option;
                    option.selected = true;
                    break;
                }
            }
        }
    }

    isSelectionEmpty():boolean {
        return this.singleSelectedOption == null;
    }

    updateModel() {
        if (this.singleSelectedOption == null) {
            this.onChange(null);
        } else {
            this.onChange(this.singleSelectedOption.value);
        }
    }

    selectOption(option) {
        if (this.singleSelectedOption != null) {
            this.singleSelectedOption.selected = false;
        }

        this.singleSelectedOption = option;
        option.selected = true;

        this.updateModel();
        this.chosenBlur();
    }

    deselectOption(option, $event) {
        if ($event != null) {
            $event.stopPropagation();
        }
        option.selected = false;
        this.singleSelectedOption = null;
        this.updateModel();
    }

    onChosenFocus() {
        this.chosenDropComponentQuery.first.inputFocus();
    }

    onChosenBlur() {

    }
}

@Component({
    selector: 'chosen-multiple',
    template: `
    <div class="chosen-container chosen-container-multi"
        [class.chosen-container-active]="chosenContainerActive"
        [class.chosen-with-drop]="chosenWithDrop">

        <ul class="chosen-choices">

                <template [ngIf]="options_ != null">
                    <template ngFor #option [ngForOf]="options_" #i="index">
                        <li *ngIf="option.selected" class="search-choice">
                            <span>{{option.label}}</span>
                            <a class="search-choice-close" (click)="chosenInput.focus();deselectOption(option, $event);" data-option-array-index="4"></a>
                        </li>
                    </template>
                </template>

                <li class="search-field">
                    <input #chosenInput type="text"
                    [(ngModel)]="inputValue"
                    [class.default]="isSelectionEmpty()"
                    (focus)="chosenFocus()"
                    (blur)="chosenBlur()"
                    (keyup)="inputKeyUp($event.target.value)"
                    tabindex="i" autocomplete="off"/>
                </li>
        </ul>

        <div  class="chosen-drop"
            [disable_search]="true"
            [no_results_text]="no_results_text"
            [filterMode]="filterMode"
            [options]="options_"
            (optionSelected)="selectOption($event)"></div>

    </div>

    `,
    directives: [CORE_DIRECTIVES, [ChosenDropComponent]]
})
export class ChosenMultipleComponent extends AbstractChosenComponent<Array<string>> {

    @Input()
    no_results_text = AbstractChosenComponent.NO_RESULTS_TEXT_DEFAULT;
    @Input()
    placeholder_text_multiple:string = "Select Some Options";
    @Input()
    max_shown_results = null;

    @Input()
    protected set options(options:Array<ChosenOption>) {
        super.setOptions(options);
    }

    selectionCount:number = 0;

    constructor(private model:NgModel, private el:ElementRef, private renderer:Renderer) {
        super(model, el, renderer);
    }

    updateOptionsWithSelection() {
        if (this.options_ != null && this.initialValue != null) {
            let initialValue = <Array<string>>this.initialValue;
            this.options_.forEach(option => {
                if (initialValue.find(value => value == option.value) != null) {
                    option.selected = true;
                    this.selectionCount++;
                } else {
                    option.selected = false;
                }
            })
        }
    }

    updateModel() {
        this.onChange(this.options_.filter(option => option.selected).map(option => option.value));
    }

    isSelectionEmpty():boolean {
        return this.selectionCount == 0;
    }

    selectOption(option) {
        option.selected = true;
        this.selectionCount++;
        this.updateModel();
        this.chosenBlur();
    }

    deselectOption(option, $event) {
        if ($event != null) {
            $event.stopPropagation();
        }
        option.selected = false;
        this.selectionCount--;
        this.updateModel();
    }

    onChosenFocus() {
        this.inputValue = null;
    }

    onChosenBlur() {
        if (this.isSelectionEmpty()) {
            this.inputValue = this.placeholder_text_multiple;
        } else {
            this.inputValue = null;
        }
    }
}



