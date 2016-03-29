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
                    this.chosenInputQuery.first.nativeElement.focus();
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
                ], ChosenDropComponent.prototype, "filterMode", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Array)
                ], ChosenDropComponent.prototype, "options_", void 0);
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
                ], ChosenDropComponent.prototype, "chosenInputQuery", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Array), 
                    __metadata('design:paramtypes', [Array])
                ], ChosenDropComponent.prototype, "options", null);
                ChosenDropComponent = __decorate([
                    core_1.Component({
                        selector: 'div.chosen-drop',
                        template: "\n        <div *ngIf=\"!isSearchDisabled()\" class=\"chosen-search\">\n            <input (blur)=\"onInputBlur()\" (keyup)=\"onInputKeyup($event.target.value)\" [(ngModel)]=\"inputValue\" #chosenInput type=\"text\" autocomplete=\"off\" tabindex=\"5\">\n        </div>\n        <ul class=\"chosen-results\">\n            <template ngFor #option [ngForOf]=\"options_\" #i=\"index\">\n                <li *ngIf=\"isOptionVisible(option)\"\n                    [class.highlighted]=\"option.highlighted\"\n                    [class.result-selected]=\"isOptionSelected(option)\"\n                    [class.active-result]=\"!isOptionSelected(option)\"\n                    (mouseover)=\"!isOptionSelected(option) && option.highlighted = true\"\n                    (mouseout)=\"option.highlighted = false\"\n                    (mousedown)=\"selectOption(option)\"\n                    data-option-array-index=\"i\">\n                    <span [innerHtml]=\"getOptionLabel(option)\"></span>\n                </li>\n            </template>\n\n            <li *ngIf=\"filterMode && filterResultCount == 0\" class=\"no-results\">{{no_results_text}} \"<span>{{inputValue}}</span>\"</li>\n        </ul>\n\n    ",
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
                            return { value: option.value, label: option.label, selected: false, hit: false };
                        });
                        this.updateOptionsWithSelection();
                    }
                };
                AbstractChosenComponent.prototype.writeValue = function (value) {
                    if (value != null) {
                        this.initialValue = value;
                        this.updateOptionsWithSelection();
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
                };
                AbstractChosenComponent.prototype.chosenFocus = function () {
                    this.chosenContainerActive = true;
                    this.chosenWithDrop = true;
                    this.onChosenFocus();
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
                ChosenSingleComponent.prototype.updateOptionsWithSelection = function () {
                    if (this.options_ != null && this.initialValue != null) {
                        var initialValue = this.initialValue;
                        for (var i = 0; i < this.options_.length; i++) {
                            var option = this.options_[i];
                            if (initialValue === option.value) {
                                this.singleSelectedOption = option;
                                option.selected = true;
                                break;
                            }
                        }
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
                    if (this.singleSelectedOption != null) {
                        this.singleSelectedOption.selected = false;
                    }
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
                    this.singleSelectedOption = null;
                    this.updateModel();
                };
                ChosenSingleComponent.prototype.onChosenFocus = function () {
                    this.chosenDropComponentQuery.first.inputFocus();
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
                    core_1.ViewChildren(ChosenDropComponent), 
                    __metadata('design:type', Object)
                ], ChosenSingleComponent.prototype, "chosenDropComponentQuery", void 0);
                ChosenSingleComponent = __decorate([
                    core_1.Component({
                        selector: 'chosen-single',
                        template: "\n\n    <div class=\"chosen-container chosen-container-single\"\n        [class.chosen-container-active]=\"chosenContainerActive\"\n        [class.chosen-with-drop]=\"chosenWithDrop\">\n\n         <a (click)=\"chosenFocus(chosenInput)\"  class=\"chosen-single\"\n               [class.chosen-single-with-deselect]=\"!isSelectionEmpty() && allow_single_deselect\"\n               [class.chosen-default]=\"isSelectionEmpty()\">\n\n                <span [ngSwitch]=\"isSelectionEmpty()\">\n                    <template [ngSwitchWhen]=\"true\">\n                        {{placeholder_text_single}}\n                    </template>\n                    <template [ngSwitchWhen]=\"false\">\n                        {{singleSelectedOption.label}}\n                    </template>\n                </span>\n\n                <abbr *ngIf=\"!isSelectionEmpty() && allow_single_deselect\"\n                    (click)=\"deselectOption(singleSelectedOption , $event)\" class=\"search-choice-close\">\n                </abbr>\n\n                <div><b></b></div>\n        </a>\n\n        <div class=\"chosen-drop\"\n            [disable_search]=\"disable_search\"\n            [disable_search_threshold]=\"disable_search_threshold\"\n            [no_results_text]=\"no_results_text\"\n            [filterMode]=\"filterMode\"\n            [options]=\"options_\"\n            (optionSelected)=\"selectOption($event)\"\n            (inputKeyUp)=\"inputKeyUp($event)\"\n            (inputBlur)=\"chosenBlur()\"></div>\n\n    </div>\n\n    ",
                        directives: [common_1.CORE_DIRECTIVES, [ChosenDropComponent]]
                    }), 
                    __metadata('design:paramtypes', [(typeof (_a = typeof common_1.NgModel !== 'undefined' && common_1.NgModel) === 'function' && _a) || Object, (typeof (_b = typeof core_1.ElementRef !== 'undefined' && core_1.ElementRef) === 'function' && _b) || Object, (typeof (_c = typeof core_1.Renderer !== 'undefined' && core_1.Renderer) === 'function' && _c) || Object])
                ], ChosenSingleComponent);
                return ChosenSingleComponent;
                var _a, _b, _c;
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
                    this.selectionCount = 0;
                }
                Object.defineProperty(ChosenMultipleComponent.prototype, "options", {
                    set: function (options) {
                        _super.prototype.setOptions.call(this, options);
                    },
                    enumerable: true,
                    configurable: true
                });
                ChosenMultipleComponent.prototype.updateOptionsWithSelection = function () {
                    var _this = this;
                    if (this.options_ != null && this.initialValue != null) {
                        var initialValue_1 = this.initialValue;
                        this.options_.forEach(function (option) {
                            if (initialValue_1.find(function (value) { return value == option.value; }) != null) {
                                option.selected = true;
                                _this.selectionCount++;
                            }
                            else {
                                option.selected = false;
                            }
                        });
                    }
                };
                ChosenMultipleComponent.prototype.updateModel = function () {
                    this.onChange(this.options_.filter(function (option) { return option.selected; }).map(function (option) { return option.value; }));
                };
                ChosenMultipleComponent.prototype.isSelectionEmpty = function () {
                    return this.selectionCount == 0;
                };
                ChosenMultipleComponent.prototype.selectOption = function (option) {
                    option.selected = true;
                    this.selectionCount++;
                    this.updateModel();
                    this.chosenBlur();
                };
                ChosenMultipleComponent.prototype.deselectOption = function (option, $event) {
                    if ($event != null) {
                        $event.stopPropagation();
                    }
                    option.selected = false;
                    this.selectionCount--;
                    this.updateModel();
                };
                ChosenMultipleComponent.prototype.onChosenFocus = function () {
                    this.inputValue = null;
                };
                ChosenMultipleComponent.prototype.onChosenBlur = function () {
                    if (this.isSelectionEmpty()) {
                        this.inputValue = this.placeholder_text_multiple;
                    }
                    else {
                        this.inputValue = null;
                    }
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
                ChosenMultipleComponent = __decorate([
                    core_1.Component({
                        selector: 'chosen-multiple',
                        template: "\n    <div class=\"chosen-container chosen-container-multi\"\n        [class.chosen-container-active]=\"chosenContainerActive\"\n        [class.chosen-with-drop]=\"chosenWithDrop\">\n\n        <ul class=\"chosen-choices\">\n\n                <template [ngIf]=\"options_ != null\">\n                    <template ngFor #option [ngForOf]=\"options_\" #i=\"index\">\n                        <li *ngIf=\"option.selected\" class=\"search-choice\">\n                            <span>{{option.label}}</span>\n                            <a class=\"search-choice-close\" (click)=\"chosenInput.focus();deselectOption(option, $event);\" data-option-array-index=\"4\"></a>\n                        </li>\n                    </template>\n                </template>\n\n                <li class=\"search-field\">\n                    <input #chosenInput type=\"text\"\n                    [(ngModel)]=\"inputValue\"\n                    [class.default]=\"isSelectionEmpty()\"\n                    (focus)=\"chosenFocus()\"\n                    (blur)=\"chosenBlur()\"\n                    (keyup)=\"inputKeyUp($event.target.value)\"\n                    tabindex=\"i\" autocomplete=\"off\"/>\n                </li>\n        </ul>\n\n        <div  class=\"chosen-drop\"\n            [disable_search]=\"true\"\n            [no_results_text]=\"no_results_text\"\n            [filterMode]=\"filterMode\"\n            [options]=\"options_\"\n            (optionSelected)=\"selectOption($event)\"></div>\n\n    </div>\n\n    ",
                        directives: [common_1.CORE_DIRECTIVES, [ChosenDropComponent]]
                    }), 
                    __metadata('design:paramtypes', [(typeof (_a = typeof common_1.NgModel !== 'undefined' && common_1.NgModel) === 'function' && _a) || Object, (typeof (_b = typeof core_1.ElementRef !== 'undefined' && core_1.ElementRef) === 'function' && _b) || Object, (typeof (_c = typeof core_1.Renderer !== 'undefined' && core_1.Renderer) === 'function' && _c) || Object])
                ], ChosenMultipleComponent);
                return ChosenMultipleComponent;
                var _a, _b, _c;
            }(AbstractChosenComponent));
            exports_1("ChosenMultipleComponent", ChosenMultipleComponent);
        }
    }
});
//# sourceMappingURL=ng2-chosen.system.js.map