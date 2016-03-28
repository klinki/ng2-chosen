import {CORE_DIRECTIVES,NG_VALUE_ACCESSOR,FORM_DIRECTIVES,DefaultValueAccessor,NgModel} from 'angular2/common';
import {Component,Input,Output,Host,ViewChildren,ElementRef,Renderer,EventEmitter} from 'angular2/core';

export interface ChosenOption {
    value :string,
    label : string,
}

interface InternalChosenOption extends ChosenOption {
    selected? : boolean;
    hit? : boolean;
    labelWithMark? : string;
}

@Component({
    selector: 'div.chosen-drop',
    template: `
        <div *ngIf="!disableSearch()" class="chosen-search">
            <input   (blur)="chosenBlur()" (keyup)="onInputKeyUp($event.target.value)" [(ngModel)]="inputValue" #chosenInput type="text" autocomplete="off" tabindex="5">
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

            <li *ngIf="filterMode && filterResultCount == 0" class="no-results">{{no_results_text}} "<span>{{inputValue}}</span>"</li>
        </ul>

    `,
    directives: [CORE_DIRECTIVES, FORM_DIRECTIVES]
})
class ChosenDropComponent {

    @Input() disable_search = false;
    @Input() disable_search_threshold = 0;
    @Input() no_results_text = 0;

    @Input() filterMode:boolean = false;
    @Input() options_:Array<InternalChosenOption>;

    inputValue:string;

    @Output() optionSelected:EventEmitter<InternalChosenOption> = new EventEmitter();
    @Output() inputKeyUp:EventEmitter<string> = new EventEmitter();
    @Output() inputBlur:EventEmitter<boolean> = new EventEmitter();

    @ViewChildren('chosenInput')
    chosenInputQuery;

    @Input()
    set options(options:Array<ChosenOption>) {
        this.options_ = options;
        console.log(options);
    }

    disableSearch() {
        return this.disable_search
            || (this.disable_search_threshold != 0 && this.options_ != null && this.options_.length <= this.disable_search_threshold);
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
        this.optionSelected.emit(option)
    }

    isOptionSelected(option) {
        return option.selected;
    }

    onInputKeyUp(value) {
        this.inputKeyUp.emit(value);
    }

    chosenBlur() {
        this.inputValue = null;
        this.inputBlur.emit(true);
    }

    inputFocus() {
        this.chosenInputQuery.first.nativeElement.focus();
    }
}

abstract class AbstractChosenComponent<T> extends DefaultValueAccessor {

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

    abstract optionSelect(option:InternalChosenOption)

    abstract optionDeselect(option:InternalChosenOption, event);

    abstract chosenFocus(chosenInput);

    abstract chosenBlur();
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
                    (click)="optionDeselect(singleSelectedOption , $event)" class="search-choice-close">
                </abbr>

                <div><b></b></div>
        </a>

        <div class="chosen-drop"
            [disable_search]="disable_search"
            [disable_search_threshold]="disable_search_threshold"
            [no_results_text]="no_results_text"
            [filterMode]="filterMode"
            [options]="options_"
            (optionSelected)="optionSelect($event)"
            (inputKeyUp)="inputKeyUp($event)"
            (inputBlur)="chosenBlur()"></div>

    </div>

    `,
    directives: [CORE_DIRECTIVES, [ChosenDropComponent]]
})
export class ChosenSingleComponent extends AbstractChosenComponent<string> {

    @Input() public no_results_text = "No results match";
    @Input() public max_shown_results = null;

    @Input() placeholder_text_single:string = "Select an Option";
    @Input() allow_single_deselect:boolean = false;
    @Input() disable_search = false;
    @Input() disable_search_threshold:number = 0;

    singleSelectedOption:InternalChosenOption;

    @ViewChildren(ChosenDropComponent) chosenDropComponentQuery;

    constructor(private model:NgModel, private el:ElementRef, private renderer:Renderer) {
        super(model, el, renderer);
    }

    @Input()
    protected set options(options:Array<ChosenOption>) {
        super.setOptions(options);
    }

    updateOptionsWithSelection() {
        if (this.options_ != null && this.initialValue != null) {
            for (var i = 0; i < this.options_.length; i++) {
                let option = this.options_[i];
                let initialValue = <string>this.initialValue;
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

    optionSelect(option) {
        if (this.singleSelectedOption != null) {
            this.singleSelectedOption.selected = false;
        }

        this.singleSelectedOption = option;
        option.selected = true;

        this.updateModel();
        this.chosenBlur();
    }

    optionDeselect(option, $event) {
        if ($event != null) {
            $event.stopPropagation();
        }
        option.selected = false;
        this.singleSelectedOption = null;
        this.updateModel();
    }

    chosenFocus(chosenInput) {

        this.chosenDropComponentQuery.first.inputFocus();

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
                            <a class="search-choice-close" (click)="chosenInput.focus();optionDeselect(option, $event);" data-option-array-index="4"></a>
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
            (optionSelected)="optionSelect($event)"></div>

    </div>

    `,
    directives: [CORE_DIRECTIVES, [ChosenDropComponent]]
})
export class ChosenMultipleComponent extends AbstractChosenComponent<Array<string>> {

    @Input() public no_results_text = "No results match";
    @Input() public max_shown_results = null;

    @Input() placeholder_text_multiple:string = "Select Some Options";

    constructor(private model:NgModel, private el:ElementRef, private renderer:Renderer) {
        super(model, el, renderer);
    }

    @Input()
    protected set options(options:Array<ChosenOption>) {
        super.setOptions(options);
    }

    updateOptionsWithSelection() {
        if (this.options_ != null && this.initialValue != null) {
            for (var i = 0; i < this.options_.length; i++) {
                let option = this.options_[i];
                let initialValue = <Array<string>>this.initialValue;
                if (initialValue.find(value => value == option.value) != null) {
                    option.selected = true;
                } else {
                    option.selected = false;
                }
            }
        }
    }

    updateModel() {
        this.onChange(this.options_.filter(option => option.selected).map(option => option.value));
    }

    isSelectionEmpty():boolean {
        if (this.options_ == null) {
            return true;
        }
        return this.options_.find(option => option.selected) == null;
    }

    optionSelect(option) {
        option.selected = true;
        this.updateModel();
        this.chosenBlur();
    }

    optionDeselect(option, $event) {
        if ($event != null) {
            $event.stopPropagation();
        }
        option.selected = false;
        this.updateModel();
    }

    chosenFocus(chosenInput) {
        if (chosenInput != null) {
            chosenInput.focus();
        }
        this.chosenContainerActive = true;
        this.chosenWithDrop = true;

        this.inputValue = null;
    }

    chosenBlur() {
        this.chosenContainerActive = false;
        this.chosenWithDrop = false;
        this.filterMode = false;

        if (this.isSelectionEmpty()) {
            this.inputValue = this.placeholder_text_multiple;
        } else {
            this.inputValue = null;
        }
    }
}



