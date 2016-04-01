import {CORE_DIRECTIVES, NG_VALUE_ACCESSOR, FORM_DIRECTIVES, DefaultValueAccessor, NgModel} from 'angular2/common';
import {Component, Input, Output, Host, ViewChildren,QueryList, ElementRef, Renderer, EventEmitter} from 'angular2/core';

export interface ChosenOptionGroup {
    value:string,
    label:string,
}

interface InternalChosenOptionGroup extends ChosenOptionGroup {
    index:number;
}

export interface ChosenOption {
    value:string,
    label:string,
    group?:string;
}

interface InternalChosenOption extends ChosenOption {
    selected?:boolean;
    hit?:boolean;
    labelWithMark?:string;
    groupIndex?:number;
    groupObject?:InternalChosenOptionGroup;
    highlighted?:boolean;
    focus?:boolean;
}

@Component({
    selector: 'div.chosen-drop',
    template: `
        <div *ngIf="!isSearchDisabled()" class="chosen-search">
            <input (blur)="onInputBlur()" (keyup)="onInputKeyup($event.target.value)" [(ngModel)]="inputValue" #chosenInput type="text" autocomplete="off">
        </div>
        <ul class="chosen-results">
            <template ngFor #option [ngForOf]="options_" #i="index">
                <template [ngIf]="isOptionVisible(option)">
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
    display_selected_options:boolean = false;

    @Input()
    filterMode:boolean = false;

    @Output()
    optionSelected:EventEmitter<InternalChosenOption> = new EventEmitter();

    @Output()
    inputKeyUp:EventEmitter<string> = new EventEmitter();

    @Output()
    inputBlur:EventEmitter<boolean> = new EventEmitter();

    @ViewChildren('chosenInput')
    chosenInputQueryList;

    @Input()
    set options(options:Array<InternalChosenOption>) {
        this.options_ = options;
    }

    @Input()
    set groups(groups:Array<InternalChosenOptionGroup>) {
        this.groups_ = groups;
    }

    options_:Array<InternalChosenOption>;

    groups_:Array<InternalChosenOptionGroup>;

    highlightedOption:InternalChosenOption;

    highlight(option:InternalChosenOption) {
        if (this.highlightedOption != null) {
            this.highlightedOption.highlighted = false;
        }
        if (!this.isOptionSelected(option) || this.display_selected_options) {
            option.highlighted = true;
            this.highlightedOption = option;
        }
    }

    unHighlight(option:InternalChosenOption) {
        option.highlighted = false;
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
        this.chosenInputQueryList.first.nativeElement.focus();
    }

    showGroup(option:InternalChosenOption, i:number) {
        if (option.group != null && option.groupObject != null) {
            if (i == 0) {
                return true;
            } else {
                if (this.filterMode) {
                    for (let j = i - 1; j > 0; j--) {
                        if (this.options_[j].hit) {
                            return this.options_[j].group != option.group;
                        }
                    }
                    return true;
                } else {
                    return this.options_[i - 1].group != option.group;
                }
            }
        } else {
            return false;
        }
    }
}

abstract class AbstractChosenComponent<T> extends DefaultValueAccessor {

    protected static NO_RESULTS_TEXT_DEFAULT = "No results match";

    protected chosenDropComponent:ChosenDropComponent;

    protected initialValue:T;

    public options_:Array<InternalChosenOption>;

    groups_:Array<InternalChosenOptionGroup>;

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
                return {value: option.value, label: option.label, selected: false, hit: false, group: option.group};
            });
            this.updateOptions();
        }
    }

    protected setGroups(groups:Array<ChosenOptionGroup>) {
        if (groups != null) {
            this.groups_ = [];
            for (let i = 0; i < groups.length; i++) {
                let group:ChosenOptionGroup = groups[i];
                this.groups_.push({value: group.value, label: group.label, index: i});
                this.updateOptions();
            }
        }
    }

    writeValue(value:T):void {
        if (value != null) {
            this.initialValue = value;
            this.updateOptions();
        }
    }

    protected updateOptions() {
        if (this.options_ != null) {
            if (this.initialValue != null) {
                let initialSelection:Array<InternalChosenOption> = [];
                this.options_.forEach((option:InternalChosenOption) => {
                    if (this.isOptionInitiallySelected(option)) {
                        initialSelection.push(option);
                        option.selected = true;
                    } else {
                        option.selected = false;
                    }
                })
                this.initialSelection(initialSelection);
            }

            if (this.groups_ != null) {
                this.options_.forEach((option:InternalChosenOption) => {
                    if (option.group != null) {
                        let optionGroup:InternalChosenOptionGroup = this.groups_.find(group => group.value == option.group);
                        option.groupIndex = optionGroup.index;
                        option.groupObject = optionGroup;
                    } else {
                        option.groupIndex = -1;
                    }
                })
                this.options_.sort((a:InternalChosenOption, b:InternalChosenOption) => a.groupIndex - b.groupIndex);
            }
        }
    }

    protected inputKeyUp(inputValue) {
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
        this.highlightOption();
    }

    highlightOption() {
        let optionToHighlight = this.getOptionToHighlight();
        if (optionToHighlight != null) {
            this.chosenDropComponent.highlight(optionToHighlight);
        }
    }

    abstract getOptionToHighlight():InternalChosenOption;

    abstract isOptionInitiallySelected(InternalChosenOption):boolean;

    abstract initialSelection(initialSelection:Array<InternalChosenOption>);

    abstract isSelectionEmpty():boolean;

    abstract updateModel();

    abstract selectOption(option:InternalChosenOption)

    abstract deselectOption(option:InternalChosenOption, event);

    chosenFocus() {
        if (!this.onChosenFocus()) {
            return;
        }

        this.chosenContainerActive = true;
        this.chosenWithDrop = true;
        this.highlightOption();
    }

    abstract onChosenFocus():boolean;

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
            [display_selected_options]="true"
            [filterMode]="filterMode"
            [options]="options_" [groups]="groups_"
            (optionSelected)="selectOption($event)"
            (inputKeyUp)="inputKeyUp($event)"
            (inputBlur)="chosenBlur()"></div>
    </div>`,
    directives: [CORE_DIRECTIVES, [ChosenDropComponent]]
})
export class ChosenSingleComponent extends AbstractChosenComponent<string> {

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

