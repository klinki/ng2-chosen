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
    var ChosenComponent;
    return {
        setters:[
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            ChosenComponent = (function (_super) {
                __extends(ChosenComponent, _super);
                function ChosenComponent(model, el, renderer) {
                    _super.call(this, renderer, el);
                    this.model = model;
                    this.el = el;
                    this.renderer = renderer;
                    this.multiple = true;
                    this.placeholder_text_multiple = "Select Some Options";
                    this.placeholder_text_single = "Select an Option";
                    this.no_results_text = "No results match";
                    this.allow_single_deselect = false;
                    this.chosenContainerActive = false;
                    this.chosenWithDrop = false;
                    this.filterMode = false;
                    this.filterResultCount = 0;
                    model.valueAccessor = this;
                }
                Object.defineProperty(ChosenComponent.prototype, "options", {
                    set: function (options) {
                        if (options != null) {
                            this.options_ = options.map(function (option) {
                                return { value: option.value, label: option.label, selected: false, hit: false };
                            });
                            this.updateOptionsWithSelection();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                ChosenComponent.prototype.writeValue = function (value) {
                    if (value != null) {
                        this.initialValue = value;
                        this.updateOptionsWithSelection();
                    }
                };
                ChosenComponent.prototype.updateOptionsWithSelection = function () {
                    if (this.options_ != null) {
                        if (this.initialValue != null) {
                            if (this.multiple) {
                                this.multipleSelectedOptions = [];
                            }
                            var _loop_1 = function() {
                                var option = this_1.options_[i];
                                if (!this_1.multiple) {
                                    var initialValue = this_1.initialValue;
                                    if (initialValue === option.value) {
                                        this_1.singleSelectedOption = option;
                                        option.selected = true;
                                        return "break";
                                    }
                                }
                                else {
                                    var initialValue = this_1.initialValue;
                                    if (initialValue.find(function (value) { return value == option.value; }) != null) {
                                        this_1.multipleSelectedOptions.push(option);
                                    }
                                }
                            };
                            var this_1 = this;
                            for (var i = 0; i < this.options_.length; i++) {
                                var state_1 = _loop_1();
                                if (state_1 === "break") break;
                            }
                        }
                    }
                };
                ChosenComponent.prototype.chosenFocus = function (chosenInput) {
                    if (chosenInput != null) {
                        chosenInput.focus();
                    }
                    this.chosenContainerActive = true;
                    this.chosenWithDrop = true;
                };
                ChosenComponent.prototype.chosenBlur = function () {
                    this.chosenContainerActive = false;
                    this.chosenWithDrop = false;
                    this.filterMode = false;
                    this.inputValue = null;
                };
                ChosenComponent.prototype.inputKeyup = function ($event) {
                    var _this = this;
                    var inputValue = $event.target.value;
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
                ChosenComponent.prototype.getChosenInputValue = function () {
                    if (this.multiple) {
                        if (!this.chosenContainerActive && this.isSelectionEmpty()) {
                            return this.placeholder_text_multiple;
                        }
                        else {
                            return null;
                        }
                    }
                };
                ChosenComponent.prototype.isSelectionEmpty = function () {
                    if (this.multiple) {
                        return this.multipleSelectedOptions == null || this.multipleSelectedOptions.length == 0;
                    }
                    else {
                        return this.singleSelectedOption == null;
                    }
                };
                ChosenComponent.prototype.isOptionSelected = function (option) {
                    if (this.multiple) {
                        return this.multipleSelectedOptions.find(function (option_) { return option_ == option; }) != null;
                    }
                    else {
                        return this.singleSelectedOption == option;
                    }
                };
                ChosenComponent.prototype.showOptionInChosenDrop = function (option) {
                    return !this.filterMode || (this.filterMode && option.hit);
                };
                ChosenComponent.prototype.optionLabelInChosenDrop = function (option) {
                    if (this.filterMode) {
                        return option.labelWithMark;
                    }
                    else {
                        return option.label;
                    }
                };
                ChosenComponent.prototype.optionSelect = function (option) {
                    if (!this.multiple) {
                        this.singleSelectedOption = option;
                    }
                    else {
                        if (!this.multipleSelectedOptions.find(function (option_) { return option_ == option; })) {
                            this.multipleSelectedOptions.push(option);
                        }
                    }
                    this.updateModel();
                    this.chosenBlur();
                };
                ChosenComponent.prototype.optionDeselect = function (option, $event) {
                    if ($event != null) {
                        $event.stopPropagation();
                    }
                    if (!this.multiple) {
                        this.singleSelectedOption = null;
                    }
                    else {
                        this.multipleSelectedOptions = this.multipleSelectedOptions.filter(function (option_) { return option_ != option; });
                    }
                    this.updateModel();
                };
                ChosenComponent.prototype.updateModel = function () {
                    if (this.multiple) {
                        if (this.multipleSelectedOptions == null || this.multipleSelectedOptions.length == 0) {
                            this.onChange(null);
                        }
                        else {
                            this.onChange(this.multipleSelectedOptions.map(function (option) { return option.value; }));
                        }
                    }
                    else {
                        if (this.singleSelectedOption == null) {
                            this.onChange(null);
                        }
                        else {
                            this.onChange(this.singleSelectedOption.value);
                        }
                    }
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Boolean)
                ], ChosenComponent.prototype, "multiple", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], ChosenComponent.prototype, "placeholder_text_multiple", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], ChosenComponent.prototype, "placeholder_text_single", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], ChosenComponent.prototype, "no_results_text", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Boolean)
                ], ChosenComponent.prototype, "allow_single_deselect", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Array), 
                    __metadata('design:paramtypes', [Array])
                ], ChosenComponent.prototype, "options", null);
                ChosenComponent = __decorate([
                    core_1.Component({
                        selector: 'chosen',
                        template: "\n\n<div class=\"chosen-container\"\n    [class.chosen-container-multi]=\"multiple\"\n    [class.chosen-container-single]=\"!multiple\"\n    [class.chosen-container-active]=\"chosenContainerActive\"\n    [class.chosen-with-drop]=\"chosenWithDrop\">\n\n    <div [ngSwitch]=\"multiple\">\n        <template [ngSwitchWhen]=\"true\">\n            <ul class=\"chosen-choices\">\n                <template [ngIf]=\"multipleSelectedOptions != null\">\n                    <template ngFor #option [ngForOf]=\"multipleSelectedOptions\" #i=\"index\">\n                        <li class=\"search-choice\">\n                            <span>{{option.label}}</span>\n                            <a class=\"search-choice-close\"\n                                (click)=\"chosenInput.focus();optionDeselect(option, $event);\"\n                               data-option-array-index=\"4\">\n                            </a>\n                        </li>\n                    </template>\n                </template>\n\n                <li class=\"search-field\">\n                    <input #chosenInput type=\"text\"\n                    [value]=\"getChosenInputValue()\"\n                    [(ngModel)]=\"inputValue\"\n                    [class.default]=\"isSelectionEmpty()\"\n                    (focus)=\"chosenFocus()\"\n                    (blur)=\"chosenBlur()\"\n                    (keyup)=\"inputKeyup($event)\"\n                    tabindex=\"i\" autocomplete=\"off\"/>\n                </li>\n            </ul>\n        </template>\n        <template [ngSwitchWhen]=\"false\">\n            <a (click)=\"chosenFocus(chosenInput)\" class=\"chosen-single\"\n               [class.chosen-single-with-deselect]=\"!isSelectionEmpty() && allow_single_deselect\"\n               [class.chosen-default]=\"isSelectionEmpty()\">\n\n            <span [ngSwitch]=\"singleSelectedOption == null\">\n                 <template [ngSwitchWhen]=\"true\">\n                     {{placeholder_text_single}}\n                 </template>\n                 <template [ngSwitchWhen]=\"false\">\n                     {{singleSelectedOption.label}}\n                 </template>\n            </span>\n\n                <abbr *ngIf=\"!isSelectionEmpty() && allow_single_deselect\"\n                    (click)=\"optionDeselect(singleSelectedOption , $event)\" class=\"search-choice-close\">\n                </abbr>\n\n                <div><b></b></div>\n            </a>\n        </template>\n    </div>\n    <div class=\"chosen-drop\">\n        <div *ngIf=\"!multiple\" class=\"chosen-search\">\n            <input (blur)=\"chosenBlur()\" (keyup)=\"inputKeyup($event)\" [(ngModel)]=\"inputValue\"  #chosenInput type=\"text\" autocomplete=\"off\" tabindex=\"5\">\n        </div>\n        <ul class=\"chosen-results\">\n            <template ngFor #option [ngForOf]=\"options_\" #i=\"index\">\n                <li *ngIf=\"showOptionInChosenDrop(option)\"\n                    [class.highlighted]=\"option.highlighted\"\n                    [class.result-selected]=\"isOptionSelected(option)\"\n                    [class.active-result]=\"!isOptionSelected(option)\"\n                    (mouseover)=\"!isOptionSelected(option) && option.highlighted = true\"\n                    (mouseout)=\"option.highlighted = false\"\n                    (mousedown)=\"optionSelect(option)\"\n                    data-option-array-index=\"i\">\n                    <span [innerHtml]=\"optionLabelInChosenDrop(option)\"></span>\n                </li>\n            </template>\n\n            <li *ngIf=\"filterMode && filterResultCount == 0\"  class=\"no-results\">{{no_results_text}} \"<span>{{inputValue}}</span>\"</li>\n        </ul>\n    </div>\n</div>\n    ",
                        directives: [common_1.CORE_DIRECTIVES, common_1.FORM_DIRECTIVES]
                    }), 
                    __metadata('design:paramtypes', [(typeof (_a = typeof common_1.NgModel !== 'undefined' && common_1.NgModel) === 'function' && _a) || Object, (typeof (_b = typeof core_1.ElementRef !== 'undefined' && core_1.ElementRef) === 'function' && _b) || Object, (typeof (_c = typeof core_1.Renderer !== 'undefined' && core_1.Renderer) === 'function' && _c) || Object])
                ], ChosenComponent);
                return ChosenComponent;
                var _a, _b, _c;
            }(common_1.DefaultValueAccessor));
            exports_1("ChosenComponent", ChosenComponent);
        }
    }
});
//# sourceMappingURL=ng2-chosen.system.js.map