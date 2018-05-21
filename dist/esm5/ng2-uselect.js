import { Injectable, Component, Input, ViewChild, ElementRef, HostListener, forwardRef, Directive, Output, EventEmitter, ContentChild, NgModule } from '@angular/core';
import { NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { sortBy, remove, some } from 'lodash/lodash';
import { CommonModule } from '@angular/common';

var UselectDefaultConfig = /** @class */ (function () {
    function UselectDefaultConfig() {
        this.placeholder = 'Select an item...';
        this.ignoreClickElements = [
            'a',
            'button',
            'input',
            'textarea',
            'select',
            'option',
            'label'
        ];
    }
    return UselectDefaultConfig;
}());
UselectDefaultConfig.decorators = [
    { type: Injectable },
];
var UselectComponent = /** @class */ (function () {
    function UselectComponent(defaultConfig) {
        this.defaultConfig = defaultConfig;
        this.serviceMethod = 'getItems';
        this.itemId = 'id';
        this.servicePipe = function (res) {
            return res;
        };
        this.disabled = false;
        this.disableEmpty = false;
        this.search = '';
        this.isDropDownOpen = false;
        this.highlightedIndex = 0;
        this._onChange = function (_) { };
        this._onTouched = function () { };
        this._draggableIndexes = {
            start: undefined,
            over: undefined
        };
    }
    UselectComponent.prototype.clickedOutside = function ($event) {
        this.toggleDropDown(false);
    };
    UselectComponent.prototype.ngOnInit = function () {
        if (!this.placeholder)
            this.placeholder = this.defaultConfig.placeholder;
    };
    UselectComponent.prototype.writeValue = function (value) {
        var _this = this;
        this.value = value;
        if (this.isMultiple() &&
            this.sortKey &&
            ((this.value)).length) {
            this.value = (sortBy(this.value, function (val) {
                if (!val)
                    return;
                if (!(val instanceof Object) ||
                    !((val)).hasOwnProperty(_this.sortKey))
                    throw new Error('Sort key must be a part of item. Ex: {id: 1, value: {string: "example"}, sort: 1}.');
                return val[_this.sortKey];
            }));
            this.normalizeSort();
        }
        else if (!this.isMultiple()) {
            if (!this.value)
                return;
            if (!this.isScalar() && !this.value[this.itemId])
                this.value = undefined;
        }
    };
    UselectComponent.prototype.registerOnChange = function (fn) {
        this._onChange = fn;
    };
    UselectComponent.prototype.registerOnTouched = function (fn) {
        this._onTouched = fn;
    };
    UselectComponent.prototype.onUselectIndexChange = function ($event) {
        this._draggableIndexes.over = $event;
        if (this._draggableIndexes.over != this._draggableIndexes.start) {
            var overEl = this.value[this._draggableIndexes.over];
            this.value[this._draggableIndexes.start][this.sortKey] = this._draggableIndexes.over;
            this.value[this._draggableIndexes.over][this.sortKey] = this._draggableIndexes.start;
            this.value[this._draggableIndexes.over] = this.value[this._draggableIndexes.start];
            this.value[this._draggableIndexes.start] = overEl;
            this._draggableIndexes.start = this._draggableIndexes.over;
        }
    };
    UselectComponent.prototype.onUselectDragstart = function ($event) {
        this._draggableIndexes.start = $event;
        this._draggableIndexes.over = undefined;
        this.toggleDropDown(false);
    };
    UselectComponent.prototype.normalizeSort = function () {
        if (this.isMultiple() && this.sortKey) {
            for (var i = 0; i < ((this.value)).length; i++) {
                this.value[i][this.sortKey] = i;
            }
        }
    };
    UselectComponent.prototype.dropDownValue = function (item) {
        if (this.dropDownValueFunc)
            return this.dropDownValueFunc(item);
        return (item[this.itemId]);
    };
    UselectComponent.prototype.selectedValue = function (item) {
        if (this.selectedValueFunc)
            return this.selectedValueFunc(item);
        return (item[this.itemId]);
    };
    UselectComponent.prototype.selectItem = function (item) {
        var _this = this;
        if (this.isMultiple()) {
            if (this.isCurrent(item)) {
                remove((this.value), function (val) { return val[_this.itemId] == item[_this.itemId]; });
            }
            else {
                if (this.deleteKey && item[this.deleteKey])
                    item[this.deleteKey] = false;
                else
                    ((this.value)).push(item);
            }
            this.normalizeSort();
        }
        else {
            if (this.isScalar())
                this.value = item[this.itemId];
            else
                this.value = item;
            if (this.deleteKey && this.value[this.deleteKey])
                this.value[this.deleteKey] = false;
            setTimeout(function (_) {
                _this.isDropDownOpen = false;
                if ('' != _this.search) {
                    _this.search = '';
                    _this.onSearchChange();
                }
            });
        }
        this._onChange(this.value);
        return false;
    };
    UselectComponent.prototype.removeItem = function (item) {
        var _this = this;
        if (this.disabled)
            return;
        if (this.isMultiple()) {
            if (this.deleteKey) {
                var finded = ((this.value)).find(function (val) { return val[_this.itemId] == item[_this.itemId]; });
                finded[this.deleteKey] = true;
            }
            else {
                remove((this.value), function (val) { return val[_this.itemId] == item[_this.itemId]; });
            }
            this.normalizeSort();
        }
        else {
            if (this.deleteKey)
                this.value[this.deleteKey] = true;
            else
                this.value = undefined;
        }
        this._onChange(this.value);
    };
    UselectComponent.prototype.onSearchChange = function () {
        var _this = this;
        if (!this.service[this.serviceMethod])
            throw new Error("Method '" + this.serviceMethod + "' are missed in service");
        this.service[this.serviceMethod]
            .apply(this.service, !!this.serviceMethodArgs && 0 != this.serviceMethodArgs.length
            ? this.serviceMethodArgs
            : [this.search])
            .pipe(function (res) { return _this.servicePipe.apply(undefined, [res].concat(_this.pipeArgs)); })
            .subscribe(function (data) {
            _this.items = (data);
        });
        this.highlightedIndex = 0;
    };
    UselectComponent.prototype.onItemDrop = function ($event) {
        this.normalizeSort();
    };
    UselectComponent.prototype.onSearchKeydown = function ($event) {
        switch ($event.keyCode) {
            case 40:
                if (this.highlightedIndex < this.items.length - 1)
                    this.highlightedIndex++;
                break;
            case 38:
                if (0 < this.highlightedIndex)
                    this.highlightedIndex--;
                break;
            case 13:
                this.selectItem(this.items[this.highlightedIndex]);
                break;
            case 27:
                this.toggleDropDown(false);
                break;
        }
    };
    UselectComponent.prototype.isMultiple = function () {
        return this.value instanceof Array;
    };
    UselectComponent.prototype.isScalar = function () {
        return (!this.isMultiple() &&
            'object' !== typeof this.value &&
            'undefined' !== typeof this.value);
    };
    UselectComponent.prototype.toggleDropDown = function (isOpen, $event) {
        var _this = this;
        if (isOpen === void 0) { isOpen = true; }
        if (this.disabled || !this.service)
            return;
        if ($event) {
            if (-1 !==
                this.defaultConfig.ignoreClickElements.indexOf($event.target['tagName'].toLowerCase()) &&
                !$event.target['classList'].contains('uselect__btn-dropdown'))
                return;
            $event.preventDefault();
            $event.stopPropagation();
            if ('button' == $event.target['tagName'].toLowerCase() ||
                'button' == $event.target['parentNode']['tagName'].toLowerCase())
                return;
        }
        this.isDropDownOpen = isOpen;
        if (isOpen) {
            if (!this.items)
                this.onSearchChange();
            setTimeout(function (_) {
                _this.uselectSearch.nativeElement.focus();
            });
        }
        else {
            if ('' != this.search) {
                this.search = '';
                this.onSearchChange();
            }
        }
    };
    UselectComponent.prototype.isCurrent = function (item) {
        var _this = this;
        if (!this.value ||
            (this.value && this.deleteKey && this.value[this.deleteKey]))
            return false;
        if (this.isMultiple()) {
            if (0 == ((this.value)).length)
                return false;
            return some((this.value), function (val) {
                return (val[_this.itemId] == item[_this.itemId] &&
                    (!_this.deleteKey || !item[_this.deleteKey]));
            });
        }
        if (this.isScalar() &&
            this.value == item[this.itemId] &&
            (!this.deleteKey || !item[this.deleteKey]))
            return true;
        return ((this.value))[this.itemId] == item[this.itemId];
    };
    UselectComponent.prototype.arrValue = function () {
        return (this.value);
    };
    UselectComponent.prototype.trackByIndex = function (index, obj) {
        return index;
    };
    return UselectComponent;
}());
UselectComponent.decorators = [
    { type: Component, args: [{
                selector: 'uselect',
                template: "<div\n  class=\"uselect__holder\"\n  tabindex=\"0\"\n  [class.uselect__dropdown--open]=\"isDropDownOpen\"\n  [class.uselect__holder--disabled]=\"disabled\">\n  <div class=\"uselect__select input-group\"\n    [class.uselect___select--has-value]=\"(!isMultiple() && value) || (isMultiple() && 0 < arrValue().length)\"\n    (click)=\"toggleDropDown(true, $event)\">\n    <div class=\"form-control\">\n      <div *ngIf=\"value && isMultiple() && 0 < arrValue().length\"\n        class=\"uselect__selected-items\"\n        [uselectSortableData]=\"value\">\n        <ng-container\n          *ngFor=\"let selectedItem of value; let i = index; trackByIndex\">\n          <div *ngIf=\"!deleteKey || !selectedItem[deleteKey]\"\n            class=\"uselect__select-item\" [uselectSortableIndex]=\"sortKey ? i : undefined\"\n            (onUselectIndexChange)=\"onUselectIndexChange($event)\"\n            (onUselectDragstart)=\"onUselectDragstart($event)\">\n            <span class=\"uselect__select-item-template\">\n              <ng-container\n                *ngTemplateOutlet=\"selectTemplate; context: {$implicit: selectedItem}\"></ng-container>\n              <ng-container\n                *ngIf=\"!selectTemplate\">\n                {{selectedValue(selectedItem)}}\n              </ng-container>\n            </span>\n            <div class=\"btn-group ml-auto\">\n              <button *ngIf=\"sortKey\"\n                type=\"button\" class=\"btn btn-light btn-sm\" aria-label=\"Move\"\n                uselectSortableHandle>\n                <span aria-hidden=\"true\">&#x2195;</span>\n              </button>\n              <button type=\"button\" class=\"btn btn-light btn-sm\" aria-label=\"Move\"\n                (click)=\"removeItem(selectedItem)\">\n                <span aria-hidden=\"true\">&times;</span>\n              </button>\n            </div>\n          </div>\n        </ng-container>\n      </div>\n      <div *ngIf=\"value && !isMultiple() && (!deleteKey || !value[deleteKey])\" class=\"uselect__selected-items\">\n        <div class=\"uselect__select-item\">\n          <ng-container\n            *ngTemplateOutlet=\"selectTemplate; context: {$implicit: value}\"></ng-container>\n          <ng-container\n            *ngIf=\"!selectTemplate\">\n            {{selectedValue(value)}}\n          </ng-container>\n          <div class=\"btn-group ml-auto\">\n            <button *ngIf=\"!disableEmpty\"\n              type=\"button\" class=\"btn btn-light btn-sm\" aria-label=\"Move\"\n              (click)=\"removeItem(selectedItem)\">\n              <span aria-hidden=\"true\">&times;</span>\n            </button>\n          </div>\n        </div>\n      </div>\n      <div *ngIf=\"(!value || (deleteKey && (value && value[deleteKey]))) || 0 == arrValue().length\"\n        class=\"uselect__placeholder\">\n        {{placeholder}}\n      </div>\n    </div>\n    <div *ngIf=\"service && isMultiple()\" class=\"input-group-append\">\n      <button class=\"uselect__btn-dropdown btn btn-outline-secondary dropdown-toggle\" type=\"button\" (click)=\"toggleDropDown(!isDropDownOpen)\"></button>\n    </div>\n  </div>\n  <div class=\"uselect__dropdown form-control\">\n    <div class=\"uselect__search input-group\">\n      <input type=\"text\" class=\"form-control\"\n        [(ngModel)]=\"search\"\n        (ngModelChange)=\"onSearchChange()\"\n        (keydown)=\"onSearchKeydown($event)\"\n        tabindex=\"0\"\n        #uselectSearch />\n    </div>\n    <div class=\"uselect__items\">\n      <div *ngFor=\"let dataItem of items; let i = index; trackByIndex\"\n        class=\"uselect__item\"\n        [class.uselect__item--selected]=\"isCurrent(dataItem)\"\n        [class.uselect__item--highlighted]=\"highlightedIndex == i\"\n        (click)=\"selectItem(dataItem)\">\n        <ng-container\n          *ngTemplateOutlet=\"dropDownTemplate; context: {$implicit: dataItem}\">\n        </ng-container>\n        <ng-container *ngIf=\"!dropDownTemplate\">\n          {{dropDownValue(dataItem)}}\n        </ng-container>\n      </div>\n    </div>\n  </div>\n</div>\n",
                styles: [":host{display:-webkit-box;display:-ms-flexbox;display:flex;max-height:100%}:host .uselect__holder{width:100%;position:relative}:host .uselect__holder.uselect__holder--disabled .form-control{background-color:#e9ecef;color:#212529}:host .uselect__holder.uselect__holder--disabled .form-control .btn{display:none}:host .uselect__holder .uselect__select{width:100%;max-height:100%}:host .uselect__holder .uselect__select>.form-control{padding:6px;max-height:100%}:host .uselect__holder .uselect__select .uselect__btn-dropdown{height:100%}:host .uselect__holder .uselect__select .uselect__selected-items{width:100%;max-height:100%;overflow:auto}:host .uselect__holder .uselect__select .uselect__selected-items .uselect__select-item{display:-webkit-box;display:-ms-flexbox;display:flex;width:100%;-webkit-box-align:center;-ms-flex-align:center;align-items:center;padding:0 3px}:host .uselect__holder .uselect__select .uselect__selected-items .uselect__select-item+.uselect__select-item{margin-top:3px}:host .uselect__holder .uselect__select .uselect__selected-items .uselect__select-item.uselect__select-item--draggable{-webkit-transform:scale(.95);transform:scale(.95);border:1px dashed #cecece;border-radius:2px;background:rgba(255,255,255,.8)}:host .uselect__holder .uselect__select .uselect__selected-items .uselect__select-item span.uselect__select-item-template{width:100%;max-width:100%;overflow:hidden}:host .uselect__holder .uselect__select .uselect__selected-items .uselect__select-item .btn[uselectsortablehandle]{cursor:move}:host .uselect__holder .uselect__select .uselect__selected-items .uselect__select-item .btn[uselectsortablehandle]:hover{background-color:#f8f9fa;border-color:#f8f9fa}:host .uselect__holder .uselect__dropdown{position:absolute;z-index:2147483647;display:none}:host .uselect__holder.uselect__dropdown--open .uselect__select>div{border-bottom-left-radius:0}:host .uselect__holder.uselect__dropdown--open .uselect__select .uselect__btn-dropdown{border-bottom-right-radius:0}:host .uselect__holder.uselect__dropdown--open .uselect__dropdown{display:block;border-top-left-radius:0;border-top-right-radius:0;border-top:none;padding:0;width:100%}:host .uselect__holder.uselect__dropdown--open .uselect__dropdown .uselect__search{width:100%;padding:5px}:host .uselect__holder.uselect__dropdown--open .uselect__dropdown .uselect__items{max-height:33vh;overflow-x:hidden;overflow-y:auto}:host .uselect__holder.uselect__dropdown--open .uselect__dropdown .uselect__items .uselect__item{display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-ms-flex-align:center;align-items:center;padding:5px 8px}:host .uselect__holder.uselect__dropdown--open .uselect__dropdown .uselect__items .uselect__item.uselect__item--highlighted,:host .uselect__holder.uselect__dropdown--open .uselect__dropdown .uselect__items .uselect__item:hover{cursor:pointer;background-color:#f8f9fa;color:#212529}:host .uselect__holder.uselect__dropdown--open .uselect__dropdown .uselect__items .uselect__item.uselect__item--selected{background-color:#007bff;color:#fff}"],
                providers: [
                    {
                        provide: NG_VALUE_ACCESSOR,
                        useExisting: forwardRef(function () { return UselectComponent; }),
                        multi: true
                    }
                ]
            },] },
];
UselectComponent.ctorParameters = function () { return [
    { type: UselectDefaultConfig, },
]; };
UselectComponent.propDecorators = {
    "placeholder": [{ type: Input, args: ['placeholder',] },],
    "service": [{ type: Input, args: ['service',] },],
    "serviceMethod": [{ type: Input, args: ['serviceMethod',] },],
    "serviceMethodArgs": [{ type: Input, args: ['serviceMethodArgs',] },],
    "itemId": [{ type: Input, args: ['itemId',] },],
    "servicePipe": [{ type: Input, args: ['pipe',] },],
    "pipeArgs": [{ type: Input, args: ['pipeArgs',] },],
    "dropDownValueFunc": [{ type: Input, args: ['dropDownValue',] },],
    "selectedValueFunc": [{ type: Input, args: ['selectedValue',] },],
    "dropDownTemplate": [{ type: Input, args: ['dropDownTemplate',] },],
    "selectTemplate": [{ type: Input, args: ['selectTemplate',] },],
    "sortKey": [{ type: Input, args: ['sortKey',] },],
    "disabled": [{ type: Input, args: ['disabled',] },],
    "disableEmpty": [{ type: Input, args: ['disableEmpty',] },],
    "deleteKey": [{ type: Input, args: ['deleteKey',] },],
    "uselectSearch": [{ type: ViewChild, args: ['uselectSearch',] },],
    "clickedOutside": [{ type: HostListener, args: ['document:click', ['$event'],] },],
};
var UselectSortableDataDirective = /** @class */ (function () {
    function UselectSortableDataDirective(el) {
        this.el = el;
    }
    UselectSortableDataDirective.prototype.onDragStart = function (event) {
        event.dataTransfer.effectAllowed = 'move';
        return true;
    };
    UselectSortableDataDirective.prototype.onDragEnd = function (event) {
        return true;
    };
    return UselectSortableDataDirective;
}());
UselectSortableDataDirective.decorators = [
    { type: Directive, args: [{
                selector: '[uselectSortableData]'
            },] },
];
UselectSortableDataDirective.ctorParameters = function () { return [
    { type: ElementRef, },
]; };
UselectSortableDataDirective.propDecorators = {
    "uselectSortableData": [{ type: Input, args: ['uselectSortableData',] },],
    "onDragStart": [{ type: HostListener, args: ['dragstart', ['$event'],] },],
    "onDragEnd": [{ type: HostListener, args: ['dragend', ['$event'],] },],
};
var UselectSortableHandle = /** @class */ (function () {
    function UselectSortableHandle() {
        this._md = false;
    }
    Object.defineProperty(UselectSortableHandle.prototype, "isMouseDown", {
        get: function () {
            return this._md;
        },
        enumerable: true,
        configurable: true
    });
    UselectSortableHandle.prototype.onmousedown = function () {
        this._md = true;
        return true;
    };
    UselectSortableHandle.prototype.onmouseup = function () {
        this._md = false;
        return true;
    };
    UselectSortableHandle.prototype.onmouseleave = function () {
        this._md = false;
        return true;
    };
    return UselectSortableHandle;
}());
UselectSortableHandle.decorators = [
    { type: Directive, args: [{
                selector: '[uselectSortableHandle]'
            },] },
];
UselectSortableHandle.propDecorators = {
    "onmousedown": [{ type: HostListener, args: ['mousedown',] },],
    "onmouseup": [{ type: HostListener, args: ['mouseup',] },],
    "onmouseleave": [{ type: HostListener, args: ['mouseleave',] },],
};
var UselectSortableIndexDirective = /** @class */ (function () {
    function UselectSortableIndexDirective(el) {
        this.el = el;
        this.uselectIndexChange = new EventEmitter();
        this.uselectDragstart = new EventEmitter();
    }
    UselectSortableIndexDirective.prototype.onMouseDown = function (event) {
        if (undefined == this.uselectSortableIndex)
            return true;
        if ((this.uselectSortableHandler &&
            this.uselectSortableHandler.isMouseDown) ||
            !this.uselectSortableHandler) {
            this.el.nativeElement.draggable = true;
            this.el.nativeElement.classList.add('uselect__select-item--draggable');
            this.uselectDragstart.emit(this.uselectSortableIndex);
        }
        return true;
    };
    UselectSortableIndexDirective.prototype.onDragEnd = function (event) {
        this.el.nativeElement.draggable = false;
        this.el.nativeElement.classList.remove('uselect__select-item--draggable');
        return true;
    };
    UselectSortableIndexDirective.prototype.onDragOver = function (event) {
        event.dataTransfer.dropEffect = 'move';
        this.uselectIndexChange.emit(this.uselectSortableIndex);
        return false;
    };
    UselectSortableIndexDirective.prototype.onDrag = function (event) {
        if (!event.target['classList'].contains('uselect__select-item')) {
            return true;
        }
        var parent = event.target['closest']('.uselect__selected-items'), percent = 0.2;
        if (parent['offsetHeight'] * (1 - percent) <
            event.target['offsetTop'] - parent['scrollTop']) {
            parent['scrollTop'] = parent['scrollTop'] + event.target['offsetHeight'];
        }
        else if (parent['offsetHeight'] * percent >
            event.target['offsetTop'] - parent['scrollTop']) {
            parent['scrollTop'] = parent['scrollTop'] - event.target['offsetHeight'];
        }
        return true;
    };
    return UselectSortableIndexDirective;
}());
UselectSortableIndexDirective.decorators = [
    { type: Directive, args: [{
                selector: '[uselectSortableIndex]',
                host: {
                    draggable: 'false',
                    uselectsortable: 'true'
                }
            },] },
];
UselectSortableIndexDirective.ctorParameters = function () { return [
    { type: ElementRef, },
]; };
UselectSortableIndexDirective.propDecorators = {
    "uselectSortableIndex": [{ type: Input, args: ['uselectSortableIndex',] },],
    "uselectIndexChange": [{ type: Output, args: ['onUselectIndexChange',] },],
    "uselectDragstart": [{ type: Output, args: ['onUselectDragstart',] },],
    "uselectSortableHandler": [{ type: ContentChild, args: [UselectSortableHandle,] },],
    "onMouseDown": [{ type: HostListener, args: ['mousedown', ['$event'],] },],
    "onDragEnd": [{ type: HostListener, args: ['dragend', ['$event'],] },],
    "onDragOver": [{ type: HostListener, args: ['dragover', ['$event'],] },],
    "onDrag": [{ type: HostListener, args: ['drag', ['$event'],] },],
};
var UselectModule = /** @class */ (function () {
    function UselectModule() {
    }
    return UselectModule;
}());
UselectModule.decorators = [
    { type: NgModule, args: [{
                imports: [CommonModule, FormsModule],
                declarations: [
                    UselectComponent,
                    UselectSortableDataDirective,
                    UselectSortableIndexDirective,
                    UselectSortableHandle
                ],
                providers: [UselectDefaultConfig],
                exports: [UselectComponent]
            },] },
];

export { UselectModule, UselectDefaultConfig as ɵb, UselectComponent as ɵa, UselectSortableDataDirective as ɵc, UselectSortableHandle as ɵd, UselectSortableIndexDirective as ɵe };
//# sourceMappingURL=ng2-uselect.js.map