    @Input()
    protected set groups(groups:Array<ChosenOptionGroup>) {
        super.setGroups(groups);
    }

    @ViewChildren(ChosenDropComponent)
    chosenDropComponentQueryList : QueryList<ChosenDropComponent>;

    singleSelectedOption:InternalChosenOption;

    constructor(private model:NgModel, private el:ElementRef, private renderer:Renderer) {
        super(model, el, renderer);
    }

    ngAfterViewInit() {
        this.chosenDropComponent = this.chosenDropComponentQueryList.first;
    }

    isOptionInitiallySelected(option:InternalChosenOption):boolean {
        return this.initialValue == option.value;
    }

    initialSelection(initialSelection:Array<InternalChosenOption>) {
        if (initialSelection != null && initialSelection.length > 0) {
            this.singleSelectedOption = initialSelection[0];
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
        this.chosenDropComponentQueryList.first.unHighlight(option);
        this.singleSelectedOption = null;
        this.updateModel();
    }

    onChosenFocus():boolean {
        this.chosenDropComponentQueryList.first.inputFocus();
        return true;
    }

    getOptionToHighlight() {
        if (!this.filterMode) {
            if (this.singleSelectedOption != null) {
                return this.singleSelectedOption;
            }
        } else {
            if (this.options_ != null) {
                let firstHitOption = this.options_.find((option:InternalChosenOption) => option.hit);
                if (firstHitOption != null) {
                    return firstHitOption;
                }
            }
        }
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

                <template [ngIf]="multipleSelectedOptions != null">
                    <template ngFor #option [ngForOf]="multipleSelectedOptions" #i="index">
                        <li class="search-choice">
                            <span>{{option.label}}</span>
                            <a class="search-choice-close" (click)="deselectOption(option, $event);"></a>
                        </li>
                    </template>
                </template>

                <li class="search-field">
                    <input #chosenInput type="text"
                    [(ngModel)]="inputValue"
                    [class.default]="isSelectionEmpty()"
                    (click)="chosenFocus()"
                    (blur)="chosenBlur()"
                    (keyup)="multipleInputKeyUp($event)"
                    autocomplete="off"/>
                </li>
        </ul>

        <div  class="chosen-drop"
            [disable_search]="true"
            [no_results_text]="no_results_text"
            [display_selected_options]="false"
            [filterMode]="filterMode"
            [options]="options_" [groups]="groups_"
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

    @Input()
    protected set groups(groups:Array<ChosenOptionGroup>) {
        super.setGroups(groups);
    }

    @Input()
    single_backstroke_delete:boolean = false;

    @Input()
    max_selected_options:number = null;

    @Output()
    maxselected:EventEmitter<boolean> = new EventEmitter();

    @ViewChildren(ChosenDropComponent)
    chosenDropComponentQueryList: QueryList<ChosenDropComponent>;

    multipleSelectedOptions:Array<InternalChosenOption>;

    previousInputLength:number = 0;

    selectionCount:number = 0;

    constructor(private model:NgModel, private el:ElementRef, private renderer:Renderer) {
        super(model, el, renderer);
    }

    ngAfterViewInit() {
        this.chosenDropComponent = this.chosenDropComponentQueryList.first;
    }

    updateModel() {
        if (this.multipleSelectedOptions != null) {
            this.onChange(this.multipleSelectedOptions.map((option:InternalChosenOption) => option.value));
        } else {
            this.onChange(null);
        }
    }

    isOptionInitiallySelected(option:InternalChosenOption):boolean {
        if (this.initialValue == null) {
            return false;
        }
        return this.initialValue.find(value => value == option.value) != null;
    }

    initialSelection(initialSelection:Array<InternalChosenOption>) {
        if (initialSelection != null) {
            this.multipleSelectedOptions = initialSelection;
            this.selectionCount = initialSelection.length;
            console.log(this.selectionCount);
        }
    }

    isSelectionEmpty():boolean {
        return this.selectionCount == 0;
    }

    selectOption(option) {
        if (this.multipleSelectedOptions == null) {
            this.multipleSelectedOptions = [];
        }

        option.selected = true;
        this.multipleSelectedOptions.push(option);
        this.selectionCount++;

        if (this.max_selected_options != null && this.selectionCount == this.max_selected_options) {
            this.maxselected.emit(true);
        }

        this.updateModel();
        this.chosenBlur();
    }

    deselectOption(option, $event) {
        if ($event != null) {
            $event.stopPropagation();
        }
        option.selected = false;
        this.multipleSelectedOptions = this.multipleSelectedOptions.filter((option_:InternalChosenOption) => option_ != option);
        this.selectionCount--;
        this.updateModel();
    }

    onChosenFocus():boolean {
        if (this.max_selected_options != null && this.selectionCount == this.max_selected_options) {
            return false;
        }
        this.inputValue = null;
        return true;
    }

    onChosenBlur() {
        if (this.isSelectionEmpty()) {
            this.inputValue = this.placeholder_text_multiple;
        } else {
            this.inputValue = null;
        }
    }

    multipleInputKeyUp($event) {
        let value = $event.target.value;
        if ($event.code == "Backspace" && this.previousInputLength == 0) {
            this.deselectOption(this.multipleSelectedOptions[this.multipleSelectedOptions.length-1],null);
            return;
        }
        this.inputKeyUp(value);
        this.previousInputLength = value.length;
    }

    getOptionToHighlight() {
        if (this.options_ != null) {
            let firstNonSelectedOption = this.options_.find((option:InternalChosenOption) => {
                let selected = this.multipleSelectedOptions.find((option_) => option_ == option) != null;
                return !selected && (!this.filterMode || (this.filterMode && option.hit ))
            });
            if (firstNonSelectedOption != null) {
                return firstNonSelectedOption;
            }
        }
        return null;
    }
}



