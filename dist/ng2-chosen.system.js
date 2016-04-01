var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
System.register("chosen", ['angular2/common', 'angular2/core'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var common_1, core_1;
    var ChosenDropComponent, AbstractChosenComponent, ChosenSingleComponent, ChosenMultipleComponent;
    return {
        setters:[
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            ChosenDropComponent = (function () {
                function ChosenDropComponent() {
                    this.disable_search = false;
                    this.disable_search_threshold = 0;
                    this.display_selected_options = false;
                    this.filterMode = false;
                    this.optionSelected = new core_1.EventEmitter();
                    this.inputKeyUp = new core_1.EventEmitter();
                    this.inputBlur = new core_1.EventEmitter();
                }
                Object.defineProperty(ChosenDropComponent.prototype, "options", {
                    set: function (options) {
                        this.options_ = options;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ChosenDropComponent.prototype, "groups", {
                    set: function (groups) {
                        this.groups_ = groups;
                    },
                    enumerable: true,
                    configurable: true
                });
                ChosenDropComponent.prototype.highlight = function (option) {
                    if (this.highlightedOption != null) {
                        this.highlightedOption.highlighted = false;
                    }
                    if (!this.isOptionSelected(option) || this.display_selected_options) {
                        option.highlighted = true;
                        this.highlightedOption = option;
                    }
                };
                ChosenDropComponent.prototype.unHighlight = function (option) {
                    option.highlighted = false;
                };
                ChosenDropComponent.prototype.isSearchDisabled = function () {
                    return this.disable_search
                        || (this.disable_search_threshold != 0 && this.options_ != null && this.options_.length <= this.disable_search_threshold);
                };
                ChosenDropComponent.prototype.isOptionVisible = function (option) {
                    return !this.filterMode || (this.filterMode && option.hit);
                };
                ChosenDropComponent.prototype.getOptionLabel = function (option) {
                    if (this.filterMode) {
                        return option.labelWithMark;
                    }
                    else {
                        return option.label;
                    }
                };
                ChosenDropComponent.prototype.selectOption = function (option) {
                    this.optionSelected.emit(option);
                };
                ChosenDropComponent.prototype.isOptionSelected = function (option) {
                    return option.selected;
                };
                ChosenDropComponent.prototype.onInputKeyup = function (value) {
                    this.inputKeyUp.emit(value);
                };
                ChosenDropComponent.prototype.onInputBlur = function () {
                    this.inputValue = null;
                    this.inputBlur.emit(true);
                };
                ChosenDropComponent.prototype.inputFocus = function () {
                    this.chosenInputQueryList.first.nativeElement.focus();
                };
                ChosenDropComponent.prototype.showGroup = function (option, i) {
                    if (option.group != null && option.groupObject != null) {
                        if (i == 0) {
                            return true;
                        }
                        else {
                            if (this.filterMode) {
                                for (var j = i - 1; j > 0; j--) {
                                    if (this.options_[j].hit) {
                                        return this.options_[j].group != option.group;
                                    }
                                }
                                return true;
                            }
                            else {
                                return this.options_[i - 1].group != option.group;
                            }
                        }
                    }
                    else {
                        return false;
                    }
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], ChosenDropComponent.prototype, "disable_search", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], ChosenDropComponent.prototype, "disable_search_threshold", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], ChosenDropComponent.prototype, "no_results_text", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Boolean)
                ], ChosenDropComponent.prototype, "display_selected_options", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Boolean)
                ], ChosenDropComponent.prototype, "filterMode", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', (typeof (_a = typeof core_1.EventEmitter !== 'undefined' && core_1.EventEmitter) === 'function' && _a) || Object)
                ], ChosenDropComponent.prototype, "optionSelected", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', (typeof (_b = typeof core_1.EventEmitter !== 'undefined' && core_1.EventEmitter) === 'function' && _b) || Object)
                ], ChosenDropComponent.prototype, "inputKeyUp", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', (typeof (_c = typeof core_1.EventEmitter !== 'undefined' && core_1.EventEmitter) === 'function' && _c) || Object)
                ], ChosenDropComponent.prototype, "inputBlur", void 0);
                __decorate([
                    core_1.ViewChildren('chosenInput'), 
                    __metadata('design:type', Object)
                ], ChosenDropComponent.prototype, "chosenInputQueryList", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Array), 
                    __metadata('design:paramtypes', [Array])
                ], ChosenDropComponent.prototype, "options", null);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Array), 
                    __metadata('design:paramtypes', [Array])
                ], ChosenDropComponent.prototype, "groups", null);
                ChosenDropComponent = __decorate([
                    core_1.Component({
                        selector: 'div.chosen-drop',
                        template: "\n        <div *ngIf=\"!isSearchDisabled()\" class=\"chosen-search\">\n            <input (blur)=\"onInputBlur()\" (keyup)=\"onInputKeyup($event.target.value)\" [(ngModel)]=\"inputValue\" #chosenInput type=\"text\" autocomplete=\"off\">\n        </div>\n        <ul class=\"chosen-results\">\n            <template ngFor #option [ngForOf]=\"options_\" #i=\"index\">\n                <template [ngIf]=\"isOptionVisible(option)\">\n                 <li *ngIf=\"showGroup(option,i)\" class=\"group-result\">{{option.groupObject.label}}</li>\n                 <li [class.highlighted]=\"option.highlighted\"\n                    [class.result-selected]=\"isOptionSelected(option)\"\n                    [class.active-result]=\"!isOptionSelected(option) || display_selected_options\"\n                    (mouseover)=\"highlight(option)\"\n                    (mouseout)=\"unHighlight(option)\"\n                    (mousedown)=\"selectOption(option)\">\n                    <span [innerHtml]=\"getOptionLabel(option)\"></span>\n                </li>\n                </template>\n            </template>\n            <li *ngIf=\"filterMode && filterResultCount == 0\" class=\"no-results\">{{no_results_text}} \"<span>{{inputValue}}</span>\"</li>\n        </ul>\n    ",
                        directives: [common_1.CORE_DIRECTIVES, common_1.FORM_DIRECTIVES]
                    }), 
                    __metadata('design:paramtypes', [])
                ], ChosenDropComponent);
                return ChosenDropComponent;
                var _a, _b, _c;
            }());
            AbstractChosenComponent = (function (_super) {
                __extends(AbstractChosenComponent, _super);
                function AbstractChosenComponent(model, el, renderer) {
                    _super.call(this, renderer, el);
                    this.model = model;
                    this.el = el;
                    this.renderer = renderer;
                    this.chosenContainerActive = false;
                    this.chosenWithDrop = false;
                    this.filterMode = false;
                    this.filterResultCount = 0;
                    model.valueAccessor = this;
                }
                AbstractChosenComponent.prototype.setOptions = function (options) {
                    if (options != null) {
                        this.options_ = options.map(function (option) {
                            return { value: option.value, label: option.label, selected: false, hit: false, group: option.group };
                        });
                        this.updateOptions();
                    }
                };
                AbstractChosenComponent.prototype.setGroups = function (groups) {
                    if (groups != null) {
                        this.groups_ = [];
                        for (var i = 0; i < groups.length; i++) {
                            var group = groups[i];
                            this.groups_.push({ value: group.value, label: group.label, index: i });
                            this.updateOptions();
                        }
                    }
                };
                AbstractChosenComponent.prototype.writeValue = function (value) {
                    if (value != null) {
                        this.initialValue = value;
                        this.updateOptions();
                    }
                };
                AbstractChosenComponent.prototype.updateOptions = function () {
                    var _this = this;
                    if (this.options_ != null) {
                        if (this.initialValue != null) {
                            var initialSelection_1 = [];
                            this.options_.forEach(function (option) {
                                if (_this.isOptionInitiallySelected(option)) {
                                    initialSelection_1.push(option);
                                    option.selected = true;
                                }
                                else {
                                    option.selected = false;
                                }
                            });
                            this.initialSelection(initialSelection_1);
                        }
                        if (this.groups_ != null) {
                            this.options_.forEach(function (option) {
                                if (option.group != null) {
                                    var optionGroup = _this.groups_.find(function (group) { return group.value == option.group; });
                                    option.groupIndex = optionGroup.index;
                                    option.groupObject = optionGroup;
                                }
                                else {
                                    option.groupIndex = -1;
                                }
                            });
                            this.options_.sort(function (a, b) { return a.groupIndex - b.groupIndex; });
                        }
                    }
                };
                AbstractChosenComponent.prototype.inputKeyUp = function (inputValue) {
                    var _this = this;
                    if (inputValue.trim().length > 0) {
                        this.filterResultCount = 0;
                        this.options_.forEach(function (option) {
                            var indexOf = option.label.toLowerCase().indexOf(inputValue.toLowerCase());
                            if (indexOf > -1) {
                                var subString = option.label.substring(indexOf, inputValue.length);
                                option.labelWithMark = option.label.replace(subString, "<em>" + subString + "</em>");
                                option.hit = true;
                                _this.filterResultCount++;
                            }
                            else {
                                option.hit = false;
                            }
                        });
                        this.filterMode = true;
                    }
                    else {
                        this.filterResultCount = 0;
                        this.filterMode = false;
                    }
                    this.highlightOption();
                };
                AbstractChosenComponent.prototype.highlightOption = function () {
                    var optionToHighlight = this.getOptionToHighlight();
                    if (optionToHighlight != null) {
                        this.chosenDropComponent.highlight(optionToHighlight);
                    }
                };
                AbstractChosenComponent.prototype.chosenFocus = function () {
                    if (!this.onChosenFocus()) {
                        return;
                    }
                    this.chosenContainerActive = true;
                    this.chosenWithDrop = true;
                    this.highlightOption();
                };
                AbstractChosenComponent.prototype.chosenBlur = function () {
                    this.chosenContainerActive = false;
                    this.chosenWithDrop = false;
                    this.filterMode = false;
                    this.onChosenBlur();
                };
                AbstractChosenComponent.NO_RESULTS_TEXT_DEFAULT = "No results match";
                return AbstractChosenComponent;
            }(common_1.DefaultValueAccessor));
            ChosenSingleComponent = (function (_super) {
                __extends(ChosenSingleComponent, _super);
                function ChosenSingleComponent(model, el, renderer) {
                    _super.call(this, model, el, renderer);
                    this.model = model;
                    this.el = el;
                    this.renderer = renderer;
                    this.no_results_text = AbstractChosenComponent.NO_RESULTS_TEXT_DEFAULT;
                    this.allow_single_deselect = false;
                    this.placeholder_text_single = "Select an Option";
                    this.disable_search = false;
                    this.disable_search_threshold = 0;
                    this.max_shown_results = null;
                }
                Object.defineProperty(ChosenSingleComponent.prototype, "options", {
                    set: function (options) {
                        _super.prototype.setOptions.call(this, options);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ChosenSingleComponent.prototype, "groups", {
                    set: function (groups) {
                        _super.prototype.setGroups.call(this, groups);
                    },
                    enumerable: true,
                    configurable: true
                });
                ChosenSingleComponent.prototype.ngAfterViewInit = function () {
                    this.chosenDropComponent = this.chosenDropComponentQueryList.first;
                };
                ChosenSingleComponent.prototype.isOptionInitiallySelected = function (option) {
                    return this.initialValue == option.value;
                };
                ChosenSingleComponent.prototype.initialSelection = function (initialSelection) {
                    if (initialSelection != null && initialSelection.length > 0) {
                        this.singleSelectedOption = initialSelection[0];
                    }
                };
                ChosenSingleComponent.prototype.isSelectionEmpty = function () {
                    return this.singleSelectedOption == null;
                };
                ChosenSingleComponent.prototype.updateModel = function () {
                    if (this.singleSelectedOption == null) {
                        this.onChange(null);
                    }
                    else {
                        this.onChange(this.singleSelectedOption.value);
                    }
                };
                ChosenSingleComponent.prototype.selectOption = function (option) {
                    this.singleSelectedOption = option;
                    option.selected = true;
                    this.updateModel();
                    this.chosenBlur();
                };
                ChosenSingleComponent.prototype.deselectOption = function (option, $event) {
                    if ($event != null) {
                        $event.stopPropagation();
                    }
                    option.selected = false;
                    this.chosenDropComponentQueryList.first.unHighlight(option);
                    this.singleSelectedOption = null;
                    this.updateModel();
                };
                ChosenSingleComponent.prototype.onChosenFocus = function () {
                    this.chosenDropComponentQueryList.first.inputFocus();
                    return true;
                };
                ChosenSingleComponent.prototype.getOptionToHighlight = function () {
                    if (!this.filterMode) {
                        if (this.singleSelectedOption != null) {
                            return this.singleSelectedOption;
                        }
                    }
                    else {
                        if (this.options_ != null) {
                            var firstHitOption = this.options_.find(function (option) { return option.hit; });
                            if (firstHitOption != null) {
                                return firstHitOption;
                            }
                        }
                    }
                };
                ChosenSingleComponent.prototype.onChosenBlur = function () {
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], ChosenSingleComponent.prototype, "no_results_text", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Boolean)
                ], ChosenSingleComponent.prototype, "allow_single_deselect", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], ChosenSingleComponent.prototype, "placeholder_text_single", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], ChosenSingleComponent.prototype, "disable_search", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Number)
                ], ChosenSingleComponent.prototype, "disable_search_threshold", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], ChosenSingleComponent.prototype, "max_shown_results", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Array), 
                    __metadata('design:paramtypes', [Array])
                ], ChosenSingleComponent.prototype, "options", null);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Array), 
                    __metadata('design:paramtypes', [Array])
                ], ChosenSingleComponent.prototype, "groups", null);
                __decorate([
                    core_1.ViewChildren(ChosenDropComponent), 
                    __metadata('design:type', (typeof (_a = typeof core_1.QueryList !== 'undefined' && core_1.QueryList) === 'function' && _a) || Object)
                ], ChosenSingleComponent.prototype, "chosenDropComponentQueryList", void 0);
                ChosenSingleComponent = __decorate([
                    core_1.Component({
                        selector: 'chosen-single',
                        template: "\n    <div class=\"chosen-container chosen-container-single\"\n        [class.chosen-container-active]=\"chosenContainerActive\"\n        [class.chosen-with-drop]=\"chosenWithDrop\">\n\n         <a (click)=\"chosenFocus(chosenInput)\"  class=\"chosen-single\"\n               [class.chosen-single-with-deselect]=\"!isSelectionEmpty() && allow_single_deselect\"\n               [class.chosen-default]=\"isSelectionEmpty()\">\n\n                <span [ngSwitch]=\"isSelectionEmpty()\">\n                    <template [ngSwitchWhen]=\"true\">\n                        {{placeholder_text_single}}\n                    </template>\n                    <template [ngSwitchWhen]=\"false\">\n                        {{singleSelectedOption.label}}\n                    </template>\n                </span>\n                <abbr *ngIf=\"!isSelectionEmpty() && allow_single_deselect\"\n                    (click)=\"deselectOption(singleSelectedOption , $event)\" class=\"search-choice-close\">\n                </abbr>\n                <div><b></b></div>\n        </a>\n\n        <div class=\"chosen-drop\"\n            [disable_search]=\"disable_search\"\n            [disable_search_threshold]=\"disable_search_threshold\"\n            [no_results_text]=\"no_results_text\"\n            [display_selected_options]=\"true\"\n            [filterMode]=\"filterMode\"\n            [options]=\"options_\" [groups]=\"groups_\"\n            (optionSelected)=\"selectOption($event)\"\n            (inputKeyUp)=\"inputKeyUp($event)\"\n            (inputBlur)=\"chosenBlur()\"></div>\n    </div>",
                        directives: [common_1.CORE_DIRECTIVES, [ChosenDropComponent]]
                    }), 
                    __metadata('design:paramtypes', [(typeof (_b = typeof common_1.NgModel !== 'undefined' && common_1.NgModel) === 'function' && _b) || Object, (typeof (_c = typeof core_1.ElementRef !== 'undefined' && core_1.ElementRef) === 'function' && _c) || Object, (typeof (_d = typeof core_1.Renderer !== 'undefined' && core_1.Renderer) === 'function' && _d) || Object])
                ], ChosenSingleComponent);
                return ChosenSingleComponent;
                var _a, _b, _c, _d;
            }(AbstractChosenComponent));
            exports_1("ChosenSingleComponent", ChosenSingleComponent);
            ChosenMultipleComponent = (function (_super) {
                __extends(ChosenMultipleComponent, _super);
                function ChosenMultipleComponent(model, el, renderer) {
                    _super.call(this, model, el, renderer);
                    this.model = model;
                    this.el = el;
                    this.renderer = renderer;
                    this.no_results_text = AbstractChosenComponent.NO_RESULTS_TEXT_DEFAULT;
                    this.placeholder_text_multiple = "Select Some Options";
                    this.max_shown_results = null;
                    this.single_backstroke_delete = false;
                    this.max_selected_options = null;
                    this.maxselected = new core_1.EventEmitter();
                    this.previousInputLength = 0;
                    this.selectionCount = 0;
                }
                Object.defineProperty(ChosenMultipleComponent.prototype, "options", {
                    set: function (options) {
                        _super.prototype.setOptions.call(this, options);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ChosenMultipleComponent.prototype, "groups", {
                    set: function (groups) {
                        _super.prototype.setGroups.call(this, groups);
                    },
                    enumerable: true,
                    configurable: true
                });
                ChosenMultipleComponent.prototype.ngAfterViewInit = function () {
                    this.chosenDropComponent = this.chosenDropComponentQueryList.first;
                };
                ChosenMultipleComponent.prototype.updateModel = function () {
                    if (this.multipleSelectedOptions != null) {
                        this.onChange(this.multipleSelectedOptions.map(function (option) { return option.value; }));
                    }
                    else {
                        this.onChange(null);
                    }
                };
                ChosenMultipleComponent.prototype.isOptionInitiallySelected = function (option) {
                    if (this.initialValue == null) {
                        return false;
                    }
                    return this.initialValue.find(function (value) { return value == option.value; }) != null;
                };
                ChosenMultipleComponent.prototype.initialSelection = function (initialSelection) {
                    if (initialSelection != null) {
                        this.multipleSelectedOptions = initialSelection;
                        this.selectionCount = initialSelection.length;
                        console.log(this.selectionCount);
                    }
                };
                ChosenMultipleComponent.prototype.isSelectionEmpty = function () {
                    return this.selectionCount == 0;
                };
                ChosenMultipleComponent.prototype.selectOption = function (option) {
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
                };
                ChosenMultipleComponent.prototype.deselectOption = function (option, $event) {
                    if ($event != null) {
                        $event.stopPropagation();
                    }
                    option.selected = false;
                    console.log(this.multipleSelectedOptions.length);
                    this.multipleSelectedOptions = this.multipleSelectedOptions.filter(function (option_) { return option_ != option; });
                    console.log(this.multipleSelectedOptions.length);
                    this.selectionCount--;
                    this.updateModel();
                };
                ChosenMultipleComponent.prototype.onChosenFocus = function () {
                    if (this.max_selected_options != null && this.selectionCount == this.max_selected_options) {
                        return false;
                    }
                    this.inputValue = null;
                    return true;
                };
                ChosenMultipleComponent.prototype.onChosenBlur = function () {
                    if (this.isSelectionEmpty()) {
                        this.inputValue = this.placeholder_text_multiple;
                    }
                    else {
                        this.inputValue = null;
                    }
                };
                ChosenMultipleComponent.prototype.multipleInputKeyUp = function ($event) {
                    var value = $event.target.value;
                    if ($event.code == "Backspace" && this.previousInputLength == 0) {
                        this.multipleSelectedOptions.pop();
                        this.selectionCount--;
                        return;
                    }
                    this.inputKeyUp(value);
                    this.previousInputLength = value.length;
                };
                ChosenMultipleComponent.prototype.getOptionToHighlight = function () {
                    var _this = this;
                    if (this.options_ != null) {
                        var firstNonSelectedOption = this.options_.find(function (option) {
                            var selected = _this.multipleSelectedOptions.find(function (option_) { return option_ == option; }) != null;
                            return !selected && (!_this.filterMode || (_this.filterMode && option.hit));
                        });
                        if (firstNonSelectedOption != null) {
                            return firstNonSelectedOption;
                        }
                    }
                    return null;
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], ChosenMultipleComponent.prototype, "no_results_text", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], ChosenMultipleComponent.prototype, "placeholder_text_multiple", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], ChosenMultipleComponent.prototype, "max_shown_results", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Array), 
                    __metadata('design:paramtypes', [Array])
                ], ChosenMultipleComponent.prototype, "options", null);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Array), 
                    __metadata('design:paramtypes', [Array])
                ], ChosenMultipleComponent.prototype, "groups", null);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Boolean)
                ], ChosenMultipleComponent.prototype, "single_backstroke_delete", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Number)
                ], ChosenMultipleComponent.prototype, "max_selected_options", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', (typeof (_a = typeof core_1.EventEmitter !== 'undefined' && core_1.EventEmitter) === 'function' && _a) || Object)
                ], ChosenMultipleComponent.prototype, "maxselected", void 0);
                __decorate([
                    core_1.ViewChildren(ChosenDropComponent), 
                    __metadata('design:type', (typeof (_b = typeof core_1.QueryList !== 'undefined' && core_1.QueryList) === 'function' && _b) || Object)
                ], ChosenMultipleComponent.prototype, "chosenDropComponentQueryList", void 0);
                ChosenMultipleComponent = __decorate([
                    core_1.Component({
                        selector: 'chosen-multiple',
                        template: "\n    <div class=\"chosen-container chosen-container-multi\"\n        [class.chosen-container-active]=\"chosenContainerActive\"\n        [class.chosen-with-drop]=\"chosenWithDrop\">\n\n        <ul class=\"chosen-choices\">\n\n                <template [ngIf]=\"multipleSelectedOptions != null\">\n                    <template ngFor #option [ngForOf]=\"multipleSelectedOptions\" #i=\"index\">\n                        <li class=\"search-choice\">\n                            <span>{{option.label}}</span>\n                            <a class=\"search-choice-close\" (click)=\"deselectOption(option, $event);\"></a>\n                        </li>\n                    </template>\n                </template>\n\n                <li class=\"search-field\">\n                    <input #chosenInput type=\"text\"\n                    [(ngModel)]=\"inputValue\"\n                    [class.default]=\"isSelectionEmpty()\"\n                    (click)=\"chosenFocus()\"\n                    (blur)=\"chosenBlur()\"\n                    (keyup)=\"multipleInputKeyUp($event)\"\n                    autocomplete=\"off\"/>\n                </li>\n        </ul>\n\n        <div  class=\"chosen-drop\"\n            [disable_search]=\"true\"\n            [no_results_text]=\"no_results_text\"\n            [display_selected_options]=\"false\"\n            [filterMode]=\"filterMode\"\n            [options]=\"options_\" [groups]=\"groups_\"\n            (optionSelected)=\"selectOption($event)\"></div>\n\n    </div>\n    ",
                        directives: [common_1.CORE_DIRECTIVES, [ChosenDropComponent]]
                    }), 
                    __metadata('design:paramtypes', [(typeof (_c = typeof common_1.NgModel !== 'undefined' && common_1.NgModel) === 'function' && _c) || Object, (typeof (_d = typeof core_1.ElementRef !== 'undefined' && core_1.ElementRef) === 'function' && _d) || Object, (typeof (_e = typeof core_1.Renderer !== 'undefined' && core_1.Renderer) === 'function' && _e) || Object])
                ], ChosenMultipleComponent);
                return ChosenMultipleComponent;
                var _a, _b, _c, _d, _e;
            }(AbstractChosenComponent));
            exports_1("ChosenMultipleComponent", ChosenMultipleComponent);
        }
    }
});
//# sourceMappingURL=ng2-chosen.system.js.map